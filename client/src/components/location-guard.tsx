import React from 'react';
import { useLocation } from '../context';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';

interface LocationGuardProps {
    children: React.ReactNode;
}

export const LocationGuard: React.FC<LocationGuardProps> = ({ children }) => {
    const { isAtCampus, loading } = useLocation();

    // Si la géolocalisation est en cours, on peut afficher un spinner
    if (loading) {
        return <Spin size="large" percent="auto" />;
    }

    if (!isAtCampus) {
        return <Navigate to="/not-authorized" />;
    }

    // Sinon, on rend l'enfant (la page protégée)
    return <>{children}</>;
};

