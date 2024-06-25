const express = require('express');
const { PrismaClient } = require('@prisma/client');
const EventController = require('../controllers/event-controller');
const EventsService = require('../services/events-service');
const prisma = new PrismaClient();
const eventsService = new EventsService(prisma);
const eventController = new EventController(eventsService);
const User = require('../model/user'); // Импорт экземпляра User
const bcrypt = require('bcryptjs'); // Import bcrypt here
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => eventController.getEvents(req, res));
router.get('/:id', (req, res) => eventController.getEventById(req, res));
router.post('/create', (req, res) => eventController.createEvent(req, res));
router.delete('/:id', (req, res) => eventController.deleteEvent(req, res));
router.patch('/:id', (req, res) => eventController.updateEvent(req, res));
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const newUser = await User.createUser(username, password);
    res.status(201).json(newUser);
  });
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
  
    if (!user ||!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    const accessToken = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, 'your_refresh_token_secret');
    await User.updateRefreshToken(user.id, refreshToken);
  
    res.json({ accessToken, refreshToken });
  });
    
  router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
  
    try {
      const user = await User.findById(refreshToken);
      if (!user ||!user.refreshToken) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
  
      const newAccessToken = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
module.exports = router;