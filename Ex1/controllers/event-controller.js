// controllers/event-controller.js
const EventsService = require('../services/events-service');

class EventController {
    constructor(eventService) {
        this.eventService = eventService;
    }

    async getEvents(req, res) {
        const events = await this.eventService.getEvents();
        res.json(events);
    }

    async getEventById(req, res) {
        const eventId = parseInt(req.params.id);
        const event = await this.eventService.getById(eventId);
        if (!event) {
            return res.status(404).send('Event not found');
        }
        res.json(event);
    }
    async createEvent(req, res) {
        try {
            console.log('Request body:', req.body);  // Логировать тело запроса
            const eventData = req.body;
            console.log('Event data:', eventData);  // Логировать данные события
            const newEvent = await this.eventService.createEvent(eventData);
            res.status(201).json(newEvent);
        } catch (error) {
            console.error('Error creating event:', error);  // Логировать ошибку
            res.status(400).json({ error: error.message });
        }
    }
    async deleteEvent(req, res) {
        try {
            const eventId = parseInt(req.params.id);
            await this.eventService.deleteEvent(eventId);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting event:', error);
            res.status(400).json({ error: error.message });
        }
    }
    async updateEvent(req, res) {
        try {
            const eventId = parseInt(req.params.id);
            const updatedData = req.body;
            const updatedEvent = await this.eventService.updateEvent(eventId, updatedData);
            res.json(updatedEvent);
        } catch (error) {
            console.error('Error updating event:', error);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = EventController;