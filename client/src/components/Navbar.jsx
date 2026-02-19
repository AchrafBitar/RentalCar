import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
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
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center group">
                    <img src={Logo} alt="AgdalRent Logo" className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                </Link>
                <div className="space-x-8 hidden md:flex">
                    <Link to="/" className="text-zinc-600 hover:text-red-700 font-medium transition-colors text-sm uppercase tracking-wider">Accueil</Link>
                    <Link to="/cars" className="text-zinc-600 hover:text-red-700 font-medium transition-colors text-sm uppercase tracking-wider">Nos Voitures</Link>
                    <Link to="#" className="text-zinc-600 hover:text-red-700 font-medium transition-colors text-sm uppercase tracking-wider">À Propos</Link>
                    <Link to="#" className="text-zinc-600 hover:text-red-700 font-medium transition-colors text-sm uppercase tracking-wider">Contact</Link>
                </div>
                <Link to="/cars" className="bg-zinc-950 text-white px-6 py-2.5 rounded-none skew-x-[-10deg] hover:bg-red-700 hover:text-white transition-all duration-300 font-medium shadow-lg hover:shadow-red-900/20 text-sm hidden md:block">
                    <span className="skew-x-[10deg]">Réserver Maintenant</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
