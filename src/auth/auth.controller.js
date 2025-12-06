// src/auth/auth.controller.js
const authService = require('./auth.service');

exports.register = async (req, res) => {
  try {
    // TAMBAHKAN phone DI SINI
    const { username, email, password, phone } = req.body; 

    if (!username || !password) return res.status(400).json({ message: 'username and password required' });

    // KIRIM phone KE SERVICE
    const user = await authService.registerUser({ username, email, password, phone });
    
    return res.status(201).json({ message: 'user created', user });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    // 1. Ambil 'email' dari input, bukan username
    const { email, password } = req.body; 
    
    // 2. Validasi cek email
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    // 3. Kirim object { email, password } ke service
    const token = await authService.loginUser({ email, password });
    
    return res.json({ message: 'login success', token });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'internal server error' });
  }
};