import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import Page1 from "../LoadProfile/Page1";
import Page3 from "../LoadProfile/Page3";
import { fetchLoadProfiles } from "../services/LoadProfile";
import PageLoad from "../LoadProfile/PageLoad";

const UserConfiguration = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [loadProfiles, setLoadProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const houseId = searchParams.get("house_id");
  const [showPageLoad, setShowPageLoad] = useState(false);

  const handleButtonClick = async (buttonName) => {
    setSelectedButton(buttonName);
    if (buttonName === "Load Profile") {
      setIsLoading(true);
      try {
        const profiles = await fetchLoadProfiles(houseId);
        setLoadProfiles(profiles);
      } catch (error) {
        console.error("Error fetching load profiles:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUploadSuccess = async () => {
    setIsLoading(true);
    try {
      const profiles = await fetchLoadProfiles(houseId);
      setLoadProfiles(profiles);
      setSelectedButton("Load Profile");
    } catch (error) {
      console.error("Error fetching load profiles after upload:", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleNoClick = () => {

    setShowPageLoad(true);

  };

  const renderContent = () => {
    if (showPageLoad) {
      return <PageLoad />;
    }

    if (selectedButton === "Load Profile") {
      if (isLoading) {
        return (
          <div className="flex items-center justify-center h-full text-xl">
            Loading...
          </div>
        );
      }
      return loadProfiles.items?.length > 0 ? (
        <Page3 profiles={loadProfiles}  />
      ) : (
        <Page1 onUploadSuccess={handleUploadSuccess} onNoClick={handleNoClick} />
      );
    }

    return (
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
          <button className="absolute top mt-2 left-4 grid justify-center cursor-pointer hover:opacity-50">
            <p className="bg-[#FFF8E6] w-[80px] h-[38px] px-6 py-2 rounded-[50px] text-3xl text-gridColor1">
              <img loading="lazy" src="images/Arrow 2.png" alt="Back" />
            </p>
          </button>
        </div>
        <div className="flex-1 overflow-auto">{renderContent()}</div>
      </div>
    </>
  );
};

export default UserConfiguration;
