import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Car, Wrench, CheckCircle, XCircle, RefreshCw, AlertTriangle, Calendar } from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [togglingId, setTogglingId] = useState(null);
    const calendarRef = useRef(null);

    // Fetch calendar data from the admin API
    const fetchCalendarData = async () => {
        try {
            setError(null);
            const res = await fetch(`${API_BASE}/admin/calendar`);
            if (!res.ok) throw new Error('Erreur lors du chargement.');
            const json = await res.json();
            setEvents(json.data.events);
            setCars(json.data.cars);
        } catch (err) {
            console.error('Calendar fetch error:', err);
            setError(err.message);
            // Fallback mock data for development
            setCars([
                { id: 1, model: 'Mercedes-Benz C-Class', status: 'AVAILABLE', pricePerDay: 800, version: 1 },
                { id: 2, model: 'BMW X5', status: 'MAINTENANCE', pricePerDay: 1200, version: 1 },
                { id: 3, model: 'Range Rover Sport', status: 'AVAILABLE', pricePerDay: 1800, version: 1 },
            ]);
            setEvents([
                { id: 'booking-1', title: 'Mercedes-Benz C-Class — Ahmed', start: '2026-02-20', end: '2026-02-25', color: '#ef4444', extendedProps: { type: 'booking', status: 'CONFIRMED', carModel: 'Mercedes-Benz C-Class', customerName: 'Ahmed', customerPhone: '+212600000000' } },
                { id: 'maintenance-2', title: '🔧 BMW X5 — Maintenance', start: '2026-02-18', end: '2027-02-18', color: '#f97316', extendedProps: { type: 'maintenance', carModel: 'BMW X5' } },
                { id: 'booking-3', title: 'Range Rover Sport — Karim', start: '2026-02-22', end: '2026-02-28', color: '#facc15', extendedProps: { type: 'booking', status: 'PENDING', carModel: 'Range Rover Sport', customerName: 'Karim', customerPhone: '+212611111111' } },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCalendarData(); }, []);

    // Toggle maintenance status for a vehicle
    const toggleMaintenance = async (carId) => {
        setTogglingId(carId);
        try {
            const res = await fetch(`${API_BASE}/admin/cars/${carId}/maintenance`, { method: 'PUT' });
            const json = await res.json();
            if (!res.ok) {
                alert(json.message || 'Erreur lors de la mise à jour.');
                return;
            }
            // Refresh data
            await fetchCalendarData();
        } catch (err) {
            alert('Erreur réseau. Veuillez réessayer.');
        } finally {
            setTogglingId(null);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-40 min-h-screen bg-zinc-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-100 pt-20">
            <div className="container mx-auto px-4 lg:px-6 py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                            <Calendar size={20} className="text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 font-display uppercase tracking-tight">
                            Tableau de Bord Admin
                        </h1>
                    </div>
                    <p className="text-zinc-500 font-light ml-13">
                        Gérez votre flotte et visualisez les réservations en temps réel.
                    </p>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-6 mb-6 bg-white p-4 border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-emerald-500 rounded-sm inline-block"></span>
                        <span className="text-sm text-zinc-600">Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-red-500 rounded-sm inline-block"></span>
                        <span className="text-sm text-zinc-600">Réservé (Confirmé)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-yellow-400 rounded-sm inline-block"></span>
                        <span className="text-sm text-zinc-600">Réservé (En attente)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-orange-500 rounded-sm inline-block"></span>
                        <span className="text-sm text-zinc-600">Maintenance</span>
                    </div>
                    <button
                        onClick={fetchCalendarData}
                        className="ml-auto flex items-center gap-2 text-sm text-zinc-500 hover:text-red-600 transition-colors"
                    >
                        <RefreshCw size={16} /> Rafraîchir
                    </button>
                </div>

                {error && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 mb-6 flex items-center gap-2 text-sm">
                        <AlertTriangle size={16} />
                        <span>Mode démonstration — Données fictives affichées. Connectez le serveur pour les données réelles.</span>
                    </div>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Calendar */}
                    <div className="lg:col-span-3 bg-white border border-zinc-200 shadow-sm p-4 md:p-6">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            locale="fr"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,dayGridWeek',
                            }}
                            height="auto"
                            eventDisplay="block"
                            dayMaxEvents={3}
                            eventContent={(arg) => (
                                <div className="px-1 py-0.5 text-xs font-medium truncate">
                                    {arg.event.title}
                                </div>
                            )}
                        />
                    </div>

                    {/* Vehicle Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wider font-display flex items-center gap-2">
                            <Car size={20} className="text-red-600" />
                            Véhicules
                        </h2>

                        {cars.map((car) => {
                            const isMaintenance = car.status === 'MAINTENANCE';
                            const isToggling = togglingId === car.id;

                            return (
                                <div
                                    key={car.id}
                                    className={`bg-white border p-4 transition-all duration-200 ${isMaintenance
                                            ? 'border-orange-300 bg-orange-50/50'
                                            : 'border-zinc-200 hover:border-zinc-300'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-zinc-900 text-sm">{car.model}</h3>
                                            <p className="text-xs text-zinc-400 mt-0.5">{car.pricePerDay} MAD/jour</p>
                                        </div>
                                        <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${isMaintenance
                                                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            }`}>
                                            {isMaintenance ? 'Maintenance' : 'Actif'}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => toggleMaintenance(car.id)}
                                        disabled={isToggling}
                                        className={`w-full flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${isMaintenance
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                                            } ${isToggling ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    >
                                        {isToggling ? (
                                            <RefreshCw size={14} className="animate-spin" />
                                        ) : isMaintenance ? (
                                            <><CheckCircle size={14} /> Remettre en service</>
                                        ) : (
                                            <><Wrench size={14} /> Mise hors service</>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
