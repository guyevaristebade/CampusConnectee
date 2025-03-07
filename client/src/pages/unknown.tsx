import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Result } from 'antd'

export const Unknown: React.FC = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Désolé, la page que vous recherchez est introuvable."
            extra={
                <Button type="primary">
                    <Link to="/">Retour à l'accueil</Link>
                </Button>
            }
        />
    )
}
