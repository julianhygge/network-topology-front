import React from 'react'
import { useNavigate } from "react-router-dom";
import Logout from 'components/Auth/Logout';

export default function Navbar() {
  const navigate = useNavigate();
  const HandleClick=()=>{
    navigate('/')
    }
  return (
    <div className='header-container'>
        <header className="flex  justify-between items-center w-full  gap-10 px-9 py-4 text-xl font-medium bg-navColor  ">
        <img
          loading="lazy"
          src={`${process.env.PUBLIC_URL}/images/HyggeLogo.png`} 
          alt="Hygge Logo"
          className="shrink-0 w-[50px] cursor-pointer"
          onClick={HandleClick}
        />
        <h1 className="flex-auto my-auto max-md:max-w-full text-white font-dinPro ">
          Welcome to Hygge Power Trading Simulator
        </h1>
        {/* Group User Info and Logout */}
        <div className="flex items-center gap-4">
          <span className="px-6 py-2 text-navColor bg-[#FFB600] opacity-90 rounded-3xl font-medium">
            Shanti Niketan-1, S00011 
          </span>
          <Logout />
        </div>
      </header>
    </div>
  )
}
