import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
    Car, Wrench, CheckCircle, XCircle, RefreshCw, AlertTriangle,
    Calendar, Plus, Pencil, Trash2, ClipboardList, X, Search, Ban, LogOut
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ────────────────────────────────────────────────────────────
// Reusable Modal Shell
// ────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-lg mx-4 shadow-2xl border border-zinc-200 animate-in" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
                    <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-wider font-display">{title}</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-red-600 transition-colors"><X size={20} /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────────────────
// Status Badge
// ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const map = {
        AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        MAINTENANCE: 'bg-orange-50 text-orange-700 border-orange-200',
        PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        CONFIRMED: 'bg-red-50 text-red-700 border-red-200',
        CANCELLED: 'bg-zinc-100 text-zinc-500 border-zinc-200',
    };
    return (
        <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wide border ${map[status] || map.CANCELLED}`}>
            {status}
        </span>
    );
};

// ────────────────────────────────────────────────────────────
// Main Admin Dashboard
// ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('calendar');
    const [events, setEvents] = useState([]);
    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [togglingId, setTogglingId] = useState(null);
    const calendarRef = useRef(null);

    // ─── Auth Helpers ───────────────────────────────────────────
    const getToken = () => localStorage.getItem('admin_token');
    const authHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
    });
    const handleUnauthorized = () => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
    };
    const logout = () => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
    };

    // Redirect to login if no token
    useEffect(() => {
        if (!getToken()) navigate('/admin/login');
    }, []);

    // Car modal state
    const [carModal, setCarModal] = useState({ open: false, mode: 'add', car: null });
    const [carForm, setCarForm] = useState({ model: '', image: '', pricePerDay: '', companyId: '1', category: 'CONFORT' });
    const [carSaving, setCarSaving] = useState(false);

    // Booking modal state
    const [bookingModal, setBookingModal] = useState(false);
    const [bookingForm, setBookingForm] = useState({ carId: '', startDate: '', endDate: '', customerName: '', customerPhone: '', status: 'PENDING' });
    const [bookingSaving, setBookingSaving] = useState(false);

    // Blocked dates modal state
    const [blockedModal, setBlockedModal] = useState({ open: false, carId: null, carName: '' });
    const [blockedDates, setBlockedDates] = useState([]);
    const [blockedForm, setBlockedForm] = useState({ startDate: '', endDate: '', reason: '' });
    const [blockedSaving, setBlockedSaving] = useState(false);
    const [blockedLoading, setBlockedLoading] = useState(false);

    // Search states
    const [carSearch, setCarSearch] = useState('');
    const [bookingSearch, setBookingSearch] = useState('');

    // ─── Data Fetching ─────────────────────────────────────────
    const fetchAll = async () => {
        try {
            setError(null);
            const headers = { 'Authorization': `Bearer ${getToken()}` };
            const [calRes, carsRes, bookingsRes] = await Promise.all([
                fetch(`${API_BASE}/admin/calendar`, { headers }),
                fetch(`${API_BASE}/admin/cars`, { headers }),
                fetch(`${API_BASE}/admin/bookings`, { headers }),
            ]);
            if (calRes.status === 401 || carsRes.status === 401 || bookingsRes.status === 401) {
                handleUnauthorized(); return;
            }
            if (!calRes.ok || !carsRes.ok || !bookingsRes.ok) throw new Error('Erreur lors du chargement.');
            const [calJson, carsJson, bookingsJson] = await Promise.all([calRes.json(), carsRes.json(), bookingsRes.json()]);
            setEvents(calJson.data.events);
            setCars(carsJson.data);
            setBookings(bookingsJson.data);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (getToken()) fetchAll(); }, []);

    // ─── Car Handlers ──────────────────────────────────────────
    const openCarModal = (mode, car = null) => {
        setCarModal({ open: true, mode, car });
        if (mode === 'edit' && car) {
            setCarForm({ model: car.model, image: car.image || '', pricePerDay: String(car.pricePerDay), companyId: String(car.companyId), category: car.category || 'CONFORT' });
        } else {
            setCarForm({ model: '', image: '', pricePerDay: '', companyId: '1', category: 'CONFORT' });
        }
    };

    const saveCar = async () => {
        setCarSaving(true);
        try {
            const url = carModal.mode === 'edit'
                ? `${API_BASE}/admin/cars/${carModal.car.id}`
                : `${API_BASE}/admin/cars`;
            const method = carModal.mode === 'edit' ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: authHeaders(),
                body: JSON.stringify(carForm),
            });
            if (res.status === 401) { handleUnauthorized(); return; }
            const json = await res.json();
            if (!res.ok) { alert(json.message || 'Erreur.'); return; }
            setCarModal({ open: false, mode: 'add', car: null });
            await fetchAll();
        } catch { alert('Erreur réseau.'); }
        finally { setCarSaving(false); }
    };

    const deleteCar = async (id) => {
        if (!confirm('Supprimer ce véhicule et toutes ses réservations ?')) return;
        try {
            const res = await fetch(`${API_BASE}/admin/cars/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } });
            if (res.status === 401) { handleUnauthorized(); return; }
            const json = await res.json();
            if (!res.ok) { alert(json.message || 'Erreur.'); return; }
            await fetchAll();
        } catch { alert('Erreur réseau.'); }
    };

    const toggleMaintenance = async (carId) => {
        setTogglingId(carId);
        try {
            const res = await fetch(`${API_BASE}/admin/cars/${carId}/maintenance`, { method: 'PUT', headers: { 'Authorization': `Bearer ${getToken()}` } });
            if (res.status === 401) { handleUnauthorized(); return; }
            const json = await res.json();
            if (!res.ok) { alert(json.message || 'Erreur.'); return; }
            await fetchAll();
        } catch { alert('Erreur réseau.'); }
        finally { setTogglingId(null); }
    };

    // ─── Blocked Dates Handlers ────────────────────────────────
    const openBlockedModal = async (car) => {
        setBlockedModal({ open: true, carId: car.id, carName: car.model });
        setBlockedForm({ startDate: '', endDate: '', reason: '' });
        setBlockedLoading(true);
        try {
            const res = await fetch(`${API_BASE}/admin/cars/${car.id}/blocked-dates`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
            const json = await res.json();
            setBlockedDates(json.data || []);
        } catch { setBlockedDates([]); }
        finally { setBlockedLoading(false); }
    };

    const saveBlockedDate = async () => {
        setBlockedSaving(true);
        try {
            const res = await fetch(`${API_BASE}/admin/cars/${blockedModal.carId}/blocked-dates`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(blockedForm),
            });
            if (res.status === 401) { handleUnauthorized(); return; }
            const json = await res.json();
            if (!res.ok) { alert(json.message || 'Erreur.'); return; }
            setBlockedForm({ startDate: '', endDate: '', reason: '' });
            // Refresh list
            const res2 = await fetch(`${API_BASE}/admin/cars/${blockedModal.carId}/blocked-dates`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
            const json2 = await res2.json();
            setBlockedDates(json2.data || []);
        } catch { alert('Erreur réseau.'); }
        finally { setBlockedSaving(false); }
    };

    const deleteBlockedDate = async (id) => {
        if (!confirm('Supprimer cette période bloquée ?')) return;
        try {
            const res = await fetch(`${API_BASE}/admin/blocked-dates/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } });
            if (res.status === 401) { handleUnauthorized(); return; }
            const json = await res.json();
            if (!res.ok) { alert(json.message || 'Erreur.'); return; }
            setBlockedDates(prev => prev.filter(d => d.id !== id));
        } catch { alert('Erreur réseau.'); }
    };

    // ─── Booking Handlers ──────────────────────────────────────
    const openBookingModal = () => {
        setBookingModal(true);
        setBookingForm({ carId: cars[0]?.id || '', startDate: '', endDate: '', customerName: '', customerPhone: '', status: 'PENDING' });
    };

    const saveBooking = async () => {
        setBookingSaving(true);
        try {
            const res = await fetch(`${API_BASE}/admin/bookings`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(bookingForm),
            });
            if (res.status === 401) { handleUnauthorized(); return; }
            const json = await res.json();
            if (!res.ok) { alert(json.message || 'Erreur.'); return; }
            setBookingModal(false);
            await fetchAll();
        } catch { alert('Erreur réseau.'); }
        finally { setBookingSaving(false); }
    };

    const confirmBooking = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/admin/bookings/${id}/confirm`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${getToken()}` } });
            if (res.status === 401) { handleUnauthorized(); return; }
            const json = await res.json();
            if (!res.ok) { alert(json.message || 'Erreur.'); return; }
            await fetchAll();
        } catch { alert('Erreur réseau.'); }
    };

    const cancelBooking = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/admin/bookings/${id}/cancel`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${getToken()}` } });
            if (res.status === 401) { handleUnauthorized(); return; }
            const json = await res.json();
            if (!res.ok) { alert(json.message || 'Erreur.'); return; }
            await fetchAll();
        } catch { alert('Erreur réseau.'); }
    };

    const deleteBooking = async (id) => {
        if (!confirm('Supprimer définitivement cette réservation ?')) return;
        try {
            const res = await fetch(`${API_BASE}/admin/bookings/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } });
            if (res.status === 401) { handleUnauthorized(); return; }
            const json = await res.json();
            if (!res.ok) { alert(json.message || 'Erreur.'); return; }
            await fetchAll();
        } catch { alert('Erreur réseau.'); }
    };

    // ─── Filtered Data ─────────────────────────────────────────
    const filteredCars = cars.filter(c =>
        c.model.toLowerCase().includes(carSearch.toLowerCase()) ||
        c.status.toLowerCase().includes(carSearch.toLowerCase())
    );
    const filteredBookings = bookings.filter(b =>
        (b.customerName || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
        (b.car?.model || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.status.toLowerCase().includes(bookingSearch.toLowerCase())
    );

    // ─── Tab Style Helper ──────────────────────────────────────
    const tabClass = (tab) =>
        `flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 ${activeTab === tab
            ? 'border-red-600 text-red-600 bg-white'
            : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:border-zinc-300'
        }`;

    // ─── Loading ────────────────────────────────────────────────
    if (loading) return (
        <div className="flex justify-center items-center py-40 min-h-screen bg-zinc-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-100 pt-20">
            <div className="container mx-auto px-4 lg:px-6 py-8">

                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-600 flex items-center justify-center flex-shrink-0">
                            <Calendar size={20} className="text-white" />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-zinc-900 font-display uppercase tracking-tight">
                            Tableau de Bord
                        </h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <p className="text-zinc-500 font-light text-sm md:text-base ml-0 md:ml-13">
                            Gérez votre flotte et vos réservations.
                        </p>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-all border border-zinc-200"
                        >
                            <LogOut size={14} /> Déconnexion
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 mb-6 flex items-center gap-2 text-sm">
                        <AlertTriangle size={16} />
                        <span>Erreur de connexion au serveur. Vérifiez que le backend est démarré.</span>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-zinc-200 mb-4 md:mb-6 bg-zinc-50 overflow-x-auto scrollbar-hide">
                    <button className={tabClass('calendar')} onClick={() => setActiveTab('calendar')}>
                        <Calendar size={16} /> <span className="hidden sm:inline">Calendrier</span><span className="sm:hidden">Cal.</span>
                    </button>
                    <button className={tabClass('cars')} onClick={() => setActiveTab('cars')}>
                        <Car size={16} /> <span className="hidden sm:inline">Véhicules</span><span className="sm:hidden">Véh.</span>
                    </button>
                    <button className={tabClass('bookings')} onClick={() => setActiveTab('bookings')}>
                        <ClipboardList size={16} /> <span className="hidden sm:inline">Réservations</span><span className="sm:hidden">Rés.</span>
                    </button>
                    <button
                        onClick={fetchAll}
                        className="ml-auto flex items-center gap-1 md:gap-2 px-2 md:px-4 text-xs md:text-sm text-zinc-400 hover:text-red-600 transition-colors flex-shrink-0"
                    >
                        <RefreshCw size={14} /> <span className="hidden sm:inline">Rafraîchir</span>
                    </button>
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* TAB: CALENDAR                                          */}
                {/* ═══════════════════════════════════════════════════════ */}
                {activeTab === 'calendar' && (
                    <>
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
                        </div>

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
                                        left: 'prev,next',
                                        center: 'title',
                                        right: window.innerWidth < 640 ? '' : 'dayGridMonth,dayGridWeek',
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
                                                <StatusBadge status={car.status} />
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
                    </>
                )}

                {/* ═══════════════════════════════════════════════════════ */}
                {/* TAB: CARS MANAGEMENT                                   */}
                {/* ═══════════════════════════════════════════════════════ */}
                {activeTab === 'cars' && (
                    <div className="bg-white border border-zinc-200 shadow-sm">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-zinc-200">
                            <div className="relative w-full sm:w-72">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un véhicule..."
                                    value={carSearch}
                                    onChange={e => setCarSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500 transition-colors"
                                />
                            </div>
                            <button
                                onClick={() => openCarModal('add')}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors"
                            >
                                <Plus size={16} /> Ajouter un véhicule
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-zinc-50 border-b border-zinc-200">
                                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">ID</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Modèle</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Catégorie</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Prix/Jour</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Statut</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Compagnie</th>
                                        <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCars.map((car) => (
                                        <tr key={car.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-zinc-400 font-mono">#{car.id}</td>
                                            <td className="px-4 py-3 text-sm font-bold text-zinc-900">{car.model}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${(car.category || 'CONFORT') === 'LUX' ? 'bg-amber-100 text-amber-700' :
                                                    (car.category || 'CONFORT') === 'BUDGET' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>{car.category || 'CONFORT'}</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-zinc-600">{car.pricePerDay} MAD</td>
                                            <td className="px-4 py-3"><StatusBadge status={car.status} /></td>
                                            <td className="px-4 py-3 text-sm text-zinc-500">{car.company?.name || '—'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => toggleMaintenance(car.id)}
                                                        disabled={togglingId === car.id}
                                                        title={car.status === 'MAINTENANCE' ? 'Remettre en service' : 'Mise hors service'}
                                                        className={`p-1.5 rounded transition-colors ${car.status === 'MAINTENANCE'
                                                            ? 'text-emerald-600 hover:bg-emerald-50'
                                                            : 'text-orange-500 hover:bg-orange-50'
                                                            }`}
                                                    >
                                                        {togglingId === car.id ? <RefreshCw size={16} className="animate-spin" /> : <Wrench size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => openCarModal('edit', car)}
                                                        className="p-1.5 rounded text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openBlockedModal(car)}
                                                        className="p-1.5 rounded text-zinc-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                                                        title="Bloquer des dates"
                                                    >
                                                        <Ban size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCar(car.id)}
                                                        className="p-1.5 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCars.length === 0 && (
                                        <tr><td colSpan="6" className="px-4 py-8 text-center text-zinc-400 text-sm">Aucun véhicule trouvé.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-4 py-3 border-t border-zinc-100 text-xs text-zinc-400">
                            {filteredCars.length} véhicule(s)
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════ */}
                {/* TAB: BOOKINGS MANAGEMENT                               */}
                {/* ═══════════════════════════════════════════════════════ */}
                {activeTab === 'bookings' && (
                    <div className="bg-white border border-zinc-200 shadow-sm">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-zinc-200">
                            <div className="relative w-full sm:w-72">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une réservation..."
                                    value={bookingSearch}
                                    onChange={e => setBookingSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-4 border border-zinc-200 text-sm focus:outline-none focus:border-red-500 transition-colors"
                                />
                            </div>
                            <button
                                onClick={openBookingModal}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors"
                            >
                                <Plus size={16} /> Ajouter une réservation
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-zinc-50 border-b border-zinc-200">
                                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">ID</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Véhicule</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Client</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Téléphone</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Du</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Au</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Statut</th>
                                        <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map((b) => (
                                        <tr key={b.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-zinc-400 font-mono">#{b.id}</td>
                                            <td className="px-4 py-3 text-sm font-bold text-zinc-900">{b.car?.model || '—'}</td>
                                            <td className="px-4 py-3 text-sm text-zinc-700">{b.customerName || '—'}</td>
                                            <td className="px-4 py-3 text-sm text-zinc-500">{b.customerPhone || '—'}</td>
                                            <td className="px-4 py-3 text-sm text-zinc-600">{new Date(b.startDate).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-4 py-3 text-sm text-zinc-600">{new Date(b.endDate).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    {b.status === 'PENDING' && (
                                                        <button
                                                            onClick={() => confirmBooking(b.id)}
                                                            className="p-1.5 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                            title="Confirmer"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
                                                    {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                                                        <button
                                                            onClick={() => cancelBooking(b.id)}
                                                            className="p-1.5 rounded text-orange-500 hover:bg-orange-50 transition-colors"
                                                            title="Annuler"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteBooking(b.id)}
                                                        className="p-1.5 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredBookings.length === 0 && (
                                        <tr><td colSpan="8" className="px-4 py-8 text-center text-zinc-400 text-sm">Aucune réservation trouvée.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-4 py-3 border-t border-zinc-100 text-xs text-zinc-400">
                            {filteredBookings.length} réservation(s)
                        </div>
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* MODAL: Car Add / Edit                                      */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <Modal
                open={carModal.open}
                onClose={() => setCarModal({ open: false, mode: 'add', car: null })}
                title={carModal.mode === 'edit' ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Modèle *</label>
                        <input
                            type="text"
                            value={carForm.model}
                            onChange={e => setCarForm({ ...carForm, model: e.target.value })}
                            className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500 transition-colors"
                            placeholder="Ex: Mercedes-Benz C-Class"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Image URL</label>
                        <input
                            type="text"
                            value={carForm.image}
                            onChange={e => setCarForm({ ...carForm, image: e.target.value })}
                            className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500 transition-colors"
                            placeholder="https://..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Prix / Jour (MAD) *</label>
                            <input
                                type="number"
                                value={carForm.pricePerDay}
                                onChange={e => setCarForm({ ...carForm, pricePerDay: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500 transition-colors"
                                placeholder="800"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Company ID *</label>
                            <input
                                type="number"
                                value={carForm.companyId}
                                onChange={e => setCarForm({ ...carForm, companyId: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500 transition-colors"
                                placeholder="1"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Catégorie</label>
                        <select
                            value={carForm.category}
                            onChange={e => setCarForm({ ...carForm, category: e.target.value })}
                            className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500 transition-colors bg-white"
                        >
                            <option value="BUDGET">Budget</option>
                            <option value="CONFORT">Confort</option>
                            <option value="LUX">Lux</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                        <button
                            onClick={() => setCarModal({ open: false, mode: 'add', car: null })}
                            className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-700 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={saveCar}
                            disabled={carSaving || !carForm.model || !carForm.pricePerDay || !carForm.companyId}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {carSaving ? 'Enregistrement...' : carModal.mode === 'edit' ? 'Mettre à jour' : 'Ajouter'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* MODAL: Booking Add                                         */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <Modal
                open={bookingModal}
                onClose={() => setBookingModal(false)}
                title="Ajouter une réservation"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Véhicule *</label>
                        <select
                            value={bookingForm.carId}
                            onChange={e => setBookingForm({ ...bookingForm, carId: e.target.value })}
                            className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500 transition-colors bg-white"
                        >
                            <option value="">Sélectionner...</option>
                            {cars.filter(c => c.status === 'AVAILABLE').map(c => (
                                <option key={c.id} value={c.id}>{c.model} — {c.pricePerDay} MAD/jour</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Date début *</label>
                            <input
                                type="date"
                                value={bookingForm.startDate}
                                onChange={e => setBookingForm({ ...bookingForm, startDate: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Date fin *</label>
                            <input
                                type="date"
                                value={bookingForm.endDate}
                                onChange={e => setBookingForm({ ...bookingForm, endDate: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Nom client</label>
                            <input
                                type="text"
                                value={bookingForm.customerName}
                                onChange={e => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500 transition-colors"
                                placeholder="Ahmed"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Téléphone</label>
                            <input
                                type="text"
                                value={bookingForm.customerPhone}
                                onChange={e => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500 transition-colors"
                                placeholder="+212600000000"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Statut</label>
                        <select
                            value={bookingForm.status}
                            onChange={e => setBookingForm({ ...bookingForm, status: e.target.value })}
                            className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500 transition-colors bg-white"
                        >
                            <option value="PENDING">En attente</option>
                            <option value="CONFIRMED">Confirmé</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                        <button
                            onClick={() => setBookingModal(false)}
                            className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-700 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={saveBooking}
                            disabled={bookingSaving || !bookingForm.carId || !bookingForm.startDate || !bookingForm.endDate}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {bookingSaving ? 'Enregistrement...' : 'Ajouter'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* MODAL: Blocked Dates Management                            */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <Modal
                open={blockedModal.open}
                onClose={() => setBlockedModal({ open: false, carId: null, carName: '' })}
                title={`Dates bloquées — ${blockedModal.carName}`}
            >
                <div className="space-y-4">
                    {/* Existing blocked dates */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Périodes bloquées</h4>
                        {blockedLoading ? (
                            <p className="text-sm text-zinc-400">Chargement...</p>
                        ) : blockedDates.length === 0 ? (
                            <p className="text-sm text-zinc-400 italic">Aucune période bloquée.</p>
                        ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {blockedDates.map(bd => (
                                    <div key={bd.id} className="flex items-center justify-between bg-zinc-50 border border-zinc-200 px-3 py-2">
                                        <div>
                                            <span className="text-sm font-medium text-zinc-800">
                                                {new Date(bd.startDate).toLocaleDateString('fr-FR')} → {new Date(bd.endDate).toLocaleDateString('fr-FR')}
                                            </span>
                                            {bd.reason && <span className="text-xs text-zinc-400 ml-2">({bd.reason})</span>}
                                        </div>
                                        <button
                                            onClick={() => deleteBlockedDate(bd.id)}
                                            className="text-zinc-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add new blocked date */}
                    <div className="border-t border-zinc-100 pt-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Ajouter une période</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-zinc-500 mb-1">Début *</label>
                                <input
                                    type="date"
                                    value={blockedForm.startDate}
                                    onChange={e => setBlockedForm({ ...blockedForm, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-500 mb-1">Fin *</label>
                                <input
                                    type="date"
                                    value={blockedForm.endDate}
                                    onChange={e => setBlockedForm({ ...blockedForm, endDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500"
                                />
                            </div>
                        </div>
                        <div className="mt-3">
                            <label className="block text-xs text-zinc-500 mb-1">Raison (optionnel)</label>
                            <input
                                type="text"
                                value={blockedForm.reason}
                                onChange={e => setBlockedForm({ ...blockedForm, reason: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-200 text-sm focus:outline-none focus:border-red-500"
                                placeholder="Ex: Entretien préventif"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setBlockedModal({ open: false, carId: null, carName: '' })}
                                className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-700 transition-colors"
                            >
                                Fermer
                            </button>
                            <button
                                onClick={saveBlockedDate}
                                disabled={blockedSaving || !blockedForm.startDate || !blockedForm.endDate}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {blockedSaving ? 'Enregistrement...' : 'Bloquer'}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
