import React, { useEffect, useState } from "react";
import Navbar from "components/Common/Navbar";
import { useLocation, useNavigate, useOutlet, useParams } from "react-router-dom";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";

const HOUSE_CONFIG_OPTIONS = [
  "Load Profile",
  "Solar Profile",
  "Battery Profile",
  "Flags",
  "EV Profile",
  "Wind Profile",
]

const HouseConfiguration = () => {
  const [selectedButton, setSelectedButton] = useState();
  const navigate = useNavigate();
  const outlet = useOutlet()
  const location = useLocation();
  const { houseId } = useParams();

  useEffect(() => {
    setSelectedButton(HOUSE_CONFIG_OPTIONS.find((item) => location.pathname.includes(convertToPath(item))));
  }, [location.pathname])

  // Ex. converts `Load Profile` to `load-profile`
  const convertToPath = (value) => {
    return value.replaceAll(" ", "-").toLowerCase();
  }

  const handleButtonClick = (buttonName) => {
    const path = convertToPath(buttonName);
    navigate(`${path}`);
  }

  const renderContent = () => {
    return (outlet ||
      <div className="flex items-center justify-center h-full text-xl">
        Select a profile to view details.
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex h-[90vh] 2xl:h-[92vh] font-dinPro">
        <div className="flex flex-col bg-sideBar w-[120px] h-full relative">
          <div className="flex-1 overflow-hidden">
            <div className="h-[calc(100%_-_80px)] mt-20">
              <div className="grid font-normal">
                {HOUSE_CONFIG_OPTIONS.map((item, index) => (
                  <React.Fragment key={index}>
                    <button
                      className={`grid justify-center items-center cursor-pointer text-[16px] ${selectedButton === item
                        ? "bg-[#FDFFFF] rounded-lg text-[#794C03] font-bold"
                        : "text-gridColor1"
                        }`}
                      onClick={() => handleButtonClick(item)}
                      style={{ minHeight: "110px" }}
                    >
                      {item.split(" ").map((word, wordIndex) => (
                        <React.Fragment key={wordIndex}>
                          {word} <br />
                        </React.Fragment>
                      ))}
                    </button>
                    {selectedButton !== item && index < HOUSE_CONFIG_OPTIONS.length - 1 && (
                      <img
                        className="grid justify-center w-20 ml-5"
                        loading="lazy"
                        src={`${process.env.PUBLIC_URL}/images/Line 24.png`}
                        alt="Line"
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <button className="absolute top mt-2 left-4 grid justify-center cursor-pointer hover:opacity-50">
            <div className="bg-[#FFF8E6] w-[80px] h-[38px] px-6 py-2 rounded-[50px] text-3xl text-gridColor1">
              <img
                loading="lazy"
                src={`${process.env.PUBLIC_URL}/images/Arrow 2.png`}
                alt="Back"
              />
            </div>
          </button>
        </div>
        <div className='flex flex-col flex-1'>
          <div className='flex justify-between bg-breadcrumbBackgroundColor max-h-[60px]'>
            <div className="text-[14px] text-black font-light mt-2">
              {houseId && (
                <Breadcrumb nodeId={houseId} onEditNode={() => { }} />
              )}
            </div>
          </div>
          <div className="flex-1 overflow-auto">{renderContent()}</div>
        </div>
      </div>
    </>
  );
};

export default HouseConfiguration;
