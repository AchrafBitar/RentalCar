const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * POST /api/auth/login
 * Accepts { username, password }, validates against env credentials,
 * returns a JWT token valid for 24 hours.
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nom d\'utilisateur et mot de passe requis.',
            });
        }

        // Check username
        if (username !== process.env.ADMIN_USERNAME) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects.',
            });
        }

        // Check password against stored hash
        const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects.',
            });
        }

        // Generate JWT (24h expiry)
        const token = jwt.sign(
            { username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({
            success: true,
            data: { token },
            message: 'Connexion réussie.',
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la connexion.',
        });
    }
};
