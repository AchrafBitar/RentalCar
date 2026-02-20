/**
 * Notification Service — WhatsApp Automation via Twilio
 * 
 * Sends automated WhatsApp messages when bookings are confirmed.
 * If Twilio credentials are not configured, logs a warning and skips.
 */

class NotificationService {
    constructor() {
        this.twilioClient = null;
        this.fromNumber = process.env.TWILIO_WHATSAPP_FROM || '';
        this.clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        // Initialize Twilio client only if credentials are available
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            try {
                const twilio = require('twilio');
                this.twilioClient = twilio(
                    process.env.TWILIO_ACCOUNT_SID,
                    process.env.TWILIO_AUTH_TOKEN
                );
                console.log('[NotificationService] ✅ Twilio client initialized.');
            } catch (error) {
                console.warn('[NotificationService] ⚠️ Failed to initialize Twilio:', error.message);
            }
        } else {
            console.warn('[NotificationService] ⚠️ Twilio credentials not configured. WhatsApp notifications disabled.');
        }
    }

    /**
     * Send a WhatsApp booking confirmation with a document upload link.
     * @param {object} booking - Booking object with car and customer info
     */
    async sendBookingConfirmation(booking) {
        const uploadLink = `${this.clientUrl}/upload-docs/${booking.id}`;

        const messageBody = [
            `✅ *Confirmation de Réservation — Exact Rent Car*`,
            ``,
            `Bonjour ${booking.customerName || 'Client'} 👋`,
            ``,
            `Votre réservation a été confirmée avec succès !`,
            ``,
            `🚗 *Véhicule :* ${booking.car?.model || 'N/A'}`,
            `📅 *Du :* ${new Date(booking.startDate).toLocaleDateString('fr-FR')}`,
            `📅 *Au :* ${new Date(booking.endDate).toLocaleDateString('fr-FR')}`,
            ``,
            `📎 *Veuillez déposer vos documents (Permis + CIN) ici :*`,
            uploadLink,
            ``,
            `Merci de votre confiance !`,
            `— Équipe Exact Rent Car`,
        ].join('\n');

        // If Twilio is not configured, just log the message
        if (!this.twilioClient) {
            console.log('[NotificationService] 📨 WhatsApp message (NOT SENT — Twilio not configured):');
            console.log(messageBody);
            return { sent: false, reason: 'TWILIO_NOT_CONFIGURED', message: messageBody };
        }

        // Validate phone number
        if (!booking.customerPhone) {
            console.warn('[NotificationService] ⚠️ No phone number for booking', booking.id);
            return { sent: false, reason: 'NO_PHONE_NUMBER' };
        }

        try {
            const result = await this.twilioClient.messages.create({
                body: messageBody,
                from: `whatsapp:${this.fromNumber}`,
                to: `whatsapp:${booking.customerPhone}`,
            });

            console.log(`[NotificationService] ✅ WhatsApp sent to ${booking.customerPhone} (SID: ${result.sid})`);
            return { sent: true, sid: result.sid };
        } catch (error) {
            console.error('[NotificationService] ❌ WhatsApp send failed:', error.message);
            return { sent: false, reason: 'SEND_FAILED', error: error.message };
        }
    }
}

module.exports = new NotificationService();
