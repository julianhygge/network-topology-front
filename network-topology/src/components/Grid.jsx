import React, { useState } from "react";
import Navbar from "./Navbar";

const Grid = () => {
  const [gridNumber, setGridNumber] = useState("");

  const handleInputChange = (event) => {
    setGridNumber(event.target.value);
  };

  const handleSubmit = () => {
    console.log("Number of grids:", gridNumber);
   
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col pb-1 text-white ">
        <main className="flex flex-col items-center mt-10 max-md:mt-10">
          <div className="flex flex-col items-center px-60 py-20 rounded-2xl shadow-2xl bg-cyan-900 bg-opacity-90 max-md:px-5">
            <img
              loading="lazy"
              src="images/HyggeLogo.png"
              alt="Hygge Logo"
              className="w-[60px]"
            />
            <h2 className="mt-12 text-3xl tracking-wide text-center max-md:mt-10">
              Welcome to Hygge Power Trading Simulator
            </h2>
            <p className="mt-24 text-2xl max-md:mt-10">Enter Number of Grids</p>
            <input
              type="number"
              value={gridNumber}
              onChange={handleInputChange}
              className="mt-7 bg-white rounded-2xl h-[55px] w-[300px] p-4 text-black"
              placeholder="Enter grid number"
            />
            <button
              onClick={handleSubmit}
              className="px-20 py-1 mt-11 text-[20px] h-[55px] w-[300px] font-bold text-center text-cyan-900 bg-amber-400 rounded-2xl max-md:px-5 max-md:mt-10"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Grid;
