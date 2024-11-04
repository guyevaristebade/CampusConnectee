import React from 'react';
import { Route, Navigate     } from 'react-router-dom';
import { useAuth } from "../hooks";

interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children}) => {

    const { user } = useAuth();

    return (
        <Route>
            {user ? children : <Navigate to="/login" />}
        </Route>
    );
};
