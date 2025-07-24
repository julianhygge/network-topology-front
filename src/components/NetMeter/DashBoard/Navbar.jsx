import React from "react";
import { Home, User, Settings } from "lucide-react";

console.log('PUBLIC_URL:', process.env.PUBLIC_URL);

export default function Navbar() {
  return (
    <header
      className="
        fixed top-4 left-4 right-4 h-16 bg-[#0F5D67] text-white p-4 flex items-center justify-between
        rounded-2xl shadow-lg z-2 ">
      <div className="flex items-center gap-4">
        <div className="text-amber-400">
          <img className=" size-10" src={`${process.env.PUBLIC_URL}/images/Logo.png`} alt="logo" />
        </div>
        <button href="/" className="text-white p-2 hover:bg-teal-800">
          <Home size={24}></Home>
        </button>
      </div>
      <h1 className="text-xl md:text-2xl font-medium absolute left-1/2 transform -translate-x-1/2">
        Welcome to Hygge Power Trading Simulator
      </h1>
      <div className="flex items-center gap-3">
        <span className="text-sm md:text-base">sid_02</span>
        <button className="p-1 rounded-full hover:bg-teal-800">
          <User className="h-6 w-6" />
        </button>
        <button className="p-1 rounded-full hover:bg-teal-800">
          <Settings className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
