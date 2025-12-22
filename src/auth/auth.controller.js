const authService = require('./auth.service');

exports.register = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body; 
        if (!username || !password) return res.status(400).json({ message: 'username and password required' });

        const user = await authService.registerUser({ username, email, password, phone });
        return res.status(201).json({ message: 'user created', user });
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message || 'internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; 
        if (!email || !password) return res.status(400).json({ message: 'email and password required' });

        const { token, user } = await authService.loginUser({ email, password });

        return res.json({ 
            message: 'login success', 
            token, 
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            } 
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message || 'internal server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await authService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(user); 
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        console.log("Body yang diterima backend:", req.body); 

        const { email, newPassword } = req.body;
        
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password are required' });
        }

        await authService.resetUserPasswordSimple({ email, newPassword });
        
        return res.json({ message: 'Password has been reset successfully' });
    } catch (err) {
        console.error("Reset Password Error:", err.message);
        return res.status(err.status || 500).json({ message: err.message || 'internal server error' });
    }
};