import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { createSolarDetails, fetchSolarDetails } from "services/SolarProfile";
// import './SolarProfile.css'

const SolarProfile = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm();

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
      setSolarDetails(res);
    } catch (err) {
      console.log("No data");
    }
  };

  useEffect(() => {
    fetchDetail(houseId);
  }, [houseId]);

  const createSolarProfile = async (data) => {
    try {
      const res = await createSolarDetails(data);
    } catch (err) {
      console.log("Error in creating Solar Detail");
    }
  };

  const onSubmit = (data) => {
    if (slider) {
      data["capacity_for_simulation_kw"] = simulationCapacity;
    }
    if (percentage) {
      data["capacity_for_simulation_kw"] = perValue;
    }

    if (slider) {
      data["simulated_available_space_sqft"] = simulationSpace;
    }
    if (percentage) {
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

    createSolarProfile(data);
    navigate("/");
  };

  const onDecrease = () => {
    setInitial(initial - 10);
    calculatePercentage();
  };
  const onIncrease = () => {
    setInitial(initial + 10);
    calculatePercentage();
  };

  const calculatePercentage = () => {
    let per = Math.round(installedCapacity * (1 + initial / 100));
    let sqft = Math.round(availableSqft * (1 + initial / 100));
    setPervalue(per);
    setSqftvalue(sqft);
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
      {!solarDetails ? (
        <div className="bg-[#E7FAFF] h-full">
          <div className="text-center items-center text-[#204A56] text-2xl">
            Select the type of solar profile
          </div>

          <div className="">
            <form onSubmit={handleSubmit(onSubmit)}>

              <div className="flex justify-center w-4/5 space-y-4 ml-[80px]">
                <div className="flex items-center justify-center ">
                  <input
                    className="w-6 h-6"
                    type="radio"
                    id="solar_available"
                    value={true}
                    defaultChecked
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
                    value={false}
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
                        defaultChecked
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
                      onClick={reset}
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
                      enableSimulate && slider
                        ? ""
                        : "opacity-50"
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
                      enableSimulate && percentage
                        ? ""
                        : "opacity-50"
                    }`}
                  >
                    {solarAvailable && (
                      <p className="mb-8 text-xl text-[#204A56]">
                        Increase/decrease Simulated <br /> capacity by
                        percentage{" "}
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
      ) : (
        <div>
          Edit Solar with {solarDetails.house_id}
          {Object.entries(solarDetails).map(([key, value]) => (
            <p key={key}>
              {key}: {value}
            </p>
          ))}
        </div>
      )}
    </>
  );
};

export default SolarProfile;
