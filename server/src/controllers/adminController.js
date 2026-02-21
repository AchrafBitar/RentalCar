const adminService = require('../services/adminService');
const carService = require('../services/carService');
const bookingService = require('../services/bookingService');

/**
 * Admin Controller
 * Handles admin-specific HTTP requests (calendar, cars CRUD, bookings CRUD).
 */
class AdminController {
    // ─── Calendar ────────────────────────────────────────────────────────
    async getCalendarEvents(req, res) {
        try {
            const data = await adminService.getCalendarData();
            res.json({ success: true, data });
        } catch (error) {
            console.error('[AdminController] Calendar error:', error);
            res.status(500).json({
                success: false,
                error: 'INTERNAL_ERROR',
                message: 'Erreur lors du chargement du calendrier.',
            });
        }
    }

    async toggleMaintenance(req, res) {
        try {
            const car = await adminService.toggleCarMaintenance(req.params.id);
            res.json({
                success: true,
                data: car,
                message: car.status === 'MAINTENANCE'
                    ? 'Véhicule mis hors service. Les réservations actives ont été annulées.'
                    : 'Véhicule remis en service.',
            });
        } catch (error) {
            if (error.message === 'CAR_NOT_FOUND') {
                return res.status(404).json({ success: false, error: 'CAR_NOT_FOUND', message: 'Véhicule introuvable.' });
            }
            if (error.code === 'P2025') {
                return res.status(409).json({ success: false, error: 'VERSION_CONFLICT', message: 'Le statut a été modifié entre-temps. Veuillez rafraîchir.' });
            }
            console.error('[AdminController] Maintenance toggle error:', error);
            res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Erreur lors de la mise à jour du statut.' });
        }
    }

    // ─── Cars CRUD ───────────────────────────────────────────────────────
    async getAllCars(req, res) {
        try {
            const cars = await carService.getAllCarsAdmin();
            res.json({ success: true, data: cars });
        } catch (error) {
            console.error('[AdminController] Get cars error:', error);
            res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Erreur lors du chargement des véhicules.' });
        }
    }

    async createCar(req, res) {
        try {
            const { model, image, pricePerDay, companyId } = req.body;
            if (!model || !pricePerDay || !companyId) {
                return res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'model, pricePerDay, et companyId sont requis.' });
            }
            const car = await carService.createCar({
                model,
                image: image || null,
                pricePerDay: parseFloat(pricePerDay),
                companyId: parseInt(companyId),
            });
            res.status(201).json({ success: true, data: car, message: 'Véhicule ajouté avec succès.' });
        } catch (error) {
            console.error('[AdminController] Create car error:', error);
            res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Erreur lors de la création du véhicule.' });
        }
    }

    async updateCar(req, res) {
        try {
            const updateData = {};
            const { model, image, pricePerDay, companyId } = req.body;
            if (model !== undefined) updateData.model = model;
            if (image !== undefined) updateData.image = image;
            if (pricePerDay !== undefined) updateData.pricePerDay = parseFloat(pricePerDay);
            if (companyId !== undefined) updateData.companyId = parseInt(companyId);

            const car = await carService.updateCar(req.params.id, updateData);
            res.json({ success: true, data: car, message: 'Véhicule mis à jour.' });
        } catch (error) {
            if (error.message === 'CAR_NOT_FOUND') {
                return res.status(404).json({ success: false, error: 'CAR_NOT_FOUND', message: 'Véhicule introuvable.' });
            }
            console.error('[AdminController] Update car error:', error);
            res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Erreur lors de la mise à jour.' });
        }
    }

    async deleteCar(req, res) {
        try {
            await carService.deleteCar(req.params.id);
            res.json({ success: true, message: 'Véhicule supprimé avec succès.' });
        } catch (error) {
            if (error.message === 'CAR_NOT_FOUND') {
                return res.status(404).json({ success: false, error: 'CAR_NOT_FOUND', message: 'Véhicule introuvable.' });
            }
            console.error('[AdminController] Delete car error:', error);
            res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Erreur lors de la suppression.' });
        }
    }

    // ─── Bookings CRUD ──────────────────────────────────────────────────
    async getAllBookings(req, res) {
        try {
            const bookings = await bookingService.getAllBookings();
            res.json({ success: true, data: bookings });
        } catch (error) {
            console.error('[AdminController] Get bookings error:', error);
            res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Erreur lors du chargement des réservations.' });
        }
    }

    async createBooking(req, res) {
        try {
            const booking = await bookingService.createBookingAdmin(req.body);
            res.status(201).json({ success: true, data: booking, message: 'Réservation créée avec succès.' });
        } catch (error) {
            const errorMap = {
                CAR_NOT_FOUND: { status: 404, message: 'Véhicule introuvable.' },
                CAR_UNAVAILABLE: { status: 409, message: 'Ce véhicule est en maintenance.' },
                DATE_CONFLICT: { status: 409, message: 'Dates en conflit avec une réservation existante.' },
                VERSION_CONFLICT: { status: 409, message: 'Conflit de version. Veuillez réessayer.' },
            };
            const knownError = Object.entries(errorMap).find(([key]) => error.message.startsWith(key));
            if (knownError) {
                const [errorCode, { status, message }] = knownError;
                return res.status(status).json({ success: false, error: errorCode, message });
            }
            if (error.message.startsWith('VALIDATION_ERROR')) {
                return res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: error.message.replace('VALIDATION_ERROR: ', '') });
            }
            console.error('[AdminController] Create booking error:', error);
            res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Erreur lors de la création.' });
        }
    }

    async confirmBooking(req, res) {
        try {
            const booking = await bookingService.confirmBooking(req.params.id);
            res.json({ success: true, data: booking, message: 'Réservation confirmée.' });
        } catch (error) {
            if (error.message === 'BOOKING_NOT_FOUND') {
                return res.status(404).json({ success: false, error: 'BOOKING_NOT_FOUND', message: 'Réservation introuvable.' });
            }
            if (error.message.startsWith('INVALID_STATUS')) {
                return res.status(400).json({ success: false, error: 'INVALID_STATUS', message: error.message.replace('INVALID_STATUS: ', '') });
            }
            console.error('[AdminController] Confirm booking error:', error);
            res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Erreur lors de la confirmation.' });
        }
    }

    async cancelBooking(req, res) {
        try {
            const booking = await bookingService.cancelBooking(req.params.id);
            res.json({ success: true, data: booking, message: 'Réservation annulée.' });
        } catch (error) {
            if (error.message === 'BOOKING_NOT_FOUND') {
                return res.status(404).json({ success: false, error: 'BOOKING_NOT_FOUND', message: 'Réservation introuvable.' });
            }
            if (error.message.startsWith('INVALID_STATUS')) {
                return res.status(400).json({ success: false, error: 'INVALID_STATUS', message: error.message.replace('INVALID_STATUS: ', '') });
            }
            console.error('[AdminController] Cancel booking error:', error);
            res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: "Erreur lors de l'annulation." });
        }
    }

    async deleteBooking(req, res) {
        try {
            await bookingService.deleteBooking(req.params.id);
            res.json({ success: true, message: 'Réservation supprimée.' });
        } catch (error) {
            if (error.message === 'BOOKING_NOT_FOUND') {
                return res.status(404).json({ success: false, error: 'BOOKING_NOT_FOUND', message: 'Réservation introuvable.' });
            }
            console.error('[AdminController] Delete booking error:', error);
            res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Erreur lors de la suppression.' });
        }
    }
}

module.exports = new AdminController();
