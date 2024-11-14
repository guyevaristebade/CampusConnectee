import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export const NotAuthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/'); // Redirige vers la page d'accueil ou à une autre page spécifique
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Result
        status="403"
        title="Accès refusé"
        subTitle="Vous n'êtes pas à proximité du campus et ne pouvez pas accéder à cette page."
        // extra={
        //   <Button type="primary" onClick={handleRetry}>
        //     Revenir à l'accueil
        //   </Button>
        // }
      />
    </div>
  );
};

