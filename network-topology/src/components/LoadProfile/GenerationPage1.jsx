import React, { useState, useEffect } from "react";
import {
  saveGenerationProfile,
  fetchGenerationEngineProfile,
  deleteGenerationProfile,
} from "../../services/LoadProfile";
import { useParams, useNavigate } from "react-router-dom";
import GenerationDeletePopup from "./GenerationDeletePopup";

const GenerationPage1 = () => {
  const { houseId } = useParams();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    avgKWh: "",
    daily: false,
    monthly: false,
    avgMonthlyBill: "",
    maxDemand: "",
  });
  const [errors, setErrors] = useState({
    avgKWh: "",
    avgMonthlyBill: "",
    maxDemand: "",
  });
  const [response, setResponse] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [profileId, setProfileId] = useState(null); // To store the profile_id
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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
      } finally {
        setIsDataLoaded(true);
      }
    };
    loadProfile();
  }, [houseId]);

  const validateInputs = () => {
    const newErrors = {};
    const numberPattern = /^[0-9]*\.?[0-9]+$/;

    if (!numberPattern.test(formValues.avgKWh)) {
      newErrors.avgKWh = "Avg kWh must be a valid number.";
    }
    if (!numberPattern.test(formValues.avgMonthlyBill)) {
      newErrors.avgMonthlyBill = "Average Monthly Bill must be a valid number.";
    }
    if (!numberPattern.test(formValues.maxDemand)) {
      newErrors.maxDemand = "Max Demand must be a valid number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    if (validateInputs()) {
      const { avgKWh, daily, monthly, avgMonthlyBill, maxDemand } = formValues;

      const type = daily ? "Daily" : "Monthly";
      const payload = {
        type,
        average_kwh: parseFloat(avgKWh),
        average_monthly_bill: parseFloat(avgMonthlyBill),
        max_demand_kw: parseFloat(maxDemand),
      };

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

  const handleBeforeUnload = (e) => {
    if (!isSaved) {
      e.preventDefault();
      e.returnValue = ""; // Chrome requires returnValue to be set
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSaved]);

  if (!isDataLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div className="flex h-[90vh] 2xl:h-[92vh] font-dinPro">
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
  
            <div className="flex flex-col items-center gap-5 mt-8 w-full max-w-lg ">
              <label className="flex flex-col items-start text-navColor font-[500] text-[15px]">
                Enter the Avg kWh consumed
                <div className="flex gap-20 mt-2 mb-2">
                  <label className="flex items-center text-navColor font-[500] text-[15px]">
                    <input
                      type="checkbox"
                      name="daily"
                      checked={formValues.daily}
                      onChange={handleInputChange}
                      className="mr-2 appearance-none w-5 h-5 border border-[#204A56] rounded-full relative cursor-pointer checked:bg-white checked:after:content-[''] checked:after:w-3 checked:after:h-3 checked:after:bg-[#DEA309] checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                      disabled={isSaved}
                    />
                    Daily
                  </label>
                  <label className="flex items-center text-navColor font-[500] text-[15px]">
                    <input
                      type="checkbox"
                      name="monthly"
                      checked={formValues.monthly}
                      onChange={handleInputChange}
                      className="mr-2 appearance-none w-5 h-5 border border-[#204A56] rounded-full relative cursor-pointer checked:bg-white checked:after:content-[''] checked:after:w-3 checked:after:h-3 checked:after:bg-[#DEA309] checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                      disabled={isSaved}
                    />
                    Monthly
                  </label>
                </div>
                <input
                  type="text"
                  name="avgKWh"
                  value={formValues.avgKWh}
                  onChange={handleInputChange}
                  className="w-[420px] h-[55px] p-2 mt-2 border border-navColor rounded-xl focus:border-[#FCB712] focus:shadow-[0_0_5px_5px_rgba(252,183,18,0.5)] focus:outline-none"
                  disabled={isSaved}
                />
                {errors.avgKWh && <div className="text-red-500 mt-1">{errors.avgKWh}</div>}
              </label>
              <label className="flex flex-col items-start text-navColor font-[500] text-[15px]">
                Enter the Average Monthly Bill
                <input
                  type="text"
                  name="avgMonthlyBill"
                  value={formValues.avgMonthlyBill}
                  onChange={handleInputChange}
                  className="w-[420px] h-[55px] p-2 mt-2 border border-navColor rounded-xl focus:border-[#FCB712] focus:shadow-[0_0_5px_5px_rgba(252,183,18,0.5)] focus:outline-none"
                  disabled={isSaved}
                />
                {errors.avgMonthlyBill && <div className="text-red-500 mt-1">{errors.avgMonthlyBill}</div>}
              </label>
              <label className="flex flex-col items-start text-navColor font-[500] text-[15px]">
                Enter the Max demand (kW)
                <input
                  type="text"
                  name="maxDemand"
                  value={formValues.maxDemand}
                  onChange={handleInputChange}
                  className="w-[420px] h-[55px] p-2 mt-2 border border-navColor rounded-xl focus:border-[#FCB712] focus:shadow-[0_0_5px_5px_rgba(252,183,18,0.5)] focus:outline-none"
                  disabled={isSaved}
                />
                {errors.maxDemand && <div className="text-red-500 mt-1">{errors.maxDemand}</div>}
              </label>
            </div>
            <div className="flex gap-6 justify-between mt-10 max-w-full text-xl tracking-normal text-white whitespace-nowrap max-md:mt-10">
              <button
                type="button"
                className={`flex justify-center items-center px-14 py-3 shadow-sm rounded-[33px] max-md:px-5  ${isSaved ? "opacity-50 cursor-not-allowed bg-[#FFB600] text-[#563E04]" : "bg-[#FFB600] text-[#563E04]"}`}
                disabled={isSaved}
                onClick={() => window.location.reload()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex justify-center items-center px-16 py-3 shadow-sm rounded-[33px] max-md:px-5  ${isSaved ? "opacity-50 cursor-not-allowed bg-[#74AA50]" : "bg-[#74AA50]"}`}
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
