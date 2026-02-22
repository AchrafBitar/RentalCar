import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';

const FloatingMap = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Expanded Map */}
            {expanded && (
                <div className="mb-3 w-80 h-64 md:w-96 md:h-72 bg-white border border-zinc-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 text-white">
                        <span className="text-xs font-semibold flex items-center gap-1.5">
                            <MapPin size={12} className="text-red-500" />
                            Exact Rent Car — Agdal, Rabat
                        </span>
                        <button
                            onClick={() => setExpanded(false)}
                            className="p-0.5 hover:bg-white/10 rounded transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    {/* Map iframe */}
                    <iframe
                        title="Exact Rent Car — Agdal, Rabat"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.5!2d-6.8498!3d33.9928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDU5JzM0LjEiTiA2wrA1MCc1OS4zIlc!5e0!3m2!1sfr!2sma!4v1700000000000"
                        className="w-full h-full"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setExpanded(!expanded)}
                className={`ml-auto flex items-center gap-2 px-4 py-3 shadow-lg transition-all duration-300 ${expanded
                        ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                        : 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/30'
                    }`}
            >
                <MapPin size={18} />
                <span className="text-sm font-semibold hidden sm:inline">Nous Trouver</span>
            </button>
        </div>
    );
};

export default FloatingMap;
