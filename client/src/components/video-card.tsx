import React from 'react';
import { Card } from 'antd';

export const VideoCard: React.FC = () => {
    return (
        <Card
            hoverable
            cover={<video controls width="100%" src="/video_unknown"  autoPlay/>}
        >
            <Card.Meta title="Exemple de Vidéo" description="Une démonstration simple d'une vidéo intégrée." />
        </Card>
    );
};

