const carRepository = require('../repositories/carRepository');
const bookingRepository = require('../repositories/bookingRepository');
const prisma = require('../prismaClient');

class AdminService {
    /**
     * Get all calendar data: cars with bookings, formatted for FullCalendar.
     * Returns an array of FullCalendar-compatible event objects.
     */
    async getCalendarData() {
        const cars = await carRepository.findAllWithBookings();

        const events = [];

        for (const car of cars) {
            // If car is in maintenance, add a maintenance event spanning today
            if (car.status === 'MAINTENANCE') {
                events.push({
                    id: `maintenance-${car.id}`,
                    title: `🔧 ${car.model} — Maintenance`,
                    start: new Date().toISOString().split('T')[0],
                    end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year
                    color: '#f97316', // Orange
                    extendedProps: {
                        type: 'maintenance',
                        carId: car.id,
                        carModel: car.model,
                        companyName: car.company?.name || 'N/A',
                    },
                });
            }

            // Add booking events for this car
            for (const booking of car.bookings) {
                const isConfirmed = booking.status === 'CONFIRMED';
                events.push({
                    id: `booking-${booking.id}`,
                    title: `${car.model} — ${booking.customerName || 'Client'}`,
                    start: booking.startDate.toISOString().split('T')[0],
                    end: booking.endDate.toISOString().split('T')[0],
                    color: isConfirmed ? '#ef4444' : '#facc15', // Red for confirmed, Yellow for pending
                    extendedProps: {
                        type: 'booking',
                        bookingId: booking.id,
                        status: booking.status,
                        carId: car.id,
                        carModel: car.model,
                        customerName: booking.customerName,
                        customerPhone: booking.customerPhone,
                        companyName: car.company?.name || 'N/A',
                    },
                });
            }
        }

        return { events, cars };
    }

    /**
     * Toggle a car between AVAILABLE and MAINTENANCE status.
     * When entering maintenance, cancels all active bookings for that car.
     * @param {number} carId
     */
    async toggleCarMaintenance(carId) {
        const car = await carRepository.findById(carId);

        if (!car) {
            throw new Error('CAR_NOT_FOUND');
        }

        const newStatus = car.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';

        // Use a transaction to toggle status and cancel bookings if entering maintenance
        return await prisma.$transaction(async (tx) => {
            // Cancel active bookings if entering maintenance
            if (newStatus === 'MAINTENANCE') {
                await bookingRepository.cancelActiveBookingsForCar(tx, carId);
            }

            // Update the car status with optimistic locking
            const updatedCar = await tx.car.update({
                where: {
                    id: parseInt(carId),
                    version: car.version,
                },
                data: {
                    status: newStatus,
                    availability: newStatus === 'AVAILABLE',
                    version: { increment: 1 },
                },
                include: { company: true },
            });

            return updatedCar;
        });
    }
}

module.exports = new AdminService();
