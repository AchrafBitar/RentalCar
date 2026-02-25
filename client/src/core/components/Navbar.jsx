import { Link, useLocation } from 'react-router-dom';
import Logo from '@tenant/assets/Logo.png';
import { useEffect, useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { useTenant } from '@core/context/TenantContext';
import { getImageUrl } from '@core/utils/imageUtils';

const Navbar = () => {
    const tenant = useTenant();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const navLinks = [
        { to: '/', label: 'Accueil' },
        { to: '/cars', label: 'Nos Voitures' },
        { to: '/about', label: 'À Propos' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || mobileOpen ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
                <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center group">
                        <img
                            src={getImageUrl(tenant?.logoUrl) || Logo}
                            alt={tenant?.company?.name || "Exact Rent Car"}
                            className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="space-x-8 hidden md:flex items-center">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`font-medium transition-colors text-sm uppercase tracking-wider ${location.pathname === link.to ? 'text-brand-primary' : 'text-zinc-600 hover:text-brand-primary'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link to="/admin" className="flex items-center gap-1.5 text-zinc-600 hover:text-brand-primary font-medium transition-colors text-sm uppercase tracking-wider">
                            <Shield size={14} />
                            Admin
                        </Link>
                    </div>

                    {/* Desktop CTA */}
                    <Link to="/cars" className="bg-brand-secondary text-white px-6 py-2.5 rounded-none skew-x-[-10deg] hover:bg-brand-primary hover:text-white transition-all duration-300 font-medium shadow-lg hover:shadow-brand-primary text-sm hidden md:block">
                        <span className="skew-x-[10deg]">Réserver Maintenant</span>
                    </Link>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-zinc-700 hover:text-brand-primary transition-colors z-50"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    ></div>

                    <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl flex flex-col pt-20">
                        <div className="px-6 pb-4 border-b border-zinc-100 mb-2">
                            <span className="font-display font-bold text-lg text-brand-primary">
                                {tenant?.company?.name || "Exact Rent Car"}
                            </span>
                        </div>
                        <div className="flex-1 px-6 py-4 space-y-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`block py-3 px-4 text-sm font-semibold uppercase tracking-wider transition-colors ${location.pathname === link.to
                                        ? 'text-brand-primary bg-red-50'
                                        : 'text-zinc-700 hover:text-brand-primary hover:bg-zinc-50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                to="/admin"
                                className="flex items-center gap-2 py-3 px-4 text-sm font-semibold uppercase tracking-wider text-zinc-700 hover:text-brand-primary hover:bg-zinc-50 transition-colors"
                            >
                                <Shield size={14} />
                                Admin
                            </Link>
                        </div>

                        {/* Mobile CTA */}
                        <div className="p-6 border-t border-zinc-100">
                            <Link
                                to="/cars"
                                className="block text-center bg-brand-primary hover:bg-brand-primary text-white font-bold py-3 px-6 transition-colors text-sm uppercase tracking-wider"
                            >
                                Réserver Maintenant
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
