import React, { createContext, useState, useEffect, useContext } from 'react';
import { tenantService } from '../services/tenantService';

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
    const [tenantConfig, setTenantConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await tenantService.getTenantConfig();
                if (config) {
                    setTenantConfig(config);
                    // Apply CSS variables dynamically to the document root
                    document.documentElement.style.setProperty('--primary-color', config.primaryColor);
                    document.documentElement.style.setProperty('--secondary-color', config.secondaryColor);
                } else {
                    setError('Tenant configuration not found.');
                }
            } catch (err) {
                setError('Failed to load tenant styling.');
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-secondary text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-secondary text-brand-primary font-medium">
                {error}
            </div>
        );
    }

    return (
        <TenantContext.Provider value={tenantConfig}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
};
