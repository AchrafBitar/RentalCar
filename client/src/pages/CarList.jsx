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
        <div className="flex justify-center items-center py-40">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-display">Notre Flotte Exclusive</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto font-light">
                        Choisissez parmi notre sélection de véhicules premium pour une expérience de conduite inégalée à Rabat.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {cars.map(car => (
                        <div key={car.id} className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="h-64 overflow-hidden relative">
                                <img src={car.image || "https://via.placeholder.com/400x250"} alt={car.model} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-slate-900 font-bold shadow-sm border border-slate-100">
                                    {car.pricePerDay} MAD<span className="text-xs font-normal text-slate-500">/jour</span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-bold text-slate-900 font-display">{car.model}</h3>
                                </div>

                                <div className="flex justify-between items-center text-slate-500 text-sm mb-8 border-b border-slate-100 pb-6">
                                    <div className="flex items-center gap-1">
                                        <Fuel size={16} className="text-amber-500" />
                                        <span>{car.fuel || 'Essence'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Settings size={16} className="text-amber-500" />
                                        <span>{car.transmission || 'Auto'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users size={16} className="text-amber-500" />
                                        <span>{car.seats || '5'} Places</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${car.availability ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                        {car.availability ? 'Disponible' : 'Réservé'}
                                    </span>
                                    {car.availability ? (
                                        <Link to={`/book/${car.id}`} className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-amber-500 transition-colors font-medium shadow-md flex items-center gap-2 group-hover:gap-3">
                                            Réserver <ArrowRight size={18} />
                                        </Link>
                                    ) : (
                                        <button disabled className="bg-slate-100 text-slate-400 px-6 py-3 rounded-xl cursor-not-allowed font-medium border border-slate-200">
                                            Indisponible
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
