import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Phone, ArrowLeft, AlertTriangle, Car, MapPin, Upload, FileText, CheckCircle, Mail } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../services/api';

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
        customerEmail: '',
    });
    const [files, setFiles] = useState({
        permis: null,
        cin: null,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectionStart, setSelectionStart] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Fetch car details + availability
    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const data = await api.get(`/cars/${carId}/availability`);
                setCarData(data.car);
                setUnavailableDates(data.unavailableDates);
            } catch (err) {
                setError(err.message || 'Véhicule introuvable.');
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
        if (!files.permis || !files.cin) {
            setError('Veuillez joindre votre permis de conduire et votre CIN.');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const submitData = new FormData();
            submitData.append('carId', carId);
            submitData.append('startDate', formData.startDate);
            submitData.append('endDate', formData.endDate);
            submitData.append('customerName', formData.customerName);
            submitData.append('customerPhone', formData.customerPhone);
            submitData.append('customerEmail', formData.customerEmail);
            submitData.append('permis', files.permis);
            submitData.append('cin', files.cin);

            const json = await api.post('/bookings', submitData);

            if (json.success) {
                setBookingSuccess(true);
            } else {
                setError(json.message || 'La réservation a échoué.');
            }
        } catch (err) {
            setError(err.message || 'Une erreur est survenue lors de la communication avec le serveur.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-40 min-h-screen bg-zinc-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
    );

    if (bookingSuccess) {
        return (
            <div className="fixed inset-0 z-[100] bg-zinc-50 flex flex-col items-center justify-center p-6 overflow-y-auto">
                <div className="bg-white border border-zinc-200 shadow-xl max-w-2xl w-full p-10 text-center relative overflow-hidden my-auto">
                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-emerald-500" size={40} />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-zinc-900 uppercase tracking-tight mb-2">Réservation Envoyée</h1>
                    <p className="text-zinc-600 mb-8 max-w-md mx-auto">
                        Votre demande pour la <strong className="text-zinc-900">{carData.model}</strong> a bien été enregistrée. Vous recevrez un e-mail de confirmation très prochainement à <strong className="text-zinc-900">{formData.customerEmail}</strong>.
                    </p>

                    <div className="bg-zinc-50 border border-zinc-100 p-6 text-left mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 border-b border-zinc-200 pb-2">Récapitulatif</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-zinc-400 text-xs mb-1">Date de début</span>
                                <strong className="text-zinc-800">{formData.startDate}</strong>
                            </div>
                            <div>
                                <span className="block text-zinc-400 text-xs mb-1">Date de fin</span>
                                <strong className="text-zinc-800">{formData.endDate}</strong>
                            </div>
                            <div>
                                <span className="block text-zinc-400 text-xs mb-1">Nom Complet</span>
                                <strong className="text-zinc-800">{formData.customerName}</strong>
                            </div>
                            <div>
                                <span className="block text-zinc-400 text-xs mb-1">Téléphone</span>
                                <strong className="text-zinc-800">{formData.customerPhone}</strong>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/cars')}
                        className="inline-flex items-center gap-2 bg-brand-secondary text-white font-bold py-4 px-8 uppercase tracking-wider text-sm shadow-xl hover:bg-brand-primary hover:shadow-brand-primary transition-all duration-300 transform skew-x-[-10deg]"
                    >
                        <span className="skew-x-[10deg]">Retourner aux véhicules</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 py-24">
            <div className="container mx-auto px-6 max-w-7xl">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
                    <ArrowLeft size={20} /> Retour
                </button>

                {/* Car Info Header */}
                {carData && (
                    <div className="bg-white border border-zinc-200 shadow-lg mb-8 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary z-10"></div>
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                                <img
                                    src={carData.image || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop'}
                                    alt={carData.model}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="md:w-2/3 p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-2 text-brand-primary text-sm font-bold uppercase tracking-wider mb-2">
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
                                    <span className="w-3 h-3 bg-brand-primary rounded-sm inline-block"></span>
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
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary"></div>
                            <h2 className="text-xl font-display font-bold text-zinc-900 uppercase tracking-wide mb-6">Réservation</h2>

                            {error && (
                                <div className="bg-red-50 border border-brand-primary text-brand-primary px-4 py-3 mb-6 flex items-start gap-2 text-sm">
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
                                    <div className="bg-brand-secondary text-white p-4 -mx-6 px-6">
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
                                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border-zinc-200 border-b-2 focus:border-brand-primary focus:bg-white transition-all outline-none text-zinc-800 rounded-none placeholder-zinc-400 text-sm"
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
                                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border-zinc-200 border-b-2 focus:border-brand-primary focus:bg-white transition-all outline-none text-zinc-800 rounded-none placeholder-zinc-400 text-sm"
                                            value={formData.customerPhone}
                                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-zinc-700 text-xs font-bold mb-1.5 uppercase tracking-wider">Adresse Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-zinc-400" size={16} />
                                        <input
                                            type="email"
                                            placeholder="votre@email.com"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border-zinc-200 border-b-2 focus:border-brand-primary focus:bg-white transition-all outline-none text-zinc-800 rounded-none placeholder-zinc-400 text-sm"
                                            value={formData.customerEmail}
                                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Upload Zones */}
                                <div className="space-y-4 pt-2 border-t border-zinc-100">
                                    {/* Permis de Conduire */}
                                    <div>
                                        <label className="block text-zinc-700 text-xs font-bold mb-1.5 uppercase tracking-wider">Permis de Conduire (Obligatoire)</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                id="permisFile"
                                                className="hidden"
                                                onChange={(e) => setFiles({ ...files, permis: e.target.files[0] })}
                                            />
                                            <label
                                                htmlFor="permisFile"
                                                className={`flex items-center justify-between w-full px-4 py-3 border-2 border-dashed cursor-pointer transition-all ${files.permis ? 'border-emerald-500 bg-emerald-50' : 'border-zinc-300 bg-zinc-50 hover:border-brand-primary hover:bg-red-50'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className={files.permis ? 'text-emerald-500' : 'text-zinc-400'} size={20} />
                                                    <span className={`text-sm ${files.permis ? 'text-emerald-700 font-medium' : 'text-zinc-500'}`}>
                                                        {files.permis ? files.permis.name : 'Sélectionner un fichier (Max 5Mo)'}
                                                    </span>
                                                </div>
                                                {files.permis ? <CheckCircle className="text-emerald-500" size={18} /> : <Upload className="text-zinc-400" size={18} />}
                                            </label>
                                        </div>
                                    </div>

                                    {/* CIN */}
                                    <div>
                                        <label className="block text-zinc-700 text-xs font-bold mb-1.5 uppercase tracking-wider">Carte d'Identité Nationale (Obligatoire)</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                id="cinFile"
                                                className="hidden"
                                                onChange={(e) => setFiles({ ...files, cin: e.target.files[0] })}
                                            />
                                            <label
                                                htmlFor="cinFile"
                                                className={`flex items-center justify-between w-full px-4 py-3 border-2 border-dashed cursor-pointer transition-all ${files.cin ? 'border-emerald-500 bg-emerald-50' : 'border-zinc-300 bg-zinc-50 hover:border-brand-primary hover:bg-red-50'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className={files.cin ? 'text-emerald-500' : 'text-zinc-400'} size={20} />
                                                    <span className={`text-sm ${files.cin ? 'text-emerald-700 font-medium' : 'text-zinc-500'}`}>
                                                        {files.cin ? files.cin.name : 'Sélectionner un fichier (Max 5Mo)'}
                                                    </span>
                                                </div>
                                                {files.cin ? <CheckCircle className="text-emerald-500" size={18} /> : <Upload className="text-zinc-400" size={18} />}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || !formData.startDate || !formData.endDate || !files.permis || !files.cin}
                                    className={`w-full bg-brand-secondary text-white font-bold py-3.5 shadow-lg hover:bg-brand-primary hover:shadow-brand-primary transition-all duration-300 transform rounded-none skew-x-[-5deg] ${submitting || !formData.startDate || !formData.endDate || !files.permis || !files.cin ? 'opacity-50 cursor-not-allowed hover:bg-brand-secondary hover:shadow-none' : ''} flex items-center justify-center`}
                                >
                                    {submitting ? (
                                        <div className="flex items-center gap-2 skew-x-[5deg]">
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                            <span className="text-sm">Envoi des documents...</span>
                                        </div>
                                    ) : (
                                        <span className="skew-x-[5deg] text-sm">Confirmer la Réservation</span>
                                    )}
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
