import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const json = await res.json();

            if (!res.ok) {
                setError(json.message || 'Identifiants incorrects.');
                return;
            }

            // Store token and redirect to admin dashboard
            localStorage.setItem('admin_token', json.data.token);
            navigate('/admin');
        } catch (err) {
            setError('Erreur réseau. Vérifiez que le serveur est démarré.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-100 flex items-center justify-center py-24 px-4">
            <div className="w-full max-w-md">

                {/* Logo / Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-zinc-950 flex items-center justify-center mx-auto mb-4">
                        <Shield size={28} className="text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 font-display uppercase tracking-tight">
                        Espace Admin
                    </h1>
                    <p className="text-zinc-500 mt-2 text-sm font-light">
                        Connectez-vous pour accéder au tableau de bord.
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white border border-zinc-200 shadow-xl overflow-hidden">
                    <div className="h-1 bg-red-600"></div>
                    <div className="p-8">

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 flex items-start gap-2 text-sm">
                                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-zinc-700 text-xs font-bold mb-1.5 uppercase tracking-wider">
                                    Nom d'utilisateur
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-zinc-400" size={16} />
                                    <input
                                        type="text"
                                        required
                                        autoComplete="username"
                                        placeholder="admin"
                                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border-zinc-200 border-b-2 focus:border-red-600 focus:bg-white transition-all outline-none text-zinc-800 rounded-none placeholder-zinc-400 text-sm"
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-zinc-700 text-xs font-bold mb-1.5 uppercase tracking-wider">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-zinc-400" size={16} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 border-zinc-200 border-b-2 focus:border-red-600 focus:bg-white transition-all outline-none text-zinc-800 rounded-none placeholder-zinc-400 text-sm"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-zinc-950 text-white font-bold py-3.5 shadow-lg hover:bg-red-600 hover:shadow-red-600/30 transition-all duration-300 skew-x-[-5deg] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className="skew-x-[5deg] text-sm flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                            Connexion...
                                        </>
                                    ) : (
                                        <>
                                            <Shield size={16} />
                                            Se Connecter
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>

                <p className="text-center text-zinc-400 text-xs mt-6">
                    © 2026 Exact Rent Car — Accès réservé au personnel autorisé.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
