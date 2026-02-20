import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Phone, ArrowLeft, AlertTriangle } from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

const BookingPage = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        customerName: '',
        customerPhone: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    carId: parseInt(carId),
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    customerName: formData.customerName,
                    customerPhone: formData.customerPhone,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                setError(json.message || 'Une erreur est survenue.');
                return;
            }

            alert('Demande de réservation envoyée avec succès !');
            navigate('/cars');
        } catch (err) {
            setError('Erreur réseau. Veuillez vérifier votre connexion et réessayer.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 py-24 flex items-center justify-center">
            <div className="container mx-auto px-6 max-w-4xl">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
                    <ArrowLeft size={20} /> Retour
                </button>

                <div className="bg-white shadow-2xl overflow-hidden border border-zinc-200 flex flex-col md:flex-row relative">
                    <div className="absolute top-0 left-0 w-full md:w-1 md:h-full bg-red-600 z-20"></div>

                    {/* Image Side */}
                    <div className="md:w-1/2 bg-zinc-950 relative p-12 text-white flex flex-col justify-between overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 grayscale mix-blend-overlay"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-display font-bold mb-2 tracking-tight">Finalisez Votre Réservation</h2>
                            <p className="text-zinc-400 font-light">Vous êtes à quelques pas de prendre la route.</p>
                        </div>
                        <div className="relative z-10 mt-10">
                            <div className="flex items-center gap-4 text-sm text-zinc-300">
                                <div className="w-10 h-10 bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <Calendar size={18} />
                                </div>
                                <p>Confirmation immédiate</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="md:w-1/2 p-12 bg-white">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 flex items-start gap-2 text-sm">
                                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-zinc-700 text-sm font-bold mb-2 ml-1 uppercase tracking-wider">Date de début</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full pl-4 pr-4 py-3 bg-zinc-50 border-zinc-200 border-b-2 focus:border-red-600 focus:bg-white transition-all outline-none text-zinc-800 rounded-none placeholder-zinc-400"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-zinc-700 text-sm font-bold mb-2 ml-1 uppercase tracking-wider">Date de fin</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full pl-4 pr-4 py-3 bg-zinc-50 border-zinc-200 border-b-2 focus:border-red-600 focus:bg-white transition-all outline-none text-zinc-800 rounded-none placeholder-zinc-400"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-zinc-700 text-sm font-bold mb-2 ml-1 uppercase tracking-wider">Nom Complet</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 text-zinc-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Votre nom"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-zinc-200 border-b-2 focus:border-red-600 focus:bg-white transition-all outline-none text-zinc-800 rounded-none placeholder-zinc-400"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-zinc-700 text-sm font-bold mb-2 ml-1 uppercase tracking-wider">Téléphone (WhatsApp)</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-3.5 text-zinc-400" size={18} />
                                    <input
                                        type="tel"
                                        placeholder="+212 6XX XXX XXX"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-zinc-200 border-b-2 focus:border-red-600 focus:bg-white transition-all outline-none text-zinc-800 rounded-none placeholder-zinc-400"
                                        value={formData.customerPhone}
                                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full bg-zinc-950 text-white font-bold py-4 shadow-lg hover:bg-red-600 hover:shadow-red-600/30 transition-all duration-300 transform rounded-none skew-x-[-5deg] ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <span className="skew-x-[5deg]">{submitting ? 'Traitement en cours...' : 'Confirmer la Réservation'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
