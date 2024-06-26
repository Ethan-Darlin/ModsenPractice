const express = require('express');
const { PrismaClient } = require('@prisma/client');
const EventController = require('../controllers/event-controller');
const EventsService = require('../services/events-service');
const prisma = new PrismaClient();
const eventsService = new EventsService(prisma);
const eventController = new EventController(eventsService);
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const invalidatedTokens = new Set();
const { isAdmin } = require('../middlewares/roleMiddleware');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление событиями
 * 
 * /meetups:
 *   get:
 *     summary: Получить список митапов
 *     tags: [Events]
 *     responses:
 *       '200':
 *         description: Успешный ответ
 *         content:
 *           application/json:    
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *   post:
 *     summary: Создать митап
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEvent'
 *     responses:
 *       '201':
 *         description: Успешное создание митапа
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 * 
 * /meetups/{id}:
 *   get:
 *     summary: Получить информацию о митапе
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *   patch:
 *     summary: Обновить информацию о митапе
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEvent'
 *     responses:
 *       '200':
 *         description: Успешное обновление митапа
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *   delete:
 *     summary: Удалить митап
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Успешное удаление митапа
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *     CreateEvent:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *     UpdateEvent:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 */
router.get('/', (req, res) => eventController.getEvents(req, res));
router.get('/:id', (req, res) => eventController.getEventById(req, res));
// Маршрут для создания митапа
router.post('/create', isAdmin, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader.split(' ')[1];
    if (invalidatedTokens.has(accessToken)) {
      return res.status(403).json({ message: 'Token has been invalidated' });
    }
    //Логика
    const event = await eventController.createEvent(req, res);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error during create event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/:id', isAdmin, (req, res) => eventController.updateEvent(req, res));

router.delete('/:id', isAdmin, (req, res) => eventController.deleteEvent(req, res));

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const userWithTokens = await User.createUser(username, password);
  res.json(userWithTokens); // Возвращаем оба токена
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findByUsername(username);
  console.log('Authorization header:', req.headers.authorization);

  if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' }); 
  const refreshToken = jwt.sign({ id: user.id }, 'your_refresh_token_secret');
  await User.updateRefreshToken(user.id, refreshToken);

  res.json({ accessToken, refreshToken });
});
router.post('/logout', async (req, res) => {
  try {
    console.log('Black list:', Array.from(invalidatedTokens));
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ message: 'No valid token provided' });
    }
    const accessToken = authHeader.split(' ')[1];

    invalidatedTokens.add(accessToken);
    console.log('Black list:', Array.from(invalidatedTokens));

    await User.updateRefreshToken(userId, null);

    res.setHeader('Authorization', '');

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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