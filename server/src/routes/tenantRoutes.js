const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET /api/tenant/config
router.get('/config', async (req, res) => {
    try {
        const slug = req.headers['x-tenant-domain'] || req.query.slug;

        if (!slug) {
            return res.status(400).json({ success: false, message: 'Header X-Tenant-Domain manquant.' });
        }

        const company = await prisma.company.findUnique({
            where: { domainSlug: slug },
            include: { settings: true }
        });

        if (!company || !company.settings) {
            return res.status(404).json({ success: false, message: 'Agence introuvable pour ce domaine.' });
        }

        res.json({
            success: true,
            data: {
                id: company.id,
                domainSlug: company.domainSlug,
                name: company.name,
                primaryColor: company.settings.primaryColor,
                secondaryColor: company.settings.secondaryColor,
                logoUrl: company.settings.logoUrl,
                aboutText: company.settings.aboutText,
                contactEmail: company.settings.contactEmail,
                contactPhone: company.settings.contactPhone,
                address: company.settings.address,
                mapCoordinates: company.settings.mapCoordinates
            }
        });
    } catch (error) {
        console.error('[TenantController] Config fetch error:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du chargement de la configuration.' });
    }
});

module.exports = router;
