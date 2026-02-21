const prisma = require('../prismaClient');

const blockedDateRepository = {
    async findByCar(carId) {
        return await prisma.blockedDate.findMany({
            where: { carId: parseInt(carId) },
            orderBy: { startDate: 'asc' },
        });
    },

    async create(data) {
        return await prisma.blockedDate.create({
            data: {
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                reason: data.reason || '',
                carId: parseInt(data.carId),
            },
        });
    },

    async findById(id) {
        return await prisma.blockedDate.findUnique({
            where: { id: parseInt(id) },
        });
    },

    async delete(id) {
        return await prisma.blockedDate.delete({
            where: { id: parseInt(id) },
        });
    },

    async deleteByCarId(carId) {
        return await prisma.blockedDate.deleteMany({
            where: { carId: parseInt(carId) },
        });
    },
};

module.exports = blockedDateRepository;
