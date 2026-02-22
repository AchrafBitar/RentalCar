import React from 'react';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    MessageCircle,
    Plane,
    Train,
} from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-zinc-50 pt-28 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">

                {/* Page Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 font-display mb-2">
                    Contactez-Nous
                </h1>
                <p className="text-sm text-red-600 font-semibold uppercase tracking-widest mb-8">
                    Exact Rent Car — Rabat Agdal
                </p>
                <div className="w-16 h-1 bg-red-600 mb-10"></div>

                <p className="text-zinc-700 text-lg leading-relaxed mb-10">
                    Une question, un devis, une réservation ? Notre équipe est disponible
                    pour vous répondre rapidement. Contactez-nous par le canal qui vous
                    convient le mieux.
                </p>

                {/* ── Coordonnées ── */}
                <h2 className="text-2xl font-bold text-zinc-900 font-display mb-5">
                    Nos Coordonnées
                </h2>
                <ul className="space-y-5 mb-10">
                    <ContactItem
                        icon={<MapPin className="text-red-600 flex-shrink-0" size={18} />}
                        label="Adresse"
                        value="16 Avenue Fal Ould Oumeir, Appartement N°3, Agdal — Rabat"
                    />
                    <ContactItem
                        icon={<Phone className="text-red-600 flex-shrink-0" size={18} />}
                        label="Téléphone"
                        value={<a href="tel:+212600000000" className="text-red-600 hover:text-red-700 transition-colors">+212 6 00 00 00 00</a>}
                    />
                    <ContactItem
                        icon={<MessageCircle className="text-red-600 flex-shrink-0" size={18} />}
                        label="WhatsApp"
                        value={<a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 transition-colors">Envoyez-nous un message</a>}
                    />
                    <ContactItem
                        icon={<Mail className="text-red-600 flex-shrink-0" size={18} />}
                        label="Email"
                        value={<a href="mailto:contact@exactrentcar.ma" className="text-red-600 hover:text-red-700 transition-colors">contact@exactrentcar.ma</a>}
                    />
                </ul>

                {/* ── Horaires ── */}
                <h2 className="text-2xl font-bold text-zinc-900 font-display mb-5">
                    Horaires d'Ouverture
                </h2>
                <ul className="space-y-3 mb-10">
                    <li className="flex items-start gap-3 text-zinc-700">
                        <Clock className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                        <div>
                            <p><strong>Lundi — Vendredi :</strong> 08h00 – 19h00</p>
                            <p><strong>Samedi :</strong> 09h00 – 17h00</p>
                            <p><strong>Dimanche :</strong> Sur rendez-vous</p>
                        </div>
                    </li>
                </ul>
                <p className="text-zinc-600 text-sm mb-10 leading-relaxed">
                    <strong>Note :</strong> La livraison et la récupération de véhicules
                    aux aéroports (RBA & CMN) sont assurées <strong>24h/7j</strong>,
                    y compris les jours fériés.
                </p>

                {/* ── Comment Nous Trouver ── */}
                <h2 className="text-2xl font-bold text-zinc-900 font-display mb-5">
                    Comment Nous Trouver
                </h2>
                <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3 text-zinc-700 leading-relaxed">
                        <Train className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                        <span><strong>Depuis la Gare Rabat Agdal</strong> — À 5 minutes en voiture ou 10 minutes à pied. Nous pouvons vous retrouver directement à la gare.</span>
                    </li>
                    <li className="flex items-start gap-3 text-zinc-700 leading-relaxed">
                        <Plane className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                        <span><strong>Depuis l'Aéroport Rabat-Salé (RBA)</strong> — Livraison au terminal disponible 24h/7j. Contactez-nous à l'avance pour organiser la remise.</span>
                    </li>
                </ul>

                {/* ── Google Maps Embed ── */}
                <div className="w-full aspect-video border border-zinc-200 mb-10">
                    <iframe
                        title="Exact Rent Car — Agdal, Rabat"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.5!2d-6.8498!3d33.9928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDU5JzM0LjEiTiA2wrA1MCc1OS4zIlc!5e0!3m2!1sfr!2sma!4v1700000000000"
                        className="w-full h-full"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                {/* ── CTA ── */}
                <div className="border-t border-zinc-200 pt-10">
                    <p className="text-zinc-700 leading-relaxed mb-6">
                        Le moyen le plus rapide de nous joindre reste <strong>WhatsApp</strong>.
                        Envoyez-nous un message et recevez une réponse en quelques minutes.
                    </p>
                    <a
                        href="https://wa.me/212600000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 transition-colors text-sm"
                    >
                        <MessageCircle size={16} />
                        Ouvrir WhatsApp
                    </a>
                </div>

            </div>
        </div>
    );
};

/* ── Contact Item ── */
const ContactItem = ({ icon, label, value }) => (
    <li className="flex items-start gap-3 text-zinc-700">
        <span className="mt-0.5">{icon}</span>
        <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">{label}</p>
            <p className="leading-relaxed">{value}</p>
        </div>
    </li>
);

export default Contact;
