const prisma = require('../prismaClient');

class CarRepository {
    async findAll() {
        return await prisma.car.findMany({
            include: {
                company: true
            }
        });
    }

    async findById(id) {
        return await prisma.car.findUnique({
            where: { id: parseInt(id) },
            include: {
                company: true
            }
        });
    }

    async create(data) {
        return await prisma.car.create({
            data
        });
    }
}

module.exports = new CarRepository();
