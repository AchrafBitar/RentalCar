import React from 'react';
import background from '../assets/background.png';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Hero Section */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={background}
                        alt="Luxury Car Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-900/80 to-zinc-900/40"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-6 text-center md:text-left">
                    <div className="max-w-3xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-red-600/20 text-red-500 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md border border-red-500/30">
                            Premium Car Rental Rabat Agdal
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-display tracking-tight">
                            Vivez la Puissance <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Sur La Route</span>
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-xl font-light leading-relaxed">
                            Découvrez une flotte exclusive pour vos déplacements à Rabat. Performance, luxe et service premium.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Link to="/cars" className="group bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-none skew-x-[-10deg] transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center gap-2 border border-red-500/50">
                                <span className="skew-x-[10deg] flex items-center gap-2">
                                    Voir Nos Voitures
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <button className="bg-white/5 hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-none skew-x-[-10deg] border border-white/20 backdrop-blur-sm transition-all duration-300">
                                <span className="skew-x-[10deg]">Comment ça marche ?</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-zinc-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-zinc-900 mb-4 font-display uppercase tracking-wider">Pourquoi Choisir Exact Rent Car ?</h2>
                        <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureCard
                            icon={<Star className="text-red-600" size={32} />}
                            title="Flotte Premium"
                            description="Des véhicules récents, entretenus avec soin pour garantir votre confort et votre sécurité."
                        />
                        <FeatureCard
                            icon={<Shield className="text-red-600" size={32} />}
                            title="Prix Transparents"
                            description="Aucun frais caché. Ce que vous voyez est ce que vous payez, assurance incluse."
                        />
                        <FeatureCard
                            icon={<Clock className="text-red-600" size={32} />}
                            title="Support 24/7"
                            description="Une équipe dédiée à votre écoute pour vous assister à tout moment de votre location."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 bg-white hover:bg-zinc-50 hover:shadow-2xl transition-all duration-300 border border-zinc-200 group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
        <div className="w-16 h-16 bg-zinc-100 rounded-none flex items-center justify-center shadow-sm mb-6 group-hover:bg-red-50 transition-colors duration-300 border border-zinc-200">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-zinc-900 mb-3 font-display uppercase tracking-wide">{title}</h3>
        <p className="text-zinc-600 leading-relaxed font-light">
            {description}
        </p>
    </div>
);

export default Home;
