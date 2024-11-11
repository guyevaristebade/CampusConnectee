import React from 'react'
import { Switch, Layout } from 'antd'
import { Link } from 'react-router-dom'

const { Header } = Layout
export const NavBar = () => {
    return (
        <Header style={{
            backgroundColor: "#000091",            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            {/* Logo et titre à gauche */}
            <div style={{
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }}>
                <Link to="/" style={{ color: "#ffffff", textDecoration: "none" , fontSize: "clamp(14px, 2vw, 16px)"}}>
                    Campus Connecté de Nemours
                </Link>
            </div>

            {/* Boutons et switch à droite, avec flex wrap pour la responsivité */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap" 
            }}>
                <Switch
                    // checked={darkMode}
                    // onChange={toggleDarkMode}
                    checkedChildren="🌙"
                    unCheckedChildren="☀️"
                />
            </div>
        </Header>
    )
}
