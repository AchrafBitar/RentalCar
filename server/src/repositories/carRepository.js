const prisma = require('../prismaClient');

class CarRepository {
    /**
     * Fetch all cars visible to clients (excludes MAINTENANCE vehicles).
     */
    async findAllAvailable(tenantId) {
        return await prisma.car.findMany({
            where: { status: 'AVAILABLE', companyId: tenantId },
            include: {
                company: true,
                _count: { select: { bookings: true } },
            },
        });
    }

    /**
     * Fetch ALL cars (including maintenance) — for admin use.
     */
    async findAll(tenantId) {
        return await prisma.car.findMany({
            where: { companyId: tenantId },
            include: { company: true },
        });
    }

    /**
     * Fetch a car by ID with company.
     */
    async findById(id, tenantId) {
        return await prisma.car.findFirst({
            where: { id: parseInt(id), companyId: tenantId },
            include: { company: true },
        });
    }

    /**
     * Fetch a car by ID with non-cancelled bookings and blocked dates.
     */
    async findByIdWithAvailability(id, tenantId) {
        return await prisma.car.findFirst({
            where: { id: parseInt(id), companyId: tenantId },
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
    async findAllWithBookings(tenantId) {
        return await prisma.car.findMany({
            where: { companyId: tenantId },
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
    async create(data, tenantId) {
        return await prisma.car.create({ data: { ...data, companyId: tenantId } });
    }

    /**
     * Toggle car status with optimistic locking.
     * @param {number} id - Car ID
     * @param {string} newStatus - "AVAILABLE" or "MAINTENANCE"
     * @param {number} currentVersion - Expected current version for optimistic lock
     */
    async updateStatus(id, newStatus, currentVersion, tenantId) {
        return await prisma.car.update({
            where: {
                id: parseInt(id),
                version: currentVersion,
                companyId: tenantId
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
    async update(id, data, tenantId) {
        return await prisma.car.update({
            where: { id: parseInt(id), companyId: tenantId },
            data,
            include: { company: true },
        });
    }

    /**
     * Delete a car and its related bookings (cascade).
     */
    async delete(id, tenantId) {
        return await prisma.$transaction(async (tx) => {
            // First verify it belongs to the tenant before cascade delete
            const car = await tx.car.findFirst({ where: { id: parseInt(id), companyId: tenantId } });
            if (!car) throw new Error('CAR_NOT_FOUND');

            await tx.booking.deleteMany({ where: { carId: parseInt(id), companyId: tenantId } });
            await tx.blockedDate.deleteMany({ where: { carId: parseInt(id), companyId: tenantId } });
            return await tx.car.delete({
                where: { id: parseInt(id) },
            });
        });
    }
}

module.exports = new CarRepository();
