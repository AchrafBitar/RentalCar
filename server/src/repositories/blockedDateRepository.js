const prisma = require('../prismaClient');

const blockedDateRepository = {
    async findByCar(carId, tenantId) {
        return await prisma.blockedDate.findMany({
            where: { carId: parseInt(carId), companyId: tenantId },
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
                companyId: data.tenantId
            },
        });
    },

    async findById(id, tenantId) {
        return await prisma.blockedDate.findFirst({
            where: { id: parseInt(id), companyId: tenantId },
        });
    },

    async delete(id, tenantId) {
        // findFirst before delete to verify compound security rule
        const blocked = await this.findById(id, tenantId);
        if (!blocked) throw new Error('NOT_FOUND');

        return await prisma.blockedDate.delete({
            where: { id: parseInt(id) },
        });
    },

    async deleteByCarId(carId, tenantId) {
        return await prisma.blockedDate.deleteMany({
            where: { carId: parseInt(carId), companyId: tenantId },
        });
    },
};

module.exports = blockedDateRepository;
