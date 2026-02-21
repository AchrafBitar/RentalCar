const prisma = require('../prismaClient');

class CarRepository {
    /**
     * Fetch all cars visible to clients (excludes MAINTENANCE vehicles).
     */
    async findAllAvailable() {
        return await prisma.car.findMany({
            where: { status: 'AVAILABLE' },
            include: { company: true },
        });
    }

    /**
     * Fetch ALL cars (including maintenance) — for admin use.
     */
    async findAll() {
        return await prisma.car.findMany({
            include: { company: true },
        });
    }

    /**
     * Fetch a car by ID with company.
     */
    async findById(id) {
        return await prisma.car.findUnique({
            where: { id: parseInt(id) },
            include: { company: true },
        });
    }

    /**
     * Fetch a car by ID with non-cancelled bookings and blocked dates.
     */
    async findByIdWithAvailability(id) {
        return await prisma.car.findUnique({
            where: { id: parseInt(id) },
            include: {
                company: true,
                bookings: {
                    where: { status: { not: 'CANCELLED' } },
                    select: { id: true, startDate: true, endDate: true, status: true },
                    orderBy: { startDate: 'asc' },
                },
                blockedDates: {
                    select: { id: true, startDate: true, endDate: true, reason: true },
                    orderBy: { startDate: 'asc' },
                },
            },
        });
    }

    /**
     * Fetch all cars with their bookings — for admin calendar.
     */
    async findAllWithBookings() {
        return await prisma.car.findMany({
            include: {
                company: true,
                bookings: {
                    where: { status: { not: 'CANCELLED' } },
                    orderBy: { startDate: 'asc' },
                },
            },
        });
    }

    /**
     * Create a new car.
     */
    async create(data) {
        return await prisma.car.create({ data });
    }

    /**
     * Toggle car status with optimistic locking.
     * @param {number} id - Car ID
     * @param {string} newStatus - "AVAILABLE" or "MAINTENANCE"
     * @param {number} currentVersion - Expected current version for optimistic lock
     */
    async updateStatus(id, newStatus, currentVersion) {
        return await prisma.car.update({
            where: {
                id: parseInt(id),
                version: currentVersion,
            },
            data: {
                status: newStatus,
                availability: newStatus === 'AVAILABLE',
                version: { increment: 1 },
            },
            include: { company: true },
        });
    }

    /**
     * Update a car's attributes.
     */
    async update(id, data) {
        return await prisma.car.update({
            where: { id: parseInt(id) },
            data,
            include: { company: true },
        });
    }

    /**
     * Delete a car and its related bookings (cascade).
     */
    async delete(id) {
        return await prisma.$transaction(async (tx) => {
            await tx.booking.deleteMany({ where: { carId: parseInt(id) } });
            await tx.blockedDate.deleteMany({ where: { carId: parseInt(id) } });
            return await tx.car.delete({
                where: { id: parseInt(id) },
            });
        });
    }
}

module.exports = new CarRepository();
