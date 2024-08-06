import React, { useState, useEffect } from "react";
import "./GenerationPage.css";
import Navbar from "components/Common/Navbar";
import {
  saveGenerationProfile,
  fetchGenerationEngineProfile,
  deleteGenerationProfile,
} from "../../services/LoadProfile";
import { useParams, useNavigate } from "react-router-dom";
import GenerationDeletePopup from "./GenerationDeletePopup";

const GenerationPage1 = () => {
  const selectedButton = "Load Profile";
  const { houseId } = useParams();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    avgKWh: "",
    daily: false,
    monthly: false,
    avgMonthlyBill: "",
    maxDemand: "",
  });
  const [response, setResponse] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [profileId, setProfileId] = useState(null); // To store the profile_id

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchGenerationEngineProfile(houseId);
        if (data && data.average_kwh !== undefined) {
          setFormValues({
            avgKWh: data.average_kwh,
            daily: data.type === "Daily",
            monthly: data.type === "Monthly",
            avgMonthlyBill: data.average_monthly_bill,
            maxDemand: data.max_demand_kw,
          });
          setIsSaved(true); // Disable form inputs since data is loaded
          setProfileId(data.profile_id);
        } else {
          setIsSaved(false); // Enable form inputs since no data is loaded
        }
      } catch (error) {
        console.error("Error fetching generation engine profile:", error);
        setIsSaved(false); // Enable form inputs on error
      }
    };
    loadProfile();
  }, [houseId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormValues({
        ...formValues,
        daily: name === "daily" ? checked : false,
        monthly: name === "monthly" ? checked : false,
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { avgKWh, daily, monthly, avgMonthlyBill, maxDemand } = formValues;

    if (avgKWh && (daily || monthly) && avgMonthlyBill && maxDemand) {
      const type = daily ? "Daily" : "Monthly";
      const payload = {
        type,
        average_kwh: parseFloat(avgKWh),
        average_monthly_bill: parseFloat(avgMonthlyBill),
        max_demand_kw: parseFloat(maxDemand),
      };
      console.log(houseId);

      try {
        const data = await saveGenerationProfile(houseId, payload);
        setResponse(data);
        setIsSaved(true); // Disable form inputs after saving
        setFormValues({
          avgKWh: data.average_kwh,
          daily: data.type === "Daily",
          monthly: data.type === "Monthly",
          avgMonthlyBill: data.average_monthly_bill,
          maxDemand: data.max_demand_kw,
        });
        setProfileId(data.profile_id); // Set the profile_id after saving
      } catch (error) {
        console.error("Failed to save profile:", error);
      }
    } else {
      alert("Please fill all fields");
    }
  };
  const handleDelete = async () => {
    try {
      if (profileId) {
        console.log("Deleting profile with ID:", profileId);
        await deleteGenerationProfile(profileId);
        console.log("Profile deleted successfully");
        navigate(`/config/${houseId}`);
      } else {
        console.error("Profile ID is not available for deletion.");
      }
    } catch (error) {
      console.error("Failed to delete profile:", error);
    } finally {
      setShowDeletePopup(false); // Close the popup
    }
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
                      className={`grid justify-center items-center cursor-pointer text-[16px] ${
                        selectedButton === item
                          ? "bg-[#FDFFFF] rounded-lg text-[#794C03] font-bold"
                          : "text-gridColor1 cursor-not-allowed"
                      }`}
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
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col items-center justify-center h-full bg-[#E7FAFF]">
            <div>
              <span className="flex text-center text-navColor items-center text-[20px] font-medium">
                Load profile generation is in process,
                <br />
                Please continue to do the configuration from below.
              </span>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center items-center w-[50vw] pt-8 pb-10 font-medium text-center text-navColor bg-white rounded-2xl max-w-[860px] shadow-[0px_5px_10px_rgba(169,218,198,1)] max-md:px-5"
            >
              <div className="relative text-[18px] max-md:mt-10">
                {isSaved
                  ? "Please edit the below details and Save"
                  : "Please enter the below details and Save"}
                {isSaved && (
                  <button
                    type="button"
                    className="absolute right-[-12vw]"
                    onClick={() => setShowDeletePopup(true)}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/DeleteButton.png`}
                      className="w-[24px] h-[28px] cursor-pointer"
                      alt="Delete Icon"
                    />
                  </button>
                )}
              </div>

              <div className="flex flex-col items-center gap-5 mt-8 w-full max-w-lg">
                <label className="flex flex-col items-start">
                  Enter the Avg kWh consumed
                  <div className="flex gap-20 mt-2 mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="daily"
                        checked={formValues.daily}
                        onChange={handleInputChange}
                        className="mr-2 custom-checkbox"
                        disabled={isSaved}
                      />
                      Daily
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="monthly"
                        checked={formValues.monthly}
                        onChange={handleInputChange}
                        className="mr-2 custom-checkbox"
                        disabled={isSaved}
                      />
                      Monthly
                    </label>
                  </div>
                  <input
                    type="number"
                    name="avgKWh"
                    value={formValues.avgKWh}
                    onChange={handleInputChange}
                    className="w-[420px] h-[55px] p-2 mt-2 border border-navColor rounded-xl custom-input"
                    disabled={isSaved}
                  />
                </label>
                <label className="flex flex-col items-start">
                  Enter the Average Monthly Bill
                  <input
                    type="number"
                    name="avgMonthlyBill"
                    value={formValues.avgMonthlyBill}
                    onChange={handleInputChange}
                    className="w-[420px] h-[55px] p-2 mt-2 border border-navColor rounded-xl custom-input"
                    disabled={isSaved}
                  />
                </label>
                <label className="flex flex-col items-start">
                  Enter the Max demand (kW)
                  <input
                    type="number"
                    name="maxDemand"
                    value={formValues.maxDemand}
                    onChange={handleInputChange}
                    className="w-[420px] h-[55px] p-2 mt-2 border border-navColor rounded-xl custom-input"
                    disabled={isSaved}
                  />
                </label>
              </div>
              <div className="flex gap-6 justify-between mt-10 max-w-full text-xl tracking-normal text-white whitespace-nowrap max-md:mt-10">
                <button
                  type="button"
                  className={`flex justify-center items-center px-14 py-3 shadow-sm rounded-[33px] max-md:px-5  bg-[#FFB600] text-[#563E04] ${
                    isSaved
                      ? " opacity-50 cursor-not-allowed"
                      : "bg-[#FFB600] text-[#563E04]"
                  }`}
                  disabled={isSaved}
                  onClick={() => window.location.reload()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex justify-center items-center px-16 py-3 shadow-sm rounded-[33px] max-md:px-5  bg-[#74AA50] ${
                    isSaved ? " opacity-50 cursor-not-allowed" : "bg-[#74AA50]"
                  }`}
                  disabled={isSaved}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showDeletePopup && (
        <GenerationDeletePopup
          onConfirm={handleDelete}
          onCancel={() => setShowDeletePopup(false)}
        />
      )}
    </>
  );
};

export default GenerationPage1;
