import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Phone, ArrowLeft, AlertTriangle, Car, MapPin } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const BookingPage = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const calendarRef = useRef(null);

    const [carData, setCarData] = useState(null);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        customerName: '',
        customerPhone: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [selectionStart, setSelectionStart] = useState(null);

    // Fetch car details + availability
    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const res = await fetch(`${API_BASE}/cars/${carId}/availability`);
                if (!res.ok) throw new Error('Véhicule introuvable.');
                const data = await res.json();
                setCarData(data.car);
                setUnavailableDates(data.unavailableDates);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAvailability();
    }, [carId]);

    // Check if a date falls within any unavailable range
    const isDateUnavailable = (dateStr) => {
        const date = new Date(dateStr);
        return unavailableDates.some(range => {
            const start = new Date(range.start);
            const end = new Date(range.end);
            return date >= start && date < end;
        });
    };

    // Check if a range overlaps with any unavailable period
    const rangeOverlapsUnavailable = (startStr, endStr) => {
        const start = new Date(startStr);
        const end = new Date(endStr);
        return unavailableDates.some(range => {
            const rStart = new Date(range.start);
            const rEnd = new Date(range.end);
            return start < rEnd && end > rStart;
        });
    };

    // Build calendar events from unavailable dates
    const calendarEvents = [
        ...unavailableDates.filter(d => d.type === 'booking').map(d => ({
            title: d.status === 'CONFIRMED' ? 'Réservé' : 'En attente',
            start: d.start,
            end: d.end,
            backgroundColor: d.status === 'CONFIRMED' ? '#dc2626' : '#f59e0b',
            borderColor: d.status === 'CONFIRMED' ? '#b91c1c' : '#d97706',
            textColor: '#fff',
            display: 'background',
            classNames: ['unavailable-event'],
        })),
        ...unavailableDates.filter(d => d.type === 'blocked').map(d => ({
            title: d.reason || 'Indisponible',
            start: d.start,
            end: d.end,
            backgroundColor: '#71717a',
            borderColor: '#52525b',
            textColor: '#fff',
            display: 'background',
            classNames: ['blocked-event'],
        })),
        // User selection highlight
        ...(formData.startDate && formData.endDate ? [{
            title: 'Votre sélection',
            start: formData.startDate,
            end: formData.endDate,
            backgroundColor: '#16a34a',
            borderColor: '#15803d',
            textColor: '#fff',
            display: 'background',
            classNames: ['selection-event'],
        }] : []),
    ];

    // Handle calendar date click — select start, then end
    const handleDateClick = (info) => {
        const clickedDate = info.dateStr;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const clicked = new Date(clickedDate);

        if (clicked < today) return; // No past dates
        if (isDateUnavailable(clickedDate)) return; // No unavailable dates

        if (!selectionStart) {
            // First click = start date
            setSelectionStart(clickedDate);
            setFormData(prev => ({ ...prev, startDate: clickedDate, endDate: '' }));
            setError(null);
        } else {
            // Second click = end date
            if (clickedDate <= selectionStart) {
                // If clicked before the start, reset to new start
                setSelectionStart(clickedDate);
                setFormData(prev => ({ ...prev, startDate: clickedDate, endDate: '' }));
                return;
            }

            // Check range validity
            if (rangeOverlapsUnavailable(selectionStart, clickedDate)) {
                setError('La période sélectionnée chevauche des dates indisponibles. Veuillez choisir une autre période.');
                setSelectionStart(null);
                setFormData(prev => ({ ...prev, startDate: '', endDate: '' }));
                return;
            }

            setFormData(prev => ({ ...prev, endDate: clickedDate }));
            setSelectionStart(null);
            setError(null);
        }
    };

    // Custom day cell render — add visual indicators
    const dayCellClassNames = (arg) => {
        const dateStr = arg.date.toISOString().split('T')[0];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const classes = [];

        if (arg.date < today) {
            classes.push('past-date');
        } else if (isDateUnavailable(dateStr)) {
            classes.push('unavailable-date');
        } else {
            classes.push('available-date');
        }

        if (dateStr === formData.startDate) classes.push('selected-start');
        if (dateStr === formData.endDate) classes.push('selected-end');
        if (dateStr === selectionStart) classes.push('selecting-start');

        return classes;
    };

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

    if (loading) return (
        <div className="flex justify-center items-center py-40 min-h-screen bg-zinc-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-50 py-24">
            <div className="container mx-auto px-6 max-w-7xl">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
                    <ArrowLeft size={20} /> Retour
                </button>

                {/* Car Info Header */}
                {carData && (
                    <div className="bg-white border border-zinc-200 shadow-lg mb-8 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-600 z-10"></div>
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                                <img
                                    src={carData.image || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop'}
                                    alt={carData.model}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="md:w-2/3 p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-2 text-red-600 text-sm font-bold uppercase tracking-wider mb-2">
                                    <Car size={16} />
                                    <span>{carData.company?.name || 'Location'}</span>
                                </div>
                                <h1 className="text-3xl font-display font-bold text-zinc-900 uppercase tracking-tight mb-2">{carData.model}</h1>
                                <div className="flex items-center gap-6 text-zinc-500">
                                    <span className="text-2xl font-bold text-zinc-900">{carData.pricePerDay} <span className="text-sm font-normal text-zinc-500">MAD/jour</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar - 2 columns */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-zinc-200 shadow-lg p-6">
                            <h2 className="text-xl font-display font-bold text-zinc-900 uppercase tracking-wide mb-2">Choisissez Vos Dates</h2>
                            <p className="text-sm text-zinc-500 mb-4">
                                {!selectionStart
                                    ? 'Cliquez sur une date disponible pour commencer votre sélection.'
                                    : '✓ Date de début sélectionnée. Cliquez sur une date de fin.'}
                            </p>

                            {/* Legend */}
                            <div className="flex flex-wrap gap-4 mb-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block"></span>
                                    <span className="text-zinc-600">Disponible</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 bg-red-600 rounded-sm inline-block"></span>
                                    <span className="text-zinc-600">Réservé</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 bg-amber-500 rounded-sm inline-block"></span>
                                    <span className="text-zinc-600">En attente</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 bg-zinc-500 rounded-sm inline-block"></span>
                                    <span className="text-zinc-600">Indisponible</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 bg-green-600 rounded-sm inline-block"></span>
                                    <span className="text-zinc-600">Votre sélection</span>
                                </div>
                            </div>

                            <div className="booking-calendar">
                                <FullCalendar
                                    ref={calendarRef}
                                    plugins={[dayGridPlugin, interactionPlugin]}
                                    initialView="dayGridMonth"
                                    locale="fr"
                                    headerToolbar={{
                                        left: 'prev',
                                        center: 'title',
                                        right: 'next',
                                    }}
                                    events={calendarEvents}
                                    dateClick={handleDateClick}
                                    dayCellClassNames={dayCellClassNames}
                                    height="auto"
                                    fixedWeekCount={false}
                                    showNonCurrentDates={false}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Booking Form - 1 column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-zinc-200 shadow-lg p-6 sticky top-24">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                            <h2 className="text-xl font-display font-bold text-zinc-900 uppercase tracking-wide mb-6">Réservation</h2>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 flex items-start gap-2 text-sm">
                                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Selected Dates Display */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-zinc-700 text-xs font-bold mb-1.5 uppercase tracking-wider">Début</label>
                                        <div className={`py-2.5 px-3 border-b-2 text-sm ${formData.startDate ? 'bg-emerald-50 border-emerald-500 text-zinc-900' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                                            {formData.startDate || 'Cliquez le calendrier'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-zinc-700 text-xs font-bold mb-1.5 uppercase tracking-wider">Fin</label>
                                        <div className={`py-2.5 px-3 border-b-2 text-sm ${formData.endDate ? 'bg-emerald-50 border-emerald-500 text-zinc-900' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                                            {formData.endDate || 'Cliquez le calendrier'}
                                        </div>
                                    </div>
                                </div>

                                {/* Duration + Price */}
                                {formData.startDate && formData.endDate && carData && (
                                    <div className="bg-zinc-950 text-white p-4 -mx-6 px-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-zinc-400 text-sm">
                                                {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} jours
                                            </span>
                                            <span className="text-xl font-bold">
                                                {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) * carData.pricePerDay} MAD
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-zinc-700 text-xs font-bold mb-1.5 uppercase tracking-wider">Nom Complet</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-zinc-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Votre nom"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border-zinc-200 border-b-2 focus:border-red-600 focus:bg-white transition-all outline-none text-zinc-800 rounded-none placeholder-zinc-400 text-sm"
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-zinc-700 text-xs font-bold mb-1.5 uppercase tracking-wider">Téléphone (WhatsApp)</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 text-zinc-400" size={16} />
                                        <input
                                            type="tel"
                                            placeholder="+212 6XX XXX XXX"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border-zinc-200 border-b-2 focus:border-red-600 focus:bg-white transition-all outline-none text-zinc-800 rounded-none placeholder-zinc-400 text-sm"
                                            value={formData.customerPhone}
                                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || !formData.startDate || !formData.endDate}
                                    className={`w-full bg-zinc-950 text-white font-bold py-3.5 shadow-lg hover:bg-red-600 hover:shadow-red-600/30 transition-all duration-300 transform rounded-none skew-x-[-5deg] ${submitting || !formData.startDate || !formData.endDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="skew-x-[5deg] text-sm">{submitting ? 'Traitement...' : 'Confirmer la Réservation'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar custom styles */}
            <style>{`
                .booking-calendar .fc {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .booking-calendar .fc-toolbar-title {
                    font-family: 'Playfair Display', serif;
                    text-transform: uppercase;
                    font-size: 1.1rem !important;
                    letter-spacing: 0.05em;
                }
                .booking-calendar .fc-button {
                    background: #18181b !important;
                    border: none !important;
                    border-radius: 0 !important;
                    padding: 6px 14px !important;
                    font-weight: 600 !important;
                    text-transform: uppercase !important;
                    font-size: 0.7rem !important;
                    letter-spacing: 0.1em !important;
                }
                .booking-calendar .fc-button:hover {
                    background: #dc2626 !important;
                }
                .booking-calendar .fc-button-active {
                    background: #dc2626 !important;
                }
                .booking-calendar .fc-col-header-cell {
                    background: #fafafa;
                    border-color: #e4e4e7 !important;
                    padding: 8px 0;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 700;
                    color: #71717a;
                }
                .booking-calendar .fc-daygrid-day {
                    cursor: pointer;
                    transition: all 0.15s ease;
                    min-height: 60px;
                }
                .booking-calendar .fc-daygrid-day:hover {
                    background: #f0fdf4 !important;
                }
                .booking-calendar .fc-daygrid-day.past-date {
                    background: #fafafa !important;
                    cursor: not-allowed;
                    opacity: 0.4;
                }
                .booking-calendar .fc-daygrid-day.past-date:hover {
                    background: #fafafa !important;
                }
                .booking-calendar .fc-daygrid-day.unavailable-date {
                    cursor: not-allowed;
                }
                .booking-calendar .fc-daygrid-day.unavailable-date:hover {
                    background: inherit !important;
                }
                .booking-calendar .fc-daygrid-day.available-date .fc-daygrid-day-number {
                    color: #16a34a;
                    font-weight: 700;
                }
                .booking-calendar .fc-daygrid-day.selected-start .fc-daygrid-day-number,
                .booking-calendar .fc-daygrid-day.selected-end .fc-daygrid-day-number {
                    background: #16a34a;
                    color: #fff !important;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .booking-calendar .fc-daygrid-day.selecting-start .fc-daygrid-day-number {
                    background: #dc2626;
                    color: #fff !important;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: pulse 1.5s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
                    50% { box-shadow: 0 0 0 8px rgba(220,38,38,0); }
                }
                .booking-calendar .fc-daygrid-day-frame {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4px;
                }
                .booking-calendar .fc-scrollgrid {
                    border-color: #e4e4e7 !important;
                }
                .booking-calendar td, .booking-calendar th {
                    border-color: #e4e4e7 !important;
                }
                /* ── Mobile overrides ── */
                @media (max-width: 640px) {
                    .booking-calendar .fc-toolbar {
                        flex-direction: row !important;
                        gap: 4px;
                    }
                    .booking-calendar .fc-toolbar-title {
                        font-size: 0.85rem !important;
                    }
                    .booking-calendar .fc-button {
                        padding: 4px 8px !important;
                        font-size: 0.6rem !important;
                    }
                    .booking-calendar .fc-daygrid-day {
                        min-height: 40px;
                    }
                    .booking-calendar .fc-col-header-cell {
                        font-size: 0.65rem;
                        padding: 4px 0;
                    }
                    .booking-calendar .fc-daygrid-day-number {
                        font-size: 0.75rem;
                    }
                }
                /* Hide scrollbar for tabs */
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default BookingPage;
