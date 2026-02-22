import React from 'react';
import { Link } from 'react-router-dom';
import {
    CheckCircle,
    MapPin,
    Car,
    Crown,
    Plane,
    MessageCircle,
    Clock,
    Shield,
    Phone,
    Coffee,
    Percent,
    ArrowRight,
} from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-zinc-50 pt-28 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">

                {/* Page Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 font-display mb-2">
                    À Propos d'Exact Rent Car
                </h1>
                <p className="text-sm text-red-600 font-semibold uppercase tracking-widest mb-8">
                    Location de Voiture — Rabat Agdal · Depuis 2001
                </p>
                <div className="w-16 h-1 bg-red-600 mb-10"></div>

                {/* ── Intro ── */}
                <p className="text-zinc-700 text-lg leading-relaxed mb-6">
                    Chez <strong>Exact Rent Car</strong>, le véhicule que vous réservez est
                    <em> exactement</em> celui que vous recevez. Pas de surprises, pas
                    d'approximations — juste un service précis, transparent et ancré au
                    cœur de Rabat Agdal depuis 2001.
                </p>

                {/* ── La Différence "Exact" ── */}
                <h2 className="text-2xl font-bold text-zinc-900 font-display mt-12 mb-4">
                    La Différence « Exact »
                </h2>
                <p className="text-zinc-700 leading-relaxed mb-4">
                    Au Maroc, trop d'agences de <em>location de voiture</em> fonctionnent à
                    l'« à-peu-près ». Nous avons bâti notre réputation sur l'opposé :
                    la <strong>précision</strong>.
                </p>
                <ul className="space-y-4 mb-6">
                    <BulletItem
                        icon={<Shield className="text-red-600 flex-shrink-0" size={18} />}
                        text={<><strong>Transparence totale</strong> — Nos tarifs sont clairs, sans frais cachés. La Franchise, l'assurance, les kilomètres : tout est détaillé avant votre signature.</>}
                    />
                    <BulletItem
                        icon={<CheckCircle className="text-red-600 flex-shrink-0" size={18} />}
                        text={<><strong>Le véhicule promis</strong> — Vous réservez une Peugeot 208, vous recevez une Peugeot 208. Pas un modèle « équivalent » choisi au hasard.</>}
                    />
                    <BulletItem
                        icon={<Shield className="text-red-600 flex-shrink-0" size={18} />}
                        text={<><strong>Assurance sans zones grises</strong> — Nous expliquons chaque détail de la couverture : montant de la Franchise, ce qui est inclus and ce qui ne l'est pas. Vous partez l'esprit tranquille.</>}
                    />
                </ul>

                {/* ── Nos Racines ── */}
                <h2 className="text-2xl font-bold text-zinc-900 font-display mt-12 mb-4">
                    Nos Racines à Agdal
                </h2>
                <p className="text-zinc-700 leading-relaxed mb-4">
                    Implantés au <strong>16 Avenue Fal Ould Oumeir, Appartement N°3,
                        Agdal — Rabat</strong>, nous avons fait le choix d'un bureau-showroom
                    privatif plutôt qu'une vitrine de quartier. Un espace professionnel
                    discret où chaque client est reçu en toute confidentialité, avec un
                    café et un contrat clair.
                </p>
                <ul className="space-y-4 mb-6">
                    <BulletItem
                        icon={<MapPin className="text-red-600 flex-shrink-0" size={18} />}
                        text={<><strong>Bureau-showroom privatif</strong> — Appartement N°3, 16 Av. Fal Ould Oumeir, Agdal. Un accueil personnalisé loin de l'agitation.</>}
                    />
                    <BulletItem
                        icon={<Clock className="text-red-600 flex-shrink-0" size={18} />}
                        text={<><strong>À 5 minutes de la Gare Rabat Agdal</strong> — Arrivez en train, repartez au volant. Remise du véhicule possible directement à la gare.</>}
                    />
                </ul>
                <p className="text-zinc-700 leading-relaxed mb-6">
                    Depuis 2001, nous servons les résidents d'Agdal, les voyageurs
                    d'affaires de Hay Riad et les MRE qui cherchent un partenaire de
                    confiance pour leur séjour au Maroc.
                </p>

                {/* ── Notre Flotte ── */}
                <h2 className="text-2xl font-bold text-zinc-900 font-display mt-12 mb-4">
                    Notre Flotte
                </h2>
                <p className="text-zinc-700 leading-relaxed mb-4">
                    Une gamme pensée pour couvrir tous vos besoins, de l'efficacité
                    urbaine à l'élégance événementielle.
                </p>
                <ul className="space-y-4 mb-6">
                    <BulletItem
                        icon={<Car className="text-red-600 flex-shrink-0" size={18} />}
                        text={<><strong>Économique & Citadine</strong> — Peugeot 208, Renault Clio, Dacia Logan. Parfaites pour naviguer Rabat, se garer facilement à Agdal et maîtriser votre budget carburant.</>}
                    />
                    <BulletItem
                        icon={<Crown className="text-red-600 flex-shrink-0" size={18} />}
                        text={<><strong>Prestige & VIP</strong> — Berlines haut de gamme et SUV Premium. Pour vos mariages, réceptions ou déplacements d'affaires à Hay Riad et Souissi.</>}
                    />
                </ul>
                <div className="mb-6">
                    <Link
                        to="/cars"
                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm uppercase tracking-wider transition-colors"
                    >
                        Voir toute la flotte
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {/* ── Notre Engagement ── */}
                <h2 className="text-2xl font-bold text-zinc-900 font-display mt-12 mb-4">
                    Notre Engagement
                </h2>
                <ul className="space-y-4 mb-6">
                    <BulletItem
                        icon={<Plane className="text-red-600 flex-shrink-0" size={18} />}
                        text={<><strong>Livraison Aéroport 24h/7j</strong> — Aéroport Rabat-Salé (RBA) ou Casablanca Mohammed V (CMN), nous livrons votre véhicule directement au terminal, de jour comme de nuit.</>}
                    />
                    <BulletItem
                        icon={<MessageCircle className="text-red-600 flex-shrink-0" size={18} />}
                        text={<><strong>WhatsApp-First</strong> — Un message, une réponse. Envoyez-nous un WhatsApp et recevez votre devis, votre confirmation ou votre assistance en temps réel.</>}
                    />
                    <BulletItem
                        icon={<Clock className="text-red-600 flex-shrink-0" size={18} />}
                        text={<><strong>Fiabilité pour les MRE</strong> — Vous rentrez au Maroc pour les vacances ou pour affaires ? Réservez depuis l'étranger, récupérez sur place sans stress.</>}
                    />
                </ul>

                {/* ── CTA ── */}
                <div className="border-t border-zinc-200 mt-14 pt-10">
                    <h2 className="text-2xl font-bold text-zinc-900 font-display mb-4 flex items-center gap-2">
                        <Coffee className="text-red-600" size={22} />
                        Un Café, un Contrat, Zéro Stress
                    </h2>
                    <p className="text-zinc-700 leading-relaxed mb-3">
                        Passez nous voir à l'<strong>Appartement N°3, 16 Avenue Fal Ould
                            Oumeir, Agdal</strong> — nous vous accueillons autour d'un café pour
                        discuter de vos besoins et signer votre contrat en toute sérénité.
                    </p>
                    <p className="text-zinc-700 leading-relaxed mb-8">
                        Vous préférez tout faire en ligne ? Réservez directement sur notre
                        site et bénéficiez de <strong className="text-red-600">10% de
                            réduction</strong> sur votre première location.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            to="/cars"
                            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 transition-colors text-sm"
                        >
                            <Percent size={16} />
                            Réserver en Ligne — 10% Offerts
                        </Link>
                        <a
                            href="https://wa.me/212600000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 border border-zinc-300 hover:border-red-400 text-zinc-700 hover:text-red-600 font-semibold py-3 px-6 transition-colors text-sm"
                        >
                            <Phone size={16} />
                            Nous Contacter sur WhatsApp
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

/* ── Bullet Item ── */
const BulletItem = ({ icon, text }) => (
    <li className="flex items-start gap-3 text-zinc-700 leading-relaxed">
        <span className="mt-0.5">{icon}</span>
        <span>{text}</span>
    </li>
);

export default AboutUs;
