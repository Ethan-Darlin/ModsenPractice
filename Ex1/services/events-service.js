

// services/events-service.js
class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getEvents() {
        return await this.prisma.event.findMany();
    }

    async getById(id) {
        return await this.prisma.event.findUnique({
            where: {
                id: id
            }
        });
    }
}

module.exports = EventsService;
