class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getEvents(searchTerm, sortBy, filterTags, pageSize, pageNumber) {
        let queryOptions = {
            where: {}
        };
        if (searchTerm) {
            queryOptions.where.OR = [
                { title: { contains: searchTerm } },
                { description: { contains: searchTerm } }
            ];
        }
        if (filterTags && filterTags.length > 0) {
            queryOptions.where.tags = {
                hasSome: filterTags.split(',')
            };
        }
        if (sortBy) {
            const sortByObject = JSON.parse(sortBy);
            queryOptions.orderBy = sortByObject;
        }
        if (pageSize && pageNumber) {
            queryOptions.skip = (pageNumber - 1) * pageSize;
            queryOptions.take = parseInt(pageSize, 10);
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
                // latte
            }
        });
    }
}

module.exports = EventsService;
