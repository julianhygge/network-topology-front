import React from 'react'
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const HandleClick=()=>{
    navigate('/')
    }
  return (
    <div>
        <header className="flex w-full items-center gap-10 px-9 py-4 text-xl font-medium bg-navColor  ">
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
      </header>
    </div>
  )
}
