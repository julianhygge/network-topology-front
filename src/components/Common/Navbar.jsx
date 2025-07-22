// import React from 'react'
// import { useNavigate } from "react-router-dom";
// import Logout from 'components/Auth/Logout';

// export default function Navbar() {
// const navigate = useNavigate();
// const HandleClick=()=>{
//   navigate('/')
//   }
//   return (
//     <div className='header-container'>
//         <header className="flex  justify-between items-center w-full  gap-10 px-9 py-4 text-xl font-medium bg-navColor  ">
//         <img
//           loading="lazy"
//           src={`${process.env.PUBLIC_URL}/images/HyggeLogo.png`}
//           alt="Hygge Logo"
//           className="shrink-0 w-[50px] cursor-pointer"
//           onClick={HandleClick}
//         />
//         <h1 className="flex-auto my-auto max-md:max-w-full text-white font-dinPro ">
//           Welcome to Hygge Power Trading Simulator
//         </h1>
//         {/* Group User Info and Logout */}
//         <div className="flex items-center gap-4">
//           <span className="px-6 py-2 text-navColor bg-[#FFB600] opacity-90 rounded-3xl font-medium">
//             Shanti Niketan-1, S00011
//           </span>
//           <Logout />
//         </div>
//       </header>
//     </div>
//   )
// }
// src/components/Common/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Menu, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clear, getUser } from "services/LocalStorage";

export default function Navbar() {
  const navigate = useNavigate();
  const userName = getUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    clear();
    navigate("/login");
  };

  // close menu when clicking outside
  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header
      className="fixed top-4 left-4 right-4 h-16 
        bg-[#0F5D67] text-white 
        px-6 flex items-center justify-between 
        rounded-2xl shadow-lg z-20"
    >
      <div className="flex items-center gap-4 relative" ref={menuRef}>
        <button onClick={() => navigate("/")}>
          <img
            src="/images/Logo.png"
            alt="Hygge logo"
            className="h-10 w-auto"
          />
        </button>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="p-2 hover:bg-teal-800 rounded"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div
            className="
              absolute top-full mt-2 left-14
              bg-gradient-to-br from-[#6CCECD] to-[#356770]
              rounded-xl shadow-lg overflow-hidden z-30
              w-45
            "
          >
            {/* Home */}
            <div className="px-3 py-2">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/");
                }}
                className="
                  w-full text-left
                  py-2 px-2
                  text-white
                  font-bold
                  rounded-md
                  hover:bg-gradient-to-r from-[#6F8284] to-[#1A1E1E] 
                  transition-colors duration-150
                "
              >
                Home
              </button>
            </div>

            {/* Divider */}
            <div className="px-4 ">
              <div className="border-t border-navColor" />
            </div>

            {/* Progress bar */}
            <div className="px-3 py-1">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/progress");
                }}
                className="
                  w-full text-left
                  py-2 px-2
                  text-white
                  font-bold
                  rounded-md
                  hover:bg-gradient-to-r from-[#6F8284] to-[#1A1E1E] 
                  transition-colors duration-150
                "
              >
                Progress bar
              </button>
            </div>

            {/* Divider */}
            <div className="px-4 ">
              <div className="border-t border-navColor" />
            </div>

            {/* Allocation Engine */}
            <div className="px-3 py-2">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/allocation");
                }}
                className="
                  w-full text-left
                  py-2 px-2
                  text-white
                  font-bold
                  rounded-md
                  hover:bg-gradient-to-r from-[#6F8284] to-[#1A1E1E] 
                  transition-colors duration-150
                "
              >
                Allocation Engine
              </button>
            </div>
          </div>
        )}

        <h1 className="text-xl md:text-2xl font-medium">Network Topology</h1>
      </div>

      {/* Right: user + settings */}
      <div className="flex items-center gap-3">
        <span className="text-sm md:text-base font-medium">{userName}</span>
        <button
          className="p-2 hover:bg-teal-800 rounded-full"
          aria-label="Profile"
        >
          <User size={20} />
        </button>
        <button
          className="p-2 hover:bg-teal-800 rounded-full"
          aria-label="Logout"
          onClick={handleLogout}
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}
