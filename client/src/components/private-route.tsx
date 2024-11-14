import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../hooks";

interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();  // Obtenez la location (URL actuelle)

    
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return <>{children}</>;
};
