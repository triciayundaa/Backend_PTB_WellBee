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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const result = await authService.loginUser({ email, password });

    return res.json({
      message: "login success",
      token: result.token,   // BENAR
      user: result.user      // BENAR → punya id
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};






