const prisma = require('../prismaClient');

/**
 * Middleware that extracts the 'X-Tenant-Domain' header from the request,
 * looks up the corresponding Company, and attaches req.tenantId.
 * Used for public routes (Cars, Bookings) to ensure strict data isolation.
 */
const tenantMiddleware = async (req, res, next) => {
    try {
        const slug = req.headers['x-tenant-domain'];

        if (!slug) {
            return res.status(400).json({ success: false, message: 'Header X-Tenant-Domain manquant.' });
        }

        const company = await prisma.company.findUnique({
            where: { domainSlug: slug },
            select: { id: true, name: true }
        });

        if (!company) {
            return res.status(404).json({ success: false, message: 'Domaine locataire introuvable.' });
        }

        req.tenantId = company.id;
        req.tenantName = company.name;

        // Log the access to track tenant isolation during development
        console.log(`[Tenant isolation] Request from tenant slug: '${slug}' resolved to ID: ${req.tenantId}`);
        next();
    } catch (error) {
        console.error('[TenantMiddleware] Error:', error);
        res.status(500).json({ success: false, message: 'Erreur middleware isolation.' });
    }
};

module.exports = tenantMiddleware;
