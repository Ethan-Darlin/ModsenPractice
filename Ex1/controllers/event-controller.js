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
}

module.exports = EventController;