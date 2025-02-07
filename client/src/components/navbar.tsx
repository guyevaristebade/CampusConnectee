import React from 'react'
import { Image } from 'antd'
import Logo from '../assets/campus_connecte.png'
export const NavBar: React.FC = () => {
  return (
    <div className="bg-white shadow-lg flex items-center gap-4 w-full rounded-md transition-all p-2">
      <Image
        src={Logo}
        width={100}
        preview={false}
        // className="rounded-full sm:w-32 md:w-40 lg:w-48"
        style={{ objectFit: 'contain' }}
      />
      <div className="text-lg md:text-2xl font-bold text-gray-800">
        Campus Connecté - Nemours
      </div>
    </div>
  )
}
