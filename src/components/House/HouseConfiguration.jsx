import React, { useEffect, useState } from "react";
import Navbar from "components/Common/Navbar";
import { useLocation, useNavigate, useOutlet, useParams } from "react-router-dom";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import { fetchBreadcrumbNavigationPath } from "services/Breadcrumb";
import { fetchHouseDetails, updateHouseData } from "services/House";
import { toast } from "sonner";

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
  const [connectionKw, setConnectionKw] = useState("");
  const [savingKw, setSavingKw] = useState(false);
  const navigate = useNavigate();
  const outlet = useOutlet()
  const location = useLocation();
  const { houseId } = useParams();

  useEffect(() => {
    setSelectedButton(HOUSE_CONFIG_OPTIONS.find((item) => location.pathname.includes(convertToPath(item))));
  }, [location.pathname])

  useEffect(() => {
    if (!houseId) return;
    fetchHouseDetails(houseId)
      .then((data) => setConnectionKw(data.connection_kw ?? ""))
      .catch((err) => console.error("Error fetching house details:", err));
  }, [houseId]);

  const handleSaveConnectionKw = async () => {
    if (connectionKw === "" || isNaN(+connectionKw) || +connectionKw <= 0) {
      toast.error("Enter a valid connection kW value");
      return;
    }
    setSavingKw(true);
    try {
      await updateHouseData(houseId, { connection_kw: +connectionKw });
      toast.success("Connection kW updated");
    } catch (err) {
      toast.error("Failed to update connection kW");
    } finally {
      setSavingKw(false);
    }
  };

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

  const handleBackButtonClick = async () => {
    try {
      console.log("House ID:", houseId)
      const data = await fetchBreadcrumbNavigationPath(houseId);
      navigate("/", { state: { substationId: data.substation_id, houseId: houseId } });
      return;
    } catch (error) {
      console.error("Error fetching breadcrumb navigation path details:", error.response);
      navigate("/");
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex h-screen font-dinPro pt-20 ">
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
            <div className="bg-[#FFF8E6] w-[80px] h-[38px] px-6 py-2 rounded-[50px] text-3xl text-gridColor1" onClick={handleBackButtonClick}>
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
            <div className="flex items-center gap-2 mr-4 text-[14px] text-black">
              <label className="font-medium whitespace-nowrap">
                Connection / Sanctioned load (kW):
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={connectionKw}
                onChange={(e) => setConnectionKw(e.target.value)}
                placeholder="eg. 10"
                className="w-20 h-8 px-2 border border-gray-400 rounded-md"
              />
              <button
                onClick={handleSaveConnectionKw}
                disabled={savingKw}
                className="h-8 px-3 bg-[#74AA50] text-white rounded-md hover:bg-[#7CB342] disabled:opacity-50"
              >
                {savingKw ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">{renderContent()}</div>
        </div>
      </div>
    </>
  );
};

export default HouseConfiguration;
