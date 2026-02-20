const bookingRepository = require('../repositories/bookingRepository');
const carRepository = require('../repositories/carRepository');
const notificationService = require('./notificationService');

class BookingService {
    /**
     * Create a new booking with full concurrency protection.
     * Uses an atomic Prisma transaction with optimistic locking.
     * @param {object} data - { carId, startDate, endDate, customerName, customerPhone }
     */
    async createBooking(data) {
        // --- Input Validation ---
        if (!data.carId || !data.startDate || !data.endDate) {
            throw new Error('VALIDATION_ERROR: carId, startDate, and endDate are required.');
        }

        const start = new Date(data.startDate);
        const end = new Date(data.endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error('VALIDATION_ERROR: Invalid date format.');
        }

        if (start >= end) {
            throw new Error('VALIDATION_ERROR: startDate must be before endDate.');
        }

        if (start < new Date()) {
            throw new Error('VALIDATION_ERROR: startDate cannot be in the past.');
        }

        // --- Transactional Booking (prevents double-booking) ---
        try {
            const booking = await bookingRepository.createWithTransaction(data);
            return booking;
        } catch (error) {
            // Re-throw known business errors as-is
            if (['CAR_NOT_FOUND', 'CAR_UNAVAILABLE', 'DATE_CONFLICT', 'VERSION_CONFLICT'].includes(error.message)) {
                throw error;
            }
            // Prisma P2025 = record not found during optimistic lock update
            if (error.code === 'P2025') {
                throw new Error('VERSION_CONFLICT');
            }
            throw new Error(`BOOKING_FAILED: ${error.message}`);
        }
    }

    /**
     * Confirm a pending booking and trigger notifications.
     * @param {number} bookingId
     */
    async confirmBooking(bookingId) {
        const booking = await bookingRepository.findById(bookingId);

        if (!booking) {
            throw new Error('BOOKING_NOT_FOUND');
        }

        if (booking.status !== 'PENDING') {
            throw new Error(`INVALID_STATUS: Cannot confirm a booking with status "${booking.status}".`);
        }

        const confirmedBooking = await bookingRepository.updateStatus(bookingId, 'CONFIRMED');

        // Post-confirmation: send WhatsApp notification with document upload link
        try {
            await notificationService.sendBookingConfirmation(confirmedBooking);
        } catch (notifError) {
            // Don't fail the confirmation if notification fails
            console.error('[BookingService] Notification failed (non-blocking):', notifError.message);
        }

        return confirmedBooking;
    }

    /**
     * Cancel a booking.
     * @param {number} bookingId
     */
    async cancelBooking(bookingId) {
        const booking = await bookingRepository.findById(bookingId);

        if (!booking) {
            throw new Error('BOOKING_NOT_FOUND');
        }

        if (booking.status === 'CANCELLED') {
            throw new Error('INVALID_STATUS: Booking is already cancelled.');
        }

        return await bookingRepository.updateStatus(bookingId, 'CANCELLED');
    }

    /**
     * Get a single booking by ID.
     */
    async getBookingById(bookingId) {
        const booking = await bookingRepository.findById(bookingId);
        if (!booking) {
            throw new Error('BOOKING_NOT_FOUND');
        }
        return booking;
    }
}

module.exports = new BookingService();
