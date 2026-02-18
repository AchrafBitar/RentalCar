import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-slate-900 group">
                    <div className="bg-slate-900 text-white p-2 rounded-lg group-hover:bg-amber-500 transition-colors duration-300">
                        <Car size={24} />
                    </div>
                    <span className="font-display tracking-tight group-hover:text-amber-600 transition-colors">AgdalRent</span>
                </Link>
                <div className="space-x-8 hidden md:flex">
                    <Link to="/" className="text-slate-600 hover:text-amber-600 font-medium transition-colors text-sm uppercase tracking-wider">Accueil</Link>
                    <Link to="/cars" className="text-slate-600 hover:text-amber-600 font-medium transition-colors text-sm uppercase tracking-wider">Nos Voitures</Link>
                    <Link to="#" className="text-slate-600 hover:text-amber-600 font-medium transition-colors text-sm uppercase tracking-wider">À Propos</Link>
                    <Link to="#" className="text-slate-600 hover:text-amber-600 font-medium transition-colors text-sm uppercase tracking-wider">Contact</Link>
                </div>
                <Link to="/cars" className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-amber-500 hover:text-white transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-sm hidden md:block">
                    Réserver Maintenant
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
