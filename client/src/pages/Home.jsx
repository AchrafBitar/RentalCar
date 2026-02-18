import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop"
                        alt="Luxury Car Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-6 text-center md:text-left">
                    <div className="max-w-3xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm border border-amber-500/30">
                            Premium Car Rental in Rabat Agdal
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-display">
                            Vivez l'Élégance <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Sur La Route</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl font-light leading-relaxed">
                            Découvrez une flotte exclusive pour vos déplacements à Rabat. Le luxe accessible, le service en plus.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Link to="/cars" className="group bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2">
                                Voir Nos Voitures
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full border border-white/30 backdrop-blur-sm transition-all duration-300">
                                Comment ça marche ?
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4 font-display">Pourquoi Choisir AgdalRent ?</h2>
                        <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureCard
                            icon={<Star className="text-amber-500" size={32} />}
                            title="Flotte Premium"
                            description="Des véhicules récents, entretenus avec soin pour garantir votre confort et votre sécurité."
                        />
                        <FeatureCard
                            icon={<Shield className="text-amber-500" size={32} />}
                            title="Prix Transparents"
                            description="Aucun frais caché. Ce que vous voyez est ce que vous payez, assurance incluse."
                        />
                        <FeatureCard
                            icon={<Clock className="text-amber-500" size={32} />}
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
    <div className="p-8 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 group">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-100">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">{title}</h3>
        <p className="text-slate-600 leading-relaxed font-light">
            {description}
        </p>
    </div>
);

export default Home;
