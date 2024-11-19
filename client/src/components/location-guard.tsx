import React from 'react';
import { useLocation } from '../context';
import { Navigate } from 'react-router-dom';
import { Spin, Layout } from 'antd';

const { Content } = Layout;


interface LocationGuardProps {
    children: React.ReactNode;
}

export const LocationGuard: React.FC<LocationGuardProps> = ({ children }) => {
    const { isAtCampus, loading } = useLocation();

    // Si la géolocalisation est en cours, on peut afficher un spinner
    if (loading) {
        return <Content className='flex flex-col justify-center items-center min-h-full'>
            <Spin percent='auto' size='large' className='h-[400px]'/> 
        </Content>
    }

    if (!isAtCampus) {
        return <Navigate to="/not-authorized" />;
    }

    // Sinon, on rend l'enfant (la page protégée)
    return <>{children}</>;
};

