import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Settings, Users, ArrowRight } from 'lucide-react';

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

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
                // Fallback mock data with better images
                setCars([
                    { id: 1, model: "Mercedes-Benz C-Class", pricePerDay: 800, image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop", availability: true, fuel: "Diesel", transmission: "Auto", seats: 5 },
                    { id: 2, model: "BMW X5", pricePerDay: 1200, image: "https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=2070&auto=format&fit=crop", availability: true, fuel: "Essence", transmission: "Auto", seats: 5 },
                    { id: 3, model: "Range Rover Sport", pricePerDay: 1800, image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=2070&auto=format&fit=crop", availability: false, fuel: "Diesel", transmission: "Auto", seats: 5 },
                    { id: 4, model: "Audi Q8", pricePerDay: 1500, image: "https://images.unsplash.com/photo-1614200187524-dc411c82b141?q=80&w=2070&auto=format&fit=crop", availability: true, fuel: "Hybride", transmission: "Auto", seats: 5 },
                ]);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center py-40 min-h-screen bg-zinc-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    return (
        <div className="bg-zinc-50 min-h-screen py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 font-display uppercase tracking-tight">Notre Flotte Exclusive</h2>
                    <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
                    <p className="text-zinc-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Choisissez parmi notre sélection de véhicules premium pour une expérience de conduite inégalée à Rabat.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {cars.map(car => (
                        <div key={car.id} className="bg-white group hover:shadow-2xl transition-all duration-300 border border-zinc-200 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10"></div>
                            <div className="h-64 overflow-hidden relative">
                                <img src={car.image || "https://via.placeholder.com/400x250"} alt={car.model} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                                <div className="absolute top-4 right-4 bg-zinc-950/90 backdrop-blur-md px-4 py-1 skew-x-[-10deg] text-white font-bold shadow-lg border border-white/10">
                                    <span className="skew-x-[10deg] block">{car.pricePerDay} MAD<span className="text-xs font-normal text-zinc-300">/jour</span></span>
                                </div>
                            </div>

                            <div className="p-5 md:p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-lg md:text-2xl font-bold text-zinc-900 font-display uppercase tracking-wide">{car.model}</h3>
                                </div>

                                <div className="flex justify-between items-center text-zinc-500 text-sm mb-8 border-b border-zinc-100 pb-6">
                                    <div className="flex items-center gap-2">
                                        <Fuel size={16} className="text-red-600" />
                                        <span>{car.fuel || 'Essence'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Settings size={16} className="text-red-600" />
                                        <span>{car.transmission || 'Auto'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-red-600" />
                                        <span>{car.seats || '5'} Places</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <span className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase border ${car.availability ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-400 border-zinc-200'}`}>
                                        {car.availability ? 'Disponible' : 'Réservé'}
                                    </span>
                                    {car.availability ? (
                                        <Link to={`/book/${car.id}`} className="bg-zinc-950 text-white px-6 py-3 skew-x-[-10deg] hover:bg-red-600 transition-colors font-medium shadow-lg flex items-center gap-2 group-hover/btn:gap-3">
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
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CarList;
