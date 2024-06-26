const EventsService = require('../services/events-service');
const dtoValidator = require('../validators/dtoValidation');
class EventController {
    constructor(eventService) {
        this.eventService = eventService;
    }
/**
 * @swagger
 * /meetups:
 *   get:
 *     summary: Получить список событий
 *     description: Получить список событий с возможностью фильтрации и сортировки
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: filterTags
 *         schema:
 *           type: string
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Успешный ответ
 *         content:
 *           application/json:    
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Событие'
 * components:
 *   schemas:
 *     Событие:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         eventTime:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 */
    async getEvents(req, res) {
        const { searchTerm, sortBy, filterTags, pageSize, pageNumber } = req.query;
        const events = await this.eventService.getEvents(searchTerm, sortBy, filterTags, pageSize, pageNumber);
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
            const eventData = req.body;
            const validatedEventData = dtoValidator.validateEvent(eventData);
            const newEvent = await this.eventService.createEvent(validatedEventData);
            res.status(201).json(newEvent);
        } catch (error) {
            console.error('Error creating event:', error);
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