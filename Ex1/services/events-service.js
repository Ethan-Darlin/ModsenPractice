

// services/events-service.js
class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getEvents(searchTerm, sortBy) {
        let queryOptions = {};
    
        if (searchTerm) {
            queryOptions.where = {
                OR: [
                    { title: { contains: searchTerm } },
                    { description: { contains: searchTerm } },
                    { tags: { hasSome: searchTerm.split(',') } }
                ]
            };
        }
    
        if (sortBy) {
            // Преобразование строки JSON в объект JavaScript
            const sortByObject = JSON.parse(sortBy);
            queryOptions.orderBy = sortByObject;
        }
    
        return await this.prisma.event.findMany(queryOptions);
    }
    

    async getById(id) {
        return await this.prisma.event.findUnique({
            where: {
                id: id
            }
        });
    }
    async createEvent(eventData) {
        console.log(eventData.title);
        return await this.prisma.event.create({
            data: {
                title: eventData.title,
                description: eventData.description,
                tags: eventData.tags,
                eventTime: eventData.eventTime,
                location: eventData.location
            }
        });
    }
    async deleteEvent(id) {
        return await this.prisma.event.delete({
            where: {
                id: id
            }
        });
    }
    async updateEvent(id, updatedData) {
        return await this.prisma.event.update({
            where: {
                id: id
            },
            data: {
                description: updatedData.description,
                // late
            }
        });
    }
}

module.exports = EventsService;
