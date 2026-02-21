const prisma = require('../prismaClient');

class BookingRepository {
    /**
     * Create a booking inside an existing Prisma transaction context.
     * @param {object} tx - Prisma transaction client
     * @param {object} data - Booking data
     */
    async createInTransaction(tx, data) {
        return await tx.booking.create({ data });
    }

    /**
     * Find overlapping bookings for a car within a date range.
     * Excludes CANCELLED bookings. Used inside a transaction.
     * @param {object} tx - Prisma transaction client
     */
    async findOverlapping(tx, carId, startDate, endDate) {
        return await tx.booking.findMany({
            where: {
                carId: parseInt(carId),
                status: { not: 'CANCELLED' },
                // Overlap condition: existing.start < new.end AND existing.end > new.start
                startDate: { lt: new Date(endDate) },
                endDate: { gt: new Date(startDate) },
            },
        });
    }

    /**
     * Atomic booking creation with optimistic locking.
     * Uses Prisma interactive transaction to prevent double-booking.
     */
    async createWithTransaction(data) {
        return await prisma.$transaction(async (tx) => {
            // 1. Read the car with its current version
            const car = await tx.car.findUnique({
                where: { id: parseInt(data.carId) },
            });

            if (!car) {
                throw new Error('CAR_NOT_FOUND');
            }

            // 2. Check car is not in maintenance
            if (car.status !== 'AVAILABLE') {
                throw new Error('CAR_UNAVAILABLE');
            }

            // 3. Check for overlapping bookings in the requested date range
            const overlapping = await this.findOverlapping(
                tx,
                data.carId,
                data.startDate,
                data.endDate
            );

            if (overlapping.length > 0) {
                throw new Error('DATE_CONFLICT');
            }

            // 4. Increment the car version (optimistic lock check)
            const updatedCar = await tx.car.update({
                where: {
                    id: parseInt(data.carId),
                    version: car.version, // Only succeeds if version hasn't changed
                },
                data: { version: { increment: 1 } },
            });

            if (!updatedCar) {
                throw new Error('VERSION_CONFLICT');
            }

            // 5. Create the booking atomically
            const booking = await this.createInTransaction(tx, {
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                status: data.status || 'PENDING',
                customerName: data.customerName || '',
                customerPhone: data.customerPhone || '',
                carId: parseInt(data.carId),
            });

            return booking;
        });
    }

    /**
     * Find a booking by ID with car and company details.
     */
    async findById(id) {
        return await prisma.booking.findUnique({
            where: { id: parseInt(id) },
            include: {
                car: { include: { company: true } },
            },
        });
    }

    /**
     * Update booking status.
     */
    async updateStatus(id, status) {
        return await prisma.booking.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                car: { include: { company: true } },
            },
        });
    }

    /**
     * Fetch all bookings with car + company info (for admin calendar).
     */
    async findAllWithDetails() {
        return await prisma.booking.findMany({
            include: {
                car: { include: { company: true } },
            },
            orderBy: { startDate: 'asc' },
        });
    }

    /**
     * Cancel all active bookings for a specific car (used when entering maintenance).
     */
    async cancelActiveBookingsForCar(tx, carId) {
        return await tx.booking.updateMany({
            where: {
                carId: parseInt(carId),
                status: { in: ['PENDING', 'CONFIRMED'] },
            },
            data: { status: 'CANCELLED' },
        });
    }

    /**
     * Fetch all bookings ordered by most recent first.
     */
    async findAll() {
        return await prisma.booking.findMany({
            include: {
                car: { include: { company: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Delete a booking by ID.
     */
    async delete(id) {
        return await prisma.booking.delete({
            where: { id: parseInt(id) },
        });
    }
}

module.exports = new BookingRepository();
