import React from 'react'
import { Layout }  from 'antd'
const { Footer } = Layout
export const Foot = () => {
    return (
        <Footer className='text-center text-white px-5 py-10 bg-[#000091]'>
            <div> Campus Connecté de Nemours © 2024 - Simplifiez vos présences </div>
            <div>Développé par Timothée RAKOTOMALA & Guy Evraiste BADE</div>
        </Footer>
    )
}
