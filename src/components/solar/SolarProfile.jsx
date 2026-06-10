import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  createSolarDetails,
  deleteSolarProfile,
  fetchSolarDetails,
  updateSolarData,
} from "services/SolarProfile";
// import './SolarProfile.css'

const SolarProfile = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      tilt_type: "fixed",
      solar_available: "true",
    },
  });

  const solarAvailable = watch("solar_available", "true") === "true";
  const enableSimulate = watch("simulate_using_different_capacity");
  const installedCapacity = watch("installed_capacity_kw");
  const availableSqft = watch("available_space_sqft");
  const simulationCapacity = watch("capacity_for_simulation_kw");
  const simulationSpace = watch("simulated_available_space_sqft");

  const [slider, setSlider] = useState(true);
  const [percentage, setPercentage] = useState(false);
  const [initial, setInitial] = useState(0);
  const [solarDetails, setSolarDetails] = useState(null);
  const [perValue, setPervalue] = useState(installedCapacity);
  const [sqftValue, setSqftvalue] = useState(availableSqft);
 

  const { houseId } = useParams();
  const navigate = useNavigate();

  const fetchDetail = async (house_id) => {
    try {
      const res = await fetchSolarDetails(house_id);
      const transformedRes = {
        ...res,
        available_space_sqft: res.available_space_sqft
          ? Number(res.available_space_sqft)
          : null,
        capacity_for_simulation_kw: res.capacity_for_simulation_kw
          ? Number(res.capacity_for_simulation_kw)
          : null,
        installed_capacity_kw:
          res.installed_capacity_kw !== null
            ? Number(res.installed_capacity_kw)
            : null,
        simulated_available_space_sqft:
          res.simulated_available_space_sqft !== null
            ? Number(res.simulated_available_space_sqft)
            : null,
        years_since_installation:
          res.years_since_installation !== null
            ? Number(res.years_since_installation)
            : null,
      };

      setSolarDetails(transformedRes);
    } catch (err) {
      console.log("No data");
    }
  };

  const handleResetProfile = async() => {
    try{
      if(houseId){
        if (solarDetails) {
          await deleteSolarProfile(houseId);
        }
        setSolarDetails(null);
        reset({ tilt_type: "fixed", solar_available: "true" });
      }
    }catch(err){
      console.log("Error in deleting solar profile");

    }
  }

  useEffect(() => {
    fetchDetail(houseId);
  }, [houseId]);

  useEffect(() => {
    if (solarDetails) {
      // Transform values if needed (e.g., booleans to strings for radio buttons)
      const transformedDetails = {
        ...solarDetails,
        solar_available: solarDetails.solar_available ? "true" : "false",
        tilt_type: solarDetails.tilt_type || "fixed",
      };
      reset(transformedDetails);
    }
  }, [solarDetails, reset]);

  const createSolarProfile = async (data) => {
    try {
      await createSolarDetails(data);
  
    } catch (err) {
      console.log("Error in creating Solar Detail");
    }
  };

  const updateSolarProfile = async (houseId, data) => {
    try {
      await updateSolarData(houseId, data);
    } catch (err) {
      console.log("Error in updating solar profile");
    }
  };

  const onSubmit = (data) => {
    if (slider) {
      data["capacity_for_simulation_kw"] = simulationCapacity;
      data["simulated_available_space_sqft"] = simulationSpace;
    }
    if (percentage) {
      data["capacity_for_simulation_kw"] = perValue;
      data["simulated_available_space_sqft"] = sqftValue;
    }

    data["solar_available"] = data["solar_available"] === "true";

    for (const key in data) {
      if (data[key] === "") {
        data[key] = null;
      }
    }

    data["house_id"] = houseId;
    console.log("data", data);

    if (solarDetails) {
      if (data["solar_available"] === true) {
        data["available_space_sqft"] = null;
        data["simulated_available_space_sqft"] = null;
      }
      updateSolarProfile(houseId, data);
    } else {
      createSolarProfile(data);
    }
  };

  const onDecrease = () => {
    setInitial((prev) => {
      const newValue = Math.max(prev - 10, 0);
      calculatePercentage(newValue);
      return newValue;
    });
  };

  const onIncrease = () => {
    setInitial((prev) => {
      const newValue = prev + 10;
      calculatePercentage(newValue);
      return newValue;
    });
  };

  const calculatePercentage = (value) => {
    const percentageFactor = value / 100;

    if (solarAvailable) {
      setPervalue(Math.round(installedCapacity * (1 + percentageFactor)));
    } else {
      setSqftvalue(Math.round(availableSqft * (1 + percentageFactor)));
    }
  };

  const handleSlider = (e) => {
    setSlider(true);
    setPercentage(false);
  };
  const handlePercentage = (e) => {
    setSlider(false);
    setPercentage(true);
  };

  return (
    <>
      <div className="bg-[#E7FAFF] h-full">


        <div className="text-center items-center text-[#204A56] text-2xl">
          Select the type of solar profile
        </div>
        {solarDetails ?<div className="flex justify-end mt-[-30px] mr-4">
          <button className="reset-profile cursor-pointer px-2 py-1" onClick={handleResetProfile}>
            Reset Profile
          </button>
        </div>:"" }

        

        <div className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center w-4/5 space-y-4 ml-[80px]">
              <div className="flex items-center justify-center ">
                <input
                  className="w-6 h-6"
                  type="radio"
                  id="solar_available"
                  value="true"
                  {...register("solar_available", { required: true })}
                />
                <label
                  className="text-[#204A56] text-xl ml-2 mt-2"
                  htmlFor="solar_available"
                >
                  Solar Available
                </label>
              </div>

              <div className="flex items-center justify-center ml-[50px] relative ">
                <input
                  className="w-6 h-6 absolute mt-[-8px]"
                  type="radio"
                  id="solar_not_available"
                  value="false"
                  {...register("solar_available", { required: true })}
                />
                <label
                  className="text-[#204A56] text-xl ml-4 absolute mr-[-200px] mt-[-6px]"
                  htmlFor="solar_not_available"
                >
                  Solar Not Available
                </label>
              </div>
            </div>

            <div className="grid grid-flow-col gap-1 grid-cols-2 px-20 mt-4">
              <div className=" bg-white rounded-2xl   border border-solid shadow-sm">
                <h1 className="mt-10 text-center text-xl text-[#204A56]">
                  Enter the details of Solar installment
                </h1>

                {solarAvailable && (
                  <div className="mb-4 flex flex-col px-16 mt-10">
                    <label className="text-xl text-[#204A56] ml-2 ">
                      Enter the installed capacity(kWh)
                    </label>
                    <input
                      className={`border border-[#204A56] rounded-xl w-4/5 h-14 py-2.5 px-3 mt-1 text-2xl ${
                        errors.name && "border-red-500"
                      }`}
                      type="number"
                      placeholder="20"
                      {...register("installed_capacity_kw", {
                        required: solarAvailable,
                        min: {
                          value: 0,
                          message: "Value should be greater than 0",
                        },
                      })}
                    />
                  </div>
                )}
                {errors.installed_capacity_kw && (
                  <span className="text-red-500">
                    {errors.installed_capacity_kw.message}
                  </span>
                )}
                {!solarAvailable && (
                  <div className="flex flex-col px-16 mt-10 ">
                    <label className="block text-xl text-[#204A56] ml-2">
                      Available Space (sqft)
                    </label>
                    <input
                      className={`border border-[#204A56]  rounded-xl w-4/5 h-14 text-2xl py-2.5 px-3 mt-1 ${
                        errors.name && "border-red-500"
                      }`}
                      type="number"
                      placeholder="20"
                      {...register("available_space_sqft", {
                        required: !solarAvailable,
                        min: {
                          value: 0,
                          message: "Value should be greater than 0",
                        },
                      })}
                    />
                  </div>
                )}

                <h1 className=" px-16 text-xl text-[#204A56] mt-10 mb-2 ">
                  Select the type of tilt
                </h1>
                <div className="flex px-16">
                  <div className="flex">
                    <input
                      className="ml-8  w-6 h-6 "
                      type="radio"
                      value="fixed"
                      {...register("tilt_type", { required: true })}
                    />
                    <label className="text-xl ml-1 text-[#204A56]">
                      Fixed Tilt
                    </label>
                  </div>

                  <div className="flex">
                    <input
                      className="ml-32 w-6 h-6 "
                      type="radio"
                      value="tracking"
                      {...register("tilt_type", { required: true })}
                    />
                    <label className="text-xl ml-1 text-[#204A56]  ">
                      Sun Tracking
                    </label>
                  </div>
                </div>

                {solarAvailable && (
                  <div className="mb-4 flex flex-col px-16 mt-10">
                    <label className="block text-xl text-[#204A56] ml-2">
                      Installed for how many years?
                    </label>
                    <input
                      className={`border border-[#204A56] rounded-xl w-4/5 h-14 text-2xl py-2.5 px-3 mt-1 ${
                        errors.name && "border-red-500"
                      }`}
                      type="number"
                      placeholder="40"
                      {...register("years_since_installation", {
                        required: solarAvailable,
                        min: {
                          value: 0,
                          message: "Value should be greater than 0",
                        },
                      })}
                    />
                  </div>
                )}
                <div className="flex px-24 mt-4 mb-2">
                  <button
                    type="button"
                    onClick={handleResetProfile}
                    className="flex justify-center items-center mr-6 px-14 py-4 bg-[#FF763C] shadow-sm rounded-[33px] max-md:px-5"
                  >
                    Reset
                  </button>
                  <button
                    disabled={!isValid}
                    onClick={handleSubmit(onSubmit)}
                    type="submit"
                    className="flex justify-center items-center px-14 py-4 bg-[#74AA50] shadow-sm rounded-[33px] max-md:px-5"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className=" bg-white rounded-2xl border border-solid shadow-sm ">
                <div className="flex  justify-center py-6">
                  <input
                    className="w-6 h-6"
                    type="checkbox"
                    {...register("simulate_using_different_capacity")}
                  />
                  <label className="text-xl text-[#204A56] ml-6">
                    Enable Simulated Solar capacity
                  </label>
                </div>

                <div
                  onClick={handleSlider}
                  className={`p-4 m-auto bg-[#E7FAFF] border border-[#204A56] border-solid rounded-xl  w-4/5  ${
                    enableSimulate && slider ? "" : "opacity-50"
                  }`}
                >
                  {solarAvailable && (
                    <p className="text-xl">
                      Slide to provide <br />
                      Simulated capacity(kWh)
                    </p>
                  )}
                  {!solarAvailable && (
                    <p className="text-xl">
                      Slide to provide Simulated <br /> Available space (Sqft)
                    </p>
                  )}
                  <div className="flex">
                    {solarAvailable && (
                      <input
                        className="range-input mt-8 w-[400px] h-2 rounded-lg  cursor-pointer"
                        type="range"
                        min="1"
                        max="100"
                        {...register("capacity_for_simulation_kw")}
                      />
                    )}
                    {!solarAvailable && (
                      <input
                        className="range-input mt-8 w-[400px] h-2 rounded-lg  cursor-pointer"
                        type="range"
                        min="1"
                        max="5000"
                        {...register("simulated_available_space_sqft")}
                      />
                    )}
                    <div className="flex ml-16 mt-4">
                      {solarAvailable && (
                        <div className="border border-solid border-[#204A56] text-[#204A56] rounded-xl w-20 text-center p-1 text-xl">
                          {simulationCapacity}
                        </div>
                      )}

                      {!solarAvailable && (
                        <div className="border border-solid border-[#204A56] text-[#204A56] rounded-xl w-20 text-center p-1 text-xl">
                          {simulationSpace}
                        </div>
                      )}
                      {solarAvailable && (
                        <span className="text-xl text-[#204A56] mt-2 ml-2">
                          kWh
                        </span>
                      )}
                      {!solarAvailable && (
                        <span className="text-[#204A56] text-center items-center mt-2 ml-2 text-xl">
                          Sqft
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="py-4 text-center">-OR-</p>

                <div
                  onClick={handlePercentage}
                  className={` m-auto p-4 w-4/5  border border-solid border-[#204A56] rounded-xl bg-[#E7FAFF]  ${
                    enableSimulate && percentage ? "" : "opacity-50"
                  }`}
                >
                  {solarAvailable && (
                    <p className="mb-8 text-xl text-[#204A56]">
                      Increase/decrease Simulated <br /> capacity by percentage{" "}
                    </p>
                  )}
                  {!solarAvailable && (
                    <p className="text-xl mb-8">
                      Increase/decrease <br /> Available space by percentage{" "}
                    </p>
                  )}
                  <div className="flex justify-between">
                    <div className="flex mr-20">
                      <button
                        type="button"
                        onClick={onDecrease}
                        className="border border-solid border-[#204A56] rounded-xl w-10 text-center p-1"
                        disabled={initial === 0}
                      >
                        -
                      </button>

                      <div className="border border-solid border-[#204A56] text-xl text-[#204A56] rounded-xl w-20 text-center p-1 ml-2 mr-2">
                        {initial}%
                      </div>

                      <button
                        type="button"
                        onClick={onIncrease}
                        className="border border-solid border-[#204A56] rounded-xl w-10 text-center p-1"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex ">
                      {solarAvailable && (
                        <div className="border border-solid border-[#204A56] text-xl text-[#204A56] rounded-xl w-20 text-center p-1">
                          {perValue || installedCapacity}
                        </div>
                      )}
                      {!solarAvailable && (
                        <div className="border border-solid border-[#204A56] text-xl text-[#204A56] rounded-xl w-20 text-center p-1">
                          {sqftValue || availableSqft}
                        </div>
                      )}

                      {solarAvailable && (
                        <span className="text-[#204A56] mt-2 ml-2 text-[16px]">
                          kWh
                        </span>
                      )}
                      {!solarAvailable && (
                        <span className="text-[#204A56] text-center items-center mt-2 ml-2 text-xl">
                          Sqft
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <button className="flex justify-center items-center px-14 py-4 mt-2 bg-[#74AA50] shadow-sm rounded-[33px] max-md:px-5">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SolarProfile;
