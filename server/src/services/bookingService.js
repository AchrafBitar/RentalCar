const bookingRepository = require('../repositories/bookingRepository');
const carRepository = require('../repositories/carRepository');

class BookingService {
    /**
     * Create a new booking with full concurrency protection.
     * Uses an atomic Prisma transaction with optimistic locking.
     * @param {object} data - { carId, startDate, endDate, customerName, customerPhone }
     * @param {object} files - { permis, cin }
     */
    async createBooking(data, files, tenantId) {
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
        let booking;
        try {
            booking = await bookingRepository.createWithTransaction(data, tenantId);
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

        // --- Save Files ---
        try {
            if (files && files.permis && files.cin) {
                const fs = require('fs').promises;
                const path = require('path');
                const bookingDir = path.join(__dirname, '../../uploads/bookings', booking.id.toString());

                // Create directory if it doesn't exist
                await fs.mkdir(bookingDir, { recursive: true });

                const permisExt = path.extname(files.permis.originalname) || '.jpg';
                const cinExt = path.extname(files.cin.originalname) || '.jpg';

                const permisPath = path.join(bookingDir, `permis${permisExt}`);
                const cinPath = path.join(bookingDir, `cin${cinExt}`);

                // Write files from memory to disk
                await fs.writeFile(permisPath, files.permis.buffer);
                await fs.writeFile(cinPath, files.cin.buffer);
            }

            // --- Send Confirmation Email ---
            const emailService = require('./emailService');
            await emailService.sendBookingConfirmationEmail(booking);

            return booking;
        } catch (postError) {
            console.error('[BookingService] Error after booking creation (files/email):', postError);
            // Manual rollback: IF file upload or email fails, delete the booking to maintain integrity
            if (booking && booking.id) {
                try {
                    await bookingRepository.delete(booking.id, tenantId);
                    console.info(`[BookingService] Successfully rolled back booking ${booking.id}`);
                } catch (rollbackError) {
                    console.error('[BookingService] FATAL ERROR: Rollback failed for booking', booking.id, rollbackError);
                }
            }
            throw new Error('UPLOAD_FAILED: Erreur lors du traitement de votre demande. Veuillez réessayer.');
        }
    }

    /**
     * Confirm a pending booking and trigger notifications.
     * @param {number} bookingId
     */
    async confirmBooking(bookingId, tenantId) {
        const booking = await bookingRepository.findById(bookingId, tenantId);

        if (!booking) {
            throw new Error('BOOKING_NOT_FOUND');
        }

        if (booking.status !== 'PENDING') {
            throw new Error(`INVALID_STATUS: Cannot confirm a booking with status "${booking.status}".`);
        }

        const confirmedBooking = await bookingRepository.updateStatus(bookingId, 'CONFIRMED', tenantId);

        // Post-confirmation: WhatsApp notification removed in favor of direct client communication.
        // The administrator and client are notified via email (handled in confirmBooking/createBooking).

        return confirmedBooking;
    }

    /**
     * Cancel a booking.
     * @param {number} bookingId
     */
    async cancelBooking(bookingId, tenantId) {
        const booking = await bookingRepository.findById(bookingId, tenantId);

        if (!booking) {
            throw new Error('BOOKING_NOT_FOUND');
        }

        if (booking.status === 'CANCELLED') {
            throw new Error('INVALID_STATUS: Booking is already cancelled.');
        }

        return await bookingRepository.updateStatus(bookingId, 'CANCELLED', tenantId);
    }

    /**
     * Get a single booking by ID.
     */
    async getBookingById(bookingId, tenantId) {
        const booking = await bookingRepository.findById(bookingId, tenantId);
        if (!booking) {
            throw new Error('BOOKING_NOT_FOUND');
        }
        return booking;
    }

    /**
     * Get all bookings (for admin dashboard).
     */
    async getAllBookings(tenantId) {
        return await bookingRepository.findAll(tenantId);
    }

    /**
     * Admin-level booking creation (skips past-date check).
     */
    async createBookingAdmin(data, tenantId) {
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

        try {
            const booking = await bookingRepository.createWithTransaction(data, tenantId);
            return booking;
        } catch (error) {
            if (['CAR_NOT_FOUND', 'CAR_UNAVAILABLE', 'DATE_CONFLICT', 'VERSION_CONFLICT'].includes(error.message)) {
                throw error;
            }
            if (error.code === 'P2025') {
                throw new Error('VERSION_CONFLICT');
            }
            throw new Error(`BOOKING_FAILED: ${error.message}`);
        }
    }

    /**
     * Delete a booking permanently.
     */
    async deleteBooking(bookingId, tenantId) {
        const booking = await bookingRepository.findById(bookingId, tenantId);
        if (!booking) {
            throw new Error('BOOKING_NOT_FOUND');
        }
        return await bookingRepository.delete(bookingId, tenantId);
    }
}

module.exports = new BookingService();
