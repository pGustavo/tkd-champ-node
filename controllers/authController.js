const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    const { username, password } = req.body;

    User.findByUsername(username, async (err, user) => {
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = password == user.password; // Use bcrypt.compare if passwords are hashed
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};
