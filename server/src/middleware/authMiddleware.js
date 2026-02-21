const jwt = require('jsonwebtoken');

/**
 * Express middleware — verifies JWT from Authorization header.
 * Rejects with 401 if token is missing, expired, or invalid.
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Accès non autorisé. Veuillez vous connecter.',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // { username, iat, exp }
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Session expirée ou invalide. Veuillez vous reconnecter.',
        });
    }
};

module.exports = authMiddleware;
