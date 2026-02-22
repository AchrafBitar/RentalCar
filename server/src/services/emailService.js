const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = null;
        this.adminEmail = process.env.ADMIN_EMAIL || 'admin@exactrentcar.com';

        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            console.log('[EmailService] ✅ SMTP Transporter initialized.');
        } else {
            console.warn('[EmailService] ⚠️ SMTP credentials not configured. Email notifications disabled.');
        }
    }

    async sendBookingConfirmationEmail(booking) {
        if (!this.transporter) {
            console.log('[EmailService] 📨 Email (NOT SENT — SMTP not configured) for booking:', booking.id);
            return { sent: false, reason: 'SMTP_NOT_CONFIGURED' };
        }

        const subject = `Confirmation de Réservation #${booking.id} - Exact Rent Car`;
        const htmlBody = `
            <h2>Bonjour ${booking.customerName || 'Client'},</h2>
            <p>Votre demande de réservation a été reçue et est en attente de confirmation finale.</p>
            <h3>Détails de la réservation :</h3>
            <ul>
                <li><strong>Véhicule (ID) :</strong> ${booking.carId}</li>
                <li><strong>Du :</strong> ${new Date(booking.startDate).toLocaleDateString('fr-FR')}</li>
                <li><strong>Au :</strong> ${new Date(booking.endDate).toLocaleDateString('fr-FR')}</li>
            </ul>
            <p>Vos documents ont bien été reçus.</p>
            <p>Merci de votre confiance.</p>
            <br/>
            <p>— Équipe Exact Rent Car</p>
        `;

        try {
            // 1. Send to Customer if email is provided
            if (booking.customerEmail) {
                console.log(`[EmailService] Sending confirmation to customer: ${booking.customerEmail}`);
                await this.transporter.sendMail({
                    from: `"Exact Rent Car" <${process.env.SMTP_USER}>`,
                    to: booking.customerEmail,
                    subject: subject,
                    html: htmlBody,
                });
            }

            // 2. Send to Admin
            console.log(`[EmailService] Sending notification to admin: ${this.adminEmail}`);

            const adminResult = await this.transporter.sendMail({
                from: `"Exact Rent Car" <${process.env.SMTP_USER}>`,
                to: this.adminEmail,
                subject: `Nouvelle Réservation (ID: ${booking.id}) - Validation requise`,
                html: `
                    <h2>Nouvelle demande de réservation</h2>
                    <p>Client : ${booking.customerName} (${booking.customerPhone})</p>
                    <p>Email Client : ${booking.customerEmail || 'Non fourni'}</p>
                    <p>Véhicule ID : ${booking.carId}</p>
                    <p>Dates : du ${new Date(booking.startDate).toLocaleDateString('fr-FR')} au ${new Date(booking.endDate).toLocaleDateString('fr-FR')}</p>
                    <p>Les documents (Permis et CIN) ont été uploadés. Veuillez vérifier le dossier 'uploads/bookings/${booking.id}'.</p>
                `,
            });

            console.log(`[EmailService] ✅ Emails sent successfully (Admin Message ID: ${adminResult.messageId})`);
            return { sent: true, adminMessageId: adminResult.messageId };
        } catch (error) {
            console.error('[EmailService] ❌ Email send failed:', error.message);
            return { sent: false, reason: 'SEND_FAILED', error: error.message };
        }
    }
}

module.exports = new EmailService();
