import React, { useState } from "react";
import './GenerationPage.css';
import Navbar from "components/Common/Navbar";

const GenerationPage1 = () => {
  const selectedButton = "Load Profile";
  const [formValues, setFormValues] = useState({
    avgKWh: "",
    daily: false,
    monthly: false,
    avgMonthlyBill: "",
    maxDemand: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { avgKWh, daily, monthly, avgMonthlyBill, maxDemand } = formValues;
    if (avgKWh && (daily || monthly) && avgMonthlyBill && maxDemand) {
      console.log(formValues);
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <>
      <div className="flex h-[90vh] 2xl:h-[92vh] font-dinPro">
        <div className="flex-1 overflow-auto"><div className="flex flex-col items-center justify-center h-full bg-[#E7FAFF]">
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
            <div className="text-[18px] max-md:mt-10">
              Please enter the below details and Save
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
                />
              </label>
            </div>
            <div className="flex gap-6 justify-between mt-10 max-w-full text-xl tracking-normal text-white whitespace-nowrap max-md:mt-10">
              <button
                type="button"
                className="flex justify-center items-center px-14 py-3 bg-[#FFB600] shadow-sm text-navColor rounded-[33px] max-md:px-5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex justify-center items-center px-16 py-3 shadow-sm bg-[#74AA50] rounded-[33px] max-md:px-5"
              >
                Save
              </button>
            </div>
          </form>
        </div></div>
      </div>
    </>

  );
};
export default GenerationPage1;
