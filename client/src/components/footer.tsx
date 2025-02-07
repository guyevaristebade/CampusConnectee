import React from 'react'
import { Layout } from 'antd'
const { Footer } = Layout
export const Foot: React.FC = () => {
  return (
    <Footer className="text-center text-white px-5 py-10 bg-[#000091] mb-0">
      <div> Campus Connecté de Nemours © 2024 - Simplifiez vos présences </div>
      <div>Développé par Timothée RAKOTOMALALA & Guy Evariste BADE</div>
    </Footer>
  )
}
