const jwt = require('jsonwebtoken');
const User = require('../model/user');

async function checkRole(req, res, next, roleRequired) {
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No valid token provided.');
        return res.status(403).send('Access denied. No valid token provided.');
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.id);
        console.log('Found user:', user);

        if (!user) {
            console.log('Failed to authenticate token.');
            return res.status(500).send('Failed to authenticate token.');
        }

        if (user.role !== roleRequired) {
            console.log('Forbidden access: user role does not match required role.');
            return res.status(403).send('Forbidden');
        }

        req.user = user;
        console.log('User verified, continuing to next middleware.');
        next();
    } catch (err) {
        console.error('Error verifying token:', err);
        return res.status(500).send('Failed to authenticate token.');
    }
}

module.exports = {
    isAdmin: (req, res, next) => checkRole(req, res, next, 'admin'),
    isUser: (req, res, next) => checkRole(req, res, next, 'user')
};