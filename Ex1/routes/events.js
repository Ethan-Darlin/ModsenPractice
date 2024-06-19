// routes/events.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const EventController = require('../controllers/event-controller');
const EventsService = require('../services/events-service');

const prisma = new PrismaClient();
const eventsService = new EventsService(prisma);
const eventController = new EventController(eventsService);

const router = express.Router();

router.get('/', (req, res) => eventController.getEvents(req, res));
router.get('/:id', (req, res) => eventController.getEventById(req, res));

module.exports = router;