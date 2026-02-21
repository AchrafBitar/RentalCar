const path = require('path');
const fs = require('fs');
const prisma = require('../prismaClient');

/**
 * POST /api/uploads/:reservationId
 * Accepts multipart form with 'permis' and 'cin' file fields.
 * Saves files to server/uploads/{reservationId}/
 */
exports.uploadDocuments = async (req, res) => {
    try {
        const { reservationId } = req.params;

        // Verify booking exists
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(reservationId) },
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Réservation introuvable.',
            });
        }

        // Check files were uploaded
        if (!req.files || !req.files.permis || !req.files.cin) {
            return res.status(400).json({
                success: false,
                message: 'Les deux documents (permis et CIN) sont requis.',
            });
        }

        const permisFile = req.files.permis[0];
        const cinFile = req.files.cin[0];

        return res.status(200).json({
            success: true,
            message: 'Documents téléchargés avec succès.',
            data: {
                reservationId: parseInt(reservationId),
                permis: permisFile.filename,
                cin: cinFile.filename,
            },
        });
    } catch (err) {
        console.error('Upload error:', err);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors du téléchargement des documents.',
        });
    }
};
