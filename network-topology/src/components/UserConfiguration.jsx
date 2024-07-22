import React, { useState } from "react";
import Navbar from "./Navbar";

const UserConfiguration = () => {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-[90vh] 2xl:h-[92vh]">
        <div className="flex flex-col bg-sideBar w-[120px] h-full relative">
          <div className="flex-1 overflow-hidden">
            <div className="h-[calc(100%_-_80px)]  mt-12">
              <div className="grid ">
                {["Load Profile", "Solar Profile", "Battery Profile", "Flags", "EV Profile", "Wind Profile"].map((item, index) => (
                  <React.Fragment key={index}>
                    <button
                      className={`grid justify-center cursor-pointer text-xl py-7 px-4 ${
                        selectedButton === item ? "bg-[#FDFFFF] rounded-lg text-3xl  text-[#794C03]" : "text-gridColor1"
                      }`}
                      onClick={() => handleButtonClick(item)}
                      style={{ minHeight: '110px' }}
                    >
                      {item.split(" ").map((word, wordIndex) => (
                        <React.Fragment key={wordIndex}>
                          {word} <br />
                        </React.Fragment>
                      ))}
                    </button>
                    {selectedButton !== item && index < 5 && (
                      <img
                        className="grid justify-center w-20 ml-5"
                        loading="lazy"
                        src="images/Line 24.png"
                        alt="Line"
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <button className="absolute top mt-2 left-4 grid justify-center cursor-pointer hover: ">
            <p className="bg-[#FFF8E6] w-[80px] h-[38px] px-6 py-2 rounded-[50px] text-3xl text-gridColor1">
              <img loading="lazy" src="images/Arrow 2.png" alt="Back"></img>
            </p>
          </button>
        </div>
      </div>
    </>
  );
};

export default UserConfiguration;
