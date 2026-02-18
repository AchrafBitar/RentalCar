import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';

const BookingPage = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        name: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Simulate booking process
        setTimeout(() => {
            setSubmitting(false);
            alert('Demande de réservation envoyée avec succès !');
            navigate('/cars');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-20 flex items-center justify-center">
            <div className="container mx-auto px-6 max-w-4xl">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors">
                    <ArrowLeft size={20} /> Retour
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
                    {/* Image Side */}
                    <div className="md:w-1/2 bg-slate-900 relative p-12 text-white flex flex-col justify-between overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-display font-bold mb-2">Finalisez Votre Réservation</h2>
                            <p className="text-slate-300 font-light">Vous êtes à quelques pas de prendre la route.</p>
                        </div>
                        <div className="relative z-10 mt-10">
                            <div className="flex items-center gap-4 text-sm text-slate-300">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <Calendar size={18} />
                                </div>
                                <p>Confirmation immédiate</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="md:w-1/2 p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-slate-700 text-sm font-bold mb-2 ml-1">Date de début</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        required
                                        className="w-full pl-4 pr-4 py-3 rounded-xl bg-slate-50 border-slate-200 border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition outline-none text-slate-700"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm font-bold mb-2 ml-1">Date de fin</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        required
                                        className="w-full pl-4 pr-4 py-3 rounded-xl bg-slate-50 border-slate-200 border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition outline-none text-slate-700"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 text-sm font-bold mb-2 ml-1">Nom Complet</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Votre nom"
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-slate-200 border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition outline-none text-slate-700"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-amber-500 hover:shadow-amber-500/30 transition-all duration-300 transform hover:-translate-y-1 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {submitting ? 'Traitement en cours...' : 'Confirmer la Réservation'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
