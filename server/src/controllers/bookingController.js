const bookingService = require('../services/bookingService');

/**
 * Booking Controller
 * Handles HTTP requests for booking operations with structured error responses.
 */
class BookingController {
    /**
     * POST /api/bookings — Create a new booking atomically.
     */
    async createBooking(req, res) {
        try {
            const booking = await bookingService.createBooking(req.body);
            res.status(201).json({
                success: true,
                data: booking,
                message: 'Réservation créée avec succès.',
            });
        } catch (error) {
            const errorMap = {
                CAR_NOT_FOUND: { status: 404, message: 'Véhicule introuvable.' },
                CAR_UNAVAILABLE: { status: 409, message: 'Ce véhicule est actuellement en maintenance et ne peut pas être réservé.' },
                DATE_CONFLICT: { status: 409, message: 'Ce véhicule est déjà réservé pour les dates sélectionnées.' },
                VERSION_CONFLICT: { status: 409, message: 'Une autre réservation a été effectuée entre-temps. Veuillez réessayer.' },
                BOOKING_NOT_FOUND: { status: 404, message: 'Réservation introuvable.' },
            };

            // Check for known error types
            const knownError = Object.entries(errorMap).find(([key]) => error.message.startsWith(key));

            if (knownError) {
                const [errorCode, { status, message }] = knownError;
                return res.status(status).json({ success: false, error: errorCode, message });
            }

            // Validation errors
            if (error.message.startsWith('VALIDATION_ERROR')) {
                return res.status(400).json({
                    success: false,
                    error: 'VALIDATION_ERROR',
                    message: error.message.replace('VALIDATION_ERROR: ', ''),
                });
            }

            // Unexpected errors
            console.error('[BookingController] Unexpected error:', error);
            res.status(500).json({
                success: false,
                error: 'INTERNAL_ERROR',
                message: 'Une erreur inattendue est survenue. Veuillez réessayer.',
            });
        }
    }

    /**
     * PATCH /api/bookings/:id/confirm — Confirm a pending booking.
     */
    async confirmBooking(req, res) {
        try {
            const booking = await bookingService.confirmBooking(req.params.id);
            res.json({
                success: true,
                data: booking,
                message: 'Réservation confirmée avec succès.',
            });
        } catch (error) {
            if (error.message === 'BOOKING_NOT_FOUND') {
                return res.status(404).json({ success: false, error: 'BOOKING_NOT_FOUND', message: 'Réservation introuvable.' });
            }
            if (error.message.startsWith('INVALID_STATUS')) {
                return res.status(400).json({ success: false, error: 'INVALID_STATUS', message: error.message.replace('INVALID_STATUS: ', '') });
            }
            console.error('[BookingController] Confirm error:', error);
            res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Erreur lors de la confirmation.' });
        }
    }

    /**
     * PATCH /api/bookings/:id/cancel — Cancel a booking.
     */
    async cancelBooking(req, res) {
        try {
            const booking = await bookingService.cancelBooking(req.params.id);
            res.json({
                success: true,
                data: booking,
                message: 'Réservation annulée.',
            });
        } catch (error) {
            if (error.message === 'BOOKING_NOT_FOUND') {
                return res.status(404).json({ success: false, error: 'BOOKING_NOT_FOUND', message: 'Réservation introuvable.' });
            }
            if (error.message.startsWith('INVALID_STATUS')) {
                return res.status(400).json({ success: false, error: 'INVALID_STATUS', message: error.message.replace('INVALID_STATUS: ', '') });
            }
            console.error('[BookingController] Cancel error:', error);
            res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Erreur lors de l\'annulation.' });
        }
    }
}

module.exports = new BookingController();
