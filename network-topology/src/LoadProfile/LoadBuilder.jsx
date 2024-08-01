import React from 'react'
import Navbar from '../components/Navbar';
import { minHeight } from '@mui/system';

const LoadBuilder = () => {
    const selectedButton = "Load Profile";
    return (
        <>
        <Navbar />
        <div className="flex h-[100vh] font-dinPro">
            <div className="flex flex-col bg-sideBar w-[120px] h-full relative">
              <div className="flex-1 overflow-hidden">
                <div className="h-[calc(100%_-_80px)] mt-24">
                  <div className="grid font-normal">
                    {[
                      "Load Profile",
                      "Solar Profile",
                      "Battery Profile",
                      "Flags",
                      "EV Profile",
                      "Wind Profile",
                    ].map((item, index) => (
                      <React.Fragment key={index}>
                        <button
                          className={`grid justify-center items-center cursor-pointer text-[15px] ${selectedButton === item
                              ? "bg-[#FDFFFF] rounded-lg text-[#794C03] font-bold"
                              : "text-gridColor1"
                            }`}
                          style={{ minHeight: item === "Load Profile" ? "100px" : "95px" }}
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
              <button className="absolute top mt-2 left-0 right-0 mx-auto grid justify-center cursor-pointer hover:opacity-50">
                <p className="bg-[#FFF8E6] w-[80px] h-[38px] px-6 py-2 rounded-[50px] text-3xl text-gridColor1">
                  <img loading="lazy" src="images/Arrow 2.png" alt="Back" />
                </p>
              </button>
            </div>
        </div>
        </>
      );
};

export default LoadBuilder;