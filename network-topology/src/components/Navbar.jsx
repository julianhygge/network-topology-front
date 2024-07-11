import React from 'react'

export default function Navbar() {
  return (
    <div>
        <header className="flex items-center gap-10 px-9 py-4 text-xl  font-medium   bg-navColor  max-md:flex-wrap max-md:px-5">
        <img
          loading="lazy"
          src={`${process.env.PUBLIC_URL}/images/HyggeLogo.png`} 
          alt="Hygge Logo"
          className="shrink-0 w-[50px]"
        />
        <h1 className="flex-auto my-auto max-md:max-w-full text-white ">
          Welcome to Hygge Power Trading Simulator
        </h1>
      </header>
    </div>
  )
}
