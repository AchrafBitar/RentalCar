import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Settings, Users, ArrowRight, Trophy, Crown, Sparkles, Wallet, Star } from 'lucide-react';

const CATEGORIES = [
    { key: 'ALL', label: 'Tous', icon: <Star size={16} /> },
    { key: 'BUDGET', label: 'Budget', icon: <Wallet size={16} /> },
    { key: 'CONFORT', label: 'Confort', icon: <Sparkles size={16} /> },
    { key: 'LUX', label: 'Lux', icon: <Crown size={16} /> },
];

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('ALL');

    useEffect(() => {
        fetch('http://localhost:3000/api/cars')
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                setCars(data);
                setLoading(false);
            })
            .catch(err => {
                console.warn("Failed to fetch cars, using mock data", err);
                setCars([
                    { id: 1, model: "Mercedes-Benz C-Class", pricePerDay: 800, image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop", availability: true, fuel: "Diesel", transmission: "Auto", seats: 5, category: "LUX", _count: { bookings: 12 } },
                    { id: 2, model: "BMW X5", pricePerDay: 1200, image: "https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=2070&auto=format&fit=crop", availability: true, fuel: "Essence", transmission: "Auto", seats: 5, category: "LUX", _count: { bookings: 18 } },
                    { id: 3, model: "Dacia Logan", pricePerDay: 250, image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=2070&auto=format&fit=crop", availability: true, fuel: "Diesel", transmission: "Manuel", seats: 5, category: "BUDGET", _count: { bookings: 9 } },
                    { id: 4, model: "Peugeot 308", pricePerDay: 450, image: "https://images.unsplash.com/photo-1614200187524-dc411c82b141?q=80&w=2070&auto=format&fit=crop", availability: true, fuel: "Essence", transmission: "Auto", seats: 5, category: "CONFORT", _count: { bookings: 15 } },
                    { id: 5, model: "Renault Clio", pricePerDay: 200, image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2070&auto=format&fit=crop", availability: true, fuel: "Essence", transmission: "Manuel", seats: 5, category: "BUDGET", _count: { bookings: 6 } },
                    { id: 6, model: "Volkswagen Passat", pricePerDay: 600, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop", availability: true, fuel: "Diesel", transmission: "Auto", seats: 5, category: "CONFORT", _count: { bookings: 11 } },
                ]);
                setLoading(false);
            });
    }, []);

    // Best sellers: top 2 by booking count
    const bestSellers = [...cars]
        .filter(c => c.availability && (c._count?.bookings || 0) > 0)
        .sort((a, b) => (b._count?.bookings || 0) - (a._count?.bookings || 0))
        .slice(0, 2);

    const bestSellerIds = new Set(bestSellers.map(c => c.id));

    // Filter by category (excluding best sellers from the main grid)
    const filteredCars = cars
        .filter(c => !bestSellerIds.has(c.id))
        .filter(c => activeCategory === 'ALL' || (c.category || 'CONFORT') === activeCategory);

    if (loading) return (
        <div className="flex justify-center items-center py-40 min-h-screen bg-zinc-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    return (
        <div className="bg-zinc-50 min-h-screen py-24">
            <div className="container mx-auto px-4 md:px-6">

                {/* Page Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 mb-4 font-display uppercase tracking-tight">Notre Flotte Exclusive</h2>
                    <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
                    <p className="text-zinc-500 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base">
                        Choisissez parmi notre sélection de véhicules premium pour une expérience de conduite inégalée à Rabat.
                    </p>
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* BEST SELLERS                                           */}
                {/* ═══════════════════════════════════════════════════════ */}
                {bestSellers.length > 0 && (
                    <div className="mb-14 md:mb-16">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-white">
                                <Trophy size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-zinc-900 font-display uppercase tracking-wide">Les Plus Réservées</h3>
                                <p className="text-zinc-400 text-xs md:text-sm font-light">Nos véhicules préférés par nos clients</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {bestSellers.map((car, idx) => (
                                <BestSellerCard key={car.id} car={car} rank={idx + 1} />
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════ */}
                {/* CATEGORY FILTER TABS                                   */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="flex items-center gap-2 sm:gap-3 mb-8 md:mb-10 overflow-x-auto scrollbar-hide pb-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap border ${activeCategory === cat.key
                                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-lg'
                                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-700'
                                }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* CAR GRID                                               */}
                {/* ═══════════════════════════════════════════════════════ */}
                {filteredCars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                        {filteredCars.map(car => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-zinc-400 text-sm">Aucun véhicule dans cette catégorie pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════ */
/* BEST SELLER CARD — Gold-outlined featured card                     */
/* ═══════════════════════════════════════════════════════════════════ */
const BestSellerCard = ({ car, rank }) => (
    <div className="relative bg-white group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.12)]">
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 z-10"></div>

        {/* Rank badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-3 py-1.5 shadow-lg">
            <Crown size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">#{rank} Best-seller</span>
        </div>

        {/* Booking count badge */}
        <div className="absolute top-4 right-4 z-20 bg-zinc-950/80 backdrop-blur-md text-amber-400 px-3 py-1 text-xs font-bold">
            {car._count?.bookings || 0} réservations
        </div>

        <div className="h-56 sm:h-64 overflow-hidden relative">
            <img src={car.image || "https://via.placeholder.com/400x250"} alt={car.model} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        <div className="p-5 md:p-8">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <CategoryBadge category={car.category} />
                    <h3 className="text-lg md:text-2xl font-bold text-zinc-900 font-display uppercase tracking-wide mt-2">{car.model}</h3>
                </div>
                <div className="text-right">
                    <span className="text-xl md:text-2xl font-bold text-zinc-900">{car.pricePerDay}</span>
                    <span className="text-xs text-zinc-400 block">MAD/jour</span>
                </div>
            </div>

            <div className="flex justify-between items-center text-zinc-500 text-sm mb-6 border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-2"><Fuel size={16} className="text-amber-500" /><span>{car.fuel || 'Essence'}</span></div>
                <div className="flex items-center gap-2"><Settings size={16} className="text-amber-500" /><span>{car.transmission || 'Auto'}</span></div>
                <div className="flex items-center gap-2"><Users size={16} className="text-amber-500" /><span>{car.seats || '5'} Places</span></div>
            </div>

            {car.availability ? (
                <Link to={`/book/${car.id}`} className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold py-3.5 skew-x-[-10deg] transition-all duration-300 shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-2">
                    <span className="skew-x-[10deg] flex items-center gap-2">Réserver <ArrowRight size={18} /></span>
                </Link>
            ) : (
                <button disabled className="w-full bg-zinc-100 text-zinc-400 py-3.5 skew-x-[-10deg] cursor-not-allowed font-medium border border-zinc-200">
                    <span className="skew-x-[10deg]">Indisponible</span>
                </button>
            )}
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════════════════ */
/* STANDARD CAR CARD                                                  */
/* ═══════════════════════════════════════════════════════════════════ */
const CarCard = ({ car }) => (
    <div className="bg-white group hover:shadow-2xl transition-all duration-300 border border-zinc-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10"></div>

        <div className="h-56 sm:h-64 overflow-hidden relative">
            <img src={car.image || "https://via.placeholder.com/400x250"} alt={car.model} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
            <div className="absolute top-4 right-4 bg-zinc-950/90 backdrop-blur-md px-4 py-1 skew-x-[-10deg] text-white font-bold shadow-lg border border-white/10">
                <span className="skew-x-[10deg] block">{car.pricePerDay} MAD<span className="text-xs font-normal text-zinc-300">/jour</span></span>
            </div>
            <div className="absolute top-4 left-4">
                <CategoryBadge category={car.category} />
            </div>
        </div>

        <div className="p-5 md:p-8">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg md:text-2xl font-bold text-zinc-900 font-display uppercase tracking-wide">{car.model}</h3>
            </div>

            <div className="flex justify-between items-center text-zinc-500 text-sm mb-8 border-b border-zinc-100 pb-6">
                <div className="flex items-center gap-2"><Fuel size={16} className="text-red-600" /><span>{car.fuel || 'Essence'}</span></div>
                <div className="flex items-center gap-2"><Settings size={16} className="text-red-600" /><span>{car.transmission || 'Auto'}</span></div>
                <div className="flex items-center gap-2"><Users size={16} className="text-red-600" /><span>{car.seats || '5'} Places</span></div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase border ${car.availability ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-400 border-zinc-200'}`}>
                    {car.availability ? 'Disponible' : 'Réservé'}
                </span>
                {car.availability ? (
                    <Link to={`/book/${car.id}`} className="bg-zinc-950 text-white px-6 py-3 skew-x-[-10deg] hover:bg-red-600 transition-colors font-medium shadow-lg flex items-center gap-2">
                        <span className="skew-x-[10deg] flex items-center gap-2">Réserver <ArrowRight size={18} /></span>
                    </Link>
                ) : (
                    <button disabled className="bg-zinc-100 text-zinc-400 px-6 py-3 skew-x-[-10deg] cursor-not-allowed font-medium border border-zinc-200">
                        <span className="skew-x-[10deg]">Indisponible</span>
                    </button>
                )}
            </div>
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════════════════ */
/* CATEGORY BADGE                                                     */
/* ═══════════════════════════════════════════════════════════════════ */
const CategoryBadge = ({ category }) => {
    const styles = {
        BUDGET: 'bg-emerald-600/90 text-white',
        CONFORT: 'bg-blue-600/90 text-white',
        LUX: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white',
    };
    const labels = { BUDGET: 'Budget', CONFORT: 'Confort', LUX: 'Lux' };
    const cat = category || 'CONFORT';
    return (
        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm ${styles[cat] || styles.CONFORT}`}>
            {labels[cat] || 'Confort'}
        </span>
    );
};

export default CarList;
