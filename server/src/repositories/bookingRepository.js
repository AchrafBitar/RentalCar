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
                companyId: tenantId,
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
    async createWithTransaction(data, tenantId) {
        return await prisma.$transaction(async (tx) => {
            // 1. Read the car with its current version and strict tenant scope
            const car = await tx.car.findFirst({
                where: { id: parseInt(data.carId), companyId: tenantId },
            });

            if (!car) {
                throw new Error('CAR_NOT_FOUND');
            }

            // 2. Check car is not in maintenance
            if (car.status !== 'AVAILABLE') {
                throw new Error('CAR_UNAVAILABLE');
            }

            // 3. Check for overlapping bookings in the requested date range
            const overlapping = await tx.booking.findMany({
                where: {
                    carId: parseInt(data.carId),
                    companyId: tenantId,
                    status: { not: 'CANCELLED' },
                    startDate: { lt: new Date(data.endDate) },
                    endDate: { gt: new Date(data.startDate) },
                },
            });

            if (overlapping.length > 0) {
                throw new Error('DATE_CONFLICT');
            }

            // 3b. Check for overlapping blocked dates
            const blockedOverlap = await tx.blockedDate.findFirst({
                where: {
                    carId: parseInt(data.carId),
                    companyId: tenantId,
                    startDate: { lt: new Date(data.endDate) },
                    endDate: { gt: new Date(data.startDate) },
                },
            });

            if (blockedOverlap) {
                throw new Error('DATE_CONFLICT');
            }

            // 4. Increment the car version (optimistic lock check)
            const updatedCar = await tx.car.update({
                where: {
                    id: parseInt(data.carId),
                    version: car.version, // Only succeeds if version hasn't changed
                    companyId: tenantId
                },
                data: { version: { increment: 1 } },
            });

            if (!updatedCar) {
                throw new Error('VERSION_CONFLICT');
            }

            // 5. Create the booking atomically attached to the company
            const booking = await this.createInTransaction(tx, {
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                status: data.status || 'PENDING',
                customerName: data.customerName || '',
                customerPhone: data.customerPhone || '',
                customerEmail: data.customerEmail || '',
                carId: parseInt(data.carId),
                companyId: tenantId
            });

            return booking;
        });
    }

    /**
     * Find a booking by ID with car and company details.
     */
    async findById(id, tenantId) {
        return await prisma.booking.findFirst({
            where: { id: parseInt(id), companyId: tenantId },
            include: {
                car: { include: { company: true } },
            },
        });
    }

    /**
     * Update booking status.
     */
    async updateStatus(id, status, tenantId) {
        return await prisma.booking.update({
            where: { id: parseInt(id), companyId: tenantId },
            data: { status },
            include: {
                car: { include: { company: true } },
            },
        });
    }

    /**
     * Fetch all bookings with car + company info (for admin calendar).
     */
    async findAllWithDetails(tenantId) {
        return await prisma.booking.findMany({
            where: { companyId: tenantId },
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
    async findAll(tenantId) {
        return await prisma.booking.findMany({
            where: { companyId: tenantId },
            include: {
                car: { include: { company: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Delete a booking by ID.
     */
    async delete(id, tenantId) {
        // Find first because it's safer when we add multiple unique compound rules
        const booking = await prisma.booking.findFirst({ where: { id: parseInt(id), companyId: tenantId } });
        if (!booking) throw new Error('BOOKING_NOT_FOUND');

        return await prisma.booking.delete({
            where: { id: parseInt(id) },
        });
    }
}

module.exports = new BookingRepository();
