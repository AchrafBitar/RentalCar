const prisma = require('../prismaClient');

class BookingRepository {
    async create(data) {
        return await prisma.booking.create({
            data
        });
    }
}

module.exports = new BookingRepository();
