import React from 'react';
import background from '../assets/background.png';
import Logo from '../assets/Logo.png';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Star,
    Shield,
    Clock,
    Car,
    MapPin,
    Phone,
    MessageCircle,
    ChevronDown,
    Check,
    Users,
    Plane,
} from 'lucide-react';
import FloatingMap from '../components/FloatingMap';

const Home = () => {
    return (
        <div className="min-h-screen bg-zinc-950">

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* HERO — Full-Screen with Background Image                  */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={background}
                        alt="Luxury Car Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-900/85 to-zinc-900/50"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-6 text-center md:text-left">
                    <div className="max-w-3xl">

                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-display tracking-tight">
                            Vivez la Puissance <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                                Sur La Route
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-xl font-light leading-relaxed">
                            Découvrez une flotte exclusive pour vos déplacements à Rabat.
                            Performance, transparence et service premium — le véhicule que
                            vous réservez est <em>exactement</em> celui que vous recevez.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Link
                                to="/cars"
                                className="group bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-none skew-x-[-10deg] transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center gap-2 border border-red-500/50"
                            >
                                <span className="skew-x-[10deg] flex items-center gap-2">
                                    Voir Nos Voitures
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <a
                                href="https://wa.me/212600000000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/5 hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-none skew-x-[-10deg] border border-white/20 backdrop-blur-sm transition-all duration-300 flex items-center justify-center"
                            >
                                <span className="skew-x-[10deg] flex items-center gap-2">
                                    <MessageCircle size={18} />
                                    WhatsApp
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                    <ChevronDown className="text-white/40" size={28} />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* LOGO SHOWCASE — Brand Identity Strip                       */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-zinc-950 relative overflow-hidden">
                {/* Subtle decorative accents */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent"></div>
                <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/5 rounded-full blur-3xl"></div>
                <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/5 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-6 flex flex-col items-center text-center">
                    <img
                        src={Logo}
                        alt="Exact Rent Car"
                        className="h-28 md:h-36 w-auto object-contain mb-8 drop-shadow-[0_0_40px_rgba(220,38,38,0.15)]"
                    />
                    <p className="text-zinc-400 text-lg md:text-xl font-light max-w-lg leading-relaxed">
                        Votre partenaire de confiance pour la <strong className="text-white">location de voiture à Rabat</strong> depuis plus de 20 ans.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8 text-zinc-500 text-xs sm:text-sm">
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-red-600" />Agdal, Rabat</span>
                        <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-red-600" />Depuis 2001</span>
                        <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                        <span className="flex items-center gap-1.5"><Star size={14} className="text-red-600" />Service Premium</span>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent"></div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* WHY CHOOSE US — Feature Cards                              */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-zinc-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-red-600 font-bold text-sm uppercase tracking-widest">La Promesse Exact</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mt-3 mb-4 font-display uppercase tracking-wider">
                            Pourquoi Nous Choisir ?
                        </h2>
                        <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={<Star className="text-red-600" size={28} />}
                            title="Flotte Premium"
                            description="Des véhicules récents, entretenus avec soin pour garantir votre confort et votre sécurité sur chaque trajet."
                        />
                        <FeatureCard
                            icon={<Shield className="text-red-600" size={28} />}
                            title="Prix Transparents"
                            description="Aucun frais caché. La Franchise, l'assurance, les kilomètres — tout est détaillé avant votre signature."
                        />
                        <FeatureCard
                            icon={<Clock className="text-red-600" size={28} />}
                            title="Support 24/7"
                            description="Une équipe dédiée à votre écoute pour vous assister à tout moment, de jour comme de nuit."
                        />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* HOW IT WORKS — Step-by-Step                                */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-zinc-950">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-red-600 font-bold text-sm uppercase tracking-widest">Simple & Rapide</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4 font-display uppercase tracking-wider">
                            Comment Ça Marche ?
                        </h2>
                        <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
                        <StepCard
                            number="01"
                            title="Choisissez"
                            description="Parcourez notre flotte en ligne et sélectionnez le véhicule qui correspond à vos besoins."
                            icon={<Car size={22} />}
                        />
                        <StepCard
                            number="02"
                            title="Réservez"
                            description="Confirmez votre réservation en quelques clics ou via WhatsApp. Aucun paiement immédiat requis."
                            icon={<Check size={22} />}
                        />
                        <StepCard
                            number="03"
                            title="Roulez"
                            description="Récupérez votre véhicule à notre bureau, à la gare ou directement à l'aéroport."
                            icon={<ArrowRight size={22} />}
                        />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SERVICES — Quick Highlights                                */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-red-600 font-bold text-sm uppercase tracking-widest">Nos Services</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mt-3 mb-4 font-display uppercase tracking-wider">
                            À Votre Service, Partout
                        </h2>
                        <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ServiceCard icon={<Plane size={20} />} label="Livraison Aéroport" sub="RBA & CMN · 24h/7j" />
                        <ServiceCard icon={<MapPin size={20} />} label="Bureau Agdal" sub="16 Av. Fal Ould Oumeir" />
                        <ServiceCard icon={<Users size={20} />} label="Service MRE" sub="Réservez depuis l'étranger" />
                        <ServiceCard icon={<MessageCircle size={20} />} label="WhatsApp-First" sub="Réponse en quelques minutes" />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* CTA BANNER                                                 */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-600"></div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-20 -top-20 w-96 h-96 border border-white/20 rounded-full"></div>
                    <div className="absolute -left-10 -bottom-10 w-64 h-64 border border-white/20 rounded-full"></div>
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
                        Prêt à Prendre la Route ?
                    </h2>
                    <p className="text-red-100 text-lg font-light mb-8 max-w-lg mx-auto">
                        Réservez en ligne et bénéficiez de <strong className="text-white">10% de réduction</strong> sur votre première location.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/cars"
                            className="group bg-white text-red-700 font-bold py-4 px-8 skew-x-[-10deg] transition-all duration-300 hover:bg-zinc-100 shadow-lg flex items-center justify-center"
                        >
                            <span className="skew-x-[10deg] flex items-center gap-2">
                                Réserver Maintenant
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <a
                            href="tel:+212600000000"
                            className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 skew-x-[-10deg] border border-white/30 backdrop-blur-sm transition-all duration-300 flex items-center justify-center"
                        >
                            <span className="skew-x-[10deg] flex items-center gap-2">
                                <Phone size={18} />
                                Appelez-Nous
                            </span>
                        </a>
                    </div>
                </div>
            </section>

            <FloatingMap />
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════ */
/* SUB-COMPONENTS                                                */
/* ══════════════════════════════════════════════════════════════ */

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 bg-white hover:bg-zinc-50 hover:shadow-2xl transition-all duration-300 border border-zinc-200 group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
        <div className="w-14 h-14 bg-zinc-100 flex items-center justify-center mb-6 group-hover:bg-red-50 transition-colors duration-300 border border-zinc-200">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-zinc-900 mb-3 font-display uppercase tracking-wide">{title}</h3>
        <p className="text-zinc-600 leading-relaxed font-light">{description}</p>
    </div>
);

const StepCard = ({ number, title, description, icon }) => (
    <div className="text-center group">
        <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-red-600/10 group-hover:bg-red-600/20 transition-colors duration-300 skew-x-[-6deg]"></div>
            <div className="relative w-full h-full flex items-center justify-center text-red-500">
                {icon}
            </div>
        </div>
        <span className="text-red-600/40 text-4xl font-bold font-display">{number}</span>
        <h3 className="text-lg font-bold text-white mt-2 mb-3 font-display uppercase tracking-wide">{title}</h3>
        <p className="text-zinc-400 font-light leading-relaxed text-sm">{description}</p>
    </div>
);

const ServiceCard = ({ icon, label, sub }) => (
    <div className="p-6 border border-zinc-200 hover:border-red-200 bg-zinc-50 hover:bg-red-50/30 transition-all duration-300 group text-center">
        <div className="w-10 h-10 bg-red-600/10 mx-auto flex items-center justify-center mb-4 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
            {icon}
        </div>
        <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wide mb-1">{label}</h3>
        <p className="text-zinc-500 text-xs font-light">{sub}</p>
    </div>
);

export default Home;
