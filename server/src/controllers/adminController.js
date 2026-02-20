const adminService = require('../services/adminService');

/**
 * Admin Controller
 * Handles admin-specific HTTP requests (calendar, maintenance).
 */
class AdminController {
    /**
     * GET /api/admin/calendar — Returns calendar events + car list for the admin dashboard.
     */
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

    /**
     * PUT /api/admin/cars/:id/maintenance — Toggle car maintenance status.
     */
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
                return res.status(404).json({
                    success: false,
                    error: 'CAR_NOT_FOUND',
                    message: 'Véhicule introuvable.',
                });
            }
            // Prisma P2025 = optimistic lock failure
            if (error.code === 'P2025') {
                return res.status(409).json({
                    success: false,
                    error: 'VERSION_CONFLICT',
                    message: 'Le statut du véhicule a été modifié entre-temps. Veuillez rafraîchir.',
                });
            }
            console.error('[AdminController] Maintenance toggle error:', error);
            res.status(500).json({
                success: false,
                error: 'INTERNAL_ERROR',
                message: 'Erreur lors de la mise à jour du statut.',
            });
        }
    }
}

module.exports = new AdminController();
