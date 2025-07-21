import React, { useEffect } from "react";
import { updateTransformerData } from "services/Transformer";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import "components/Breadcrumb/Breadcrumb.css";
import { useForm, FormProvider } from "react-hook-form";

const MAX_TRANSFORMER_VALUE = 999.99;
const MAX_TRANSFORMER_YEARS = 999;
const MAX_TRANSFORMER_NAME_LENGTH = 50;

const TransformerForm = ({ transformer, onSave, onClose }) => {

  useEffect(() => {
    console.log("transformer: ", transformer);
  }, [transformer]);

  const methods = useForm({
    defaultValues: {
      name: transformer.name || "",
      max_capacity_kw: transformer.max_capacity_kw || "0.00",
      years_of_service: transformer.years_of_service || "0",
      forward_efficiency: transformer.forward_efficiency || "0.00",
      allow_export: transformer.allow_export || false,
      digital_twin_model: transformer.digital_twin_model || false,
      backward_efficiency: transformer.backward_efficiency || "0.00",
      primary_ampacity: transformer.primary_ampacity || "0.00",
      secondary_ampacity: transformer.secondary_ampacity || "0.00",
    }
  });

  const { register, handleSubmit, watch,reset, formState: { errors } } = methods;

  const onSubmit = async (data) => {
    console.log("transformer data: ", data);
    try {
      // Otherwise, causes an error if backward_efficiency is not set to a number
      if (!data.allow_export && !data.backward_efficiency) {
        data.backward_efficiency = 0;
      }
      const updatedTransformer = await updateTransformerData(transformer.id, data);
      onSave(updatedTransformer);
    } catch (error) {
      console.error("Error updating transformer data:", error);
    }
  };
  const handleReset = () => {
    reset();
  };

  const handleClose = () => {
    onClose();
  };

  const validDecimalPattern = { value: /^\d*\.?\d{1,2}$/, message: "Invalid number" };

  const allowExport = watch("allow_export");
  const name = watch("name");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#F6FFFF]  bg-opacity-20 z-50">
      <div className="relative bg-gradient-to-br from-[#F6FFFF] from-[99.11%] to-[#8D9090] to-[100%] rounded-2xl pt-[100px] px-28 pb-8 w-full max-w-[1000px] border border-solid border-[#9A9A9A] shadow-sm max-md:px-5 mt-36 mb-16 ml-28 z-10">
        <div className="absolute w-11/12 top-4 left-0 right-0 z-1 text-[14px] text-black font-light">
          {transformer && transformer.new !== true && (
            <Breadcrumb nodeId={transformer.id} onEditNode={() => { }} />
          )}
        </div>
        {/* <div
          className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-15 right-4 top-4"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/HyggeLogo.png)`,
            backgroundSize: "210px 210px",
            zIndex: -1,
          }}
        ></div> */}
        <button
          className="cursor-pointer absolute top-1 right-5 p-2 text-4xl font-thin"
          onClick={handleClose}
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold text-center mb-11  text-customGrey  text-[22px]">
          Enter / Edit the Transformer Configurations
        </h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col mb-4 pr-4 border-r border-[#916600]">
                <div className="mb-4 flex flex-col items-start ml-7">
                  <label className="block text-customGrey-700 text-[15px] ml-2 font-[500]  text-black ">
                    Name of Transformer
                  </label>
                  <input
                    className={`border border-[#916600]  bg-gradient-to-br from-[#F6FFFF] from-[99.11%] to-[#8D9090] rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${errors.name && "border-red-500"}`}
                    type="text"
                    name="name"
                    placeholder="Enter name of transformer"
                    {...register("name", {
                      required: "Name is required",
                      pattern: { value: /^[a-zA-Z0-9]*$/, message: "Name must not contain special characters." },
                      maxLength: { value: MAX_TRANSFORMER_NAME_LENGTH, message: `Name should not exceed ${MAX_TRANSFORMER_NAME_LENGTH} characters` },
                    })}
                  />
                  {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                </div>
                <div className="mb-4 flex flex-col items-start ml-7">
                  <label className="block text-black text-[15px] ml-2 font-[500]">
                    Max Capacity ( kW )
                  </label>
                  <input
                    className={`border border-[#916600]  bg-gradient-to-br from-[#F6FFFF] from-[99.11%] to-[#8D9090]  rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${errors.max_capacity_kw && "border-red-500"}`}
                    type="text"
                    name="max_capacity_kw"
                    placeholder="0.00"
                    {...register("max_capacity_kw", {
                      required: "Max capacity is required",
                      pattern: validDecimalPattern,
                      max: { value: MAX_TRANSFORMER_VALUE, message: `Max capacity should be less than or equal to ${MAX_TRANSFORMER_VALUE}` },
                    })}
                  />
                  {errors.max_capacity_kw && <span className="text-red-500">{errors.max_capacity_kw.message}</span>}
                </div>
                <div className="mb-4 flex flex-col items-start ml-7">
                  <label className="block text-black text-[15px] ml-2 font-[500]">
                    Years of Service
                  </label>
                  <input
                    className={`border border-[#916600]  bg-gradient-to-br from-[#F6FFFF] from-[99.11%] to-[#8D9090]  rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${errors.years_of_service && "border-red-500"}`}
                    type="text"
                    name="years_of_service"
                    placeholder="0"
                    {...register("years_of_service", {
                      required: "Years of service is required",
                      pattern: { value: /^\d+$/, message: "Invalid number" },
                      max: { value: MAX_TRANSFORMER_YEARS, message: `Years of service should be less than or equal to ${MAX_TRANSFORMER_YEARS}` },
                    })}
                  />
                  {errors.years_of_service && <span className="text-red-500">{errors.years_of_service.message}</span>}
                </div>
                <div className="mb-4 flex flex-col items-start ml-7">
                  <label className="block text-black text-[15px] ml-2 font-[500]">
                    Forward Efficiency ( % )
                  </label>
                  <input
                    className={`border border-[#916600]  bg-gradient-to-br from-[#F6FFFF] from-[99.11%] to-[#8D9090]  rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${errors.forward_efficiency && "border-red-500"}`}
                    type="text"
                    name="forward_efficiency"
                    placeholder="0.00"
                    {...register("forward_efficiency", {
                      required: "Forward efficiency is required",
                      pattern: validDecimalPattern,
                      max: { value: 100, message: "Forward efficiency should be less than or equal to 100" },
                    })}
                  />
                  {errors.forward_efficiency && <span className="text-red-500">{errors.forward_efficiency.message}</span>}
                </div>
              </div>
              <div className="flex flex-col mb-4 pl-4">
                  
                {/* stacked toggles */}
                <div className="space-y-4 ml-4 mb-4">
                  {/** Allow Export toggle */}
                 {/* Allow Export toggle */}
<div className="flex items-center justify-between">
  {/* Text is NOT part of the label */}
  <span className="font-medium text-black text-[15px]">Allow Export</span>

  {/* Wrap only the switch in a label for htmlFor/inp interaction */}
  <label
    htmlFor="allowExport"
    className="relative cursor-pointer hover:opacity-80"
  >
    <input
      id="allowExport"
      type="checkbox"
      {...register("allow_export")}
      className="sr-only peer"
    />

    {/* track */}
    <div className="
      w-12 h-6 rounded-full
      bg-gray-200 border-2 border-[#FFC429]
    " />

    {/* thumb */}
    <div className="
      absolute top-0 left-0
      w-6 h-6 rounded-full
      bg-[#E53E3E] peer-checked:bg-[#49AC82]
      border-2 border-[#FFC429]
      transition-transform transform
      peer-checked:translate-x-6
    "/>
  </label>
</div>

{/* Digital Twin Model toggle */}
<div className="flex items-center justify-between">
  <span className="font-medium text-black text-[15px]">Digital Twin Model</span>

  <label
    htmlFor="digitalTwin"
    className="relative cursor-pointer hover:opacity-80"
  >
    <input
      id="digitalTwin"
      type="checkbox"
      {...register("digital_twin_model")}
      className="sr-only peer"
    />

    {/* track */}
    <div className="
      w-12 h-6 rounded-full
      bg-gray-200 border-2 border-[#FFC429]
    " />

    {/* thumb */}
    <div className="
      absolute top-0 left-0
      w-6 h-6 rounded-full
      bg-[#E53E3E] peer-checked:bg-[#49AC82]
      border-2 border-[#FFC429]
      transition-transform transform
      peer-checked:translate-x-6
    "/>
  </label>
</div>

                </div>
                <div className="mb-4 flex flex-col items-start ml-3">
                  <label
                    className={`block text-black text-[15px] ml-2 font-[500] ${allowExport ? "" : "opacity-15"
                      }`}
                  >
                    Backward Efficiency ( % )
                  </label>
                  <input
                    className={`border border-[#916600]  bg-gradient-to-br from-[#F6FFFF] from-[99.11%] to-[#8D9090]  rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${!allowExport && "opacity-15"}`}
                    type="text"
                    name="backward_efficiency"
                    placeholder="0.00"
                    disabled={!allowExport}
                    {...register("backward_efficiency", {
                      required: allowExport ? "Backward Efficiency is required" : false,
                      pattern: validDecimalPattern,
                      max: { value: 100, message: "Backward efficiency should be less than or equal to 100" },
                    })}
                  />
                  {errors.backward_efficiency && <span className="text-red-500">{errors.backward_efficiency.message}</span>}
                </div>

                <div className="mb-4 flex flex-col items-start ml-3">
                  <label className="block text-black text-[15px] ml-2 font-[500]">
                    Primary Ampacity ( A )
                  </label>
                  <input
                    className={`border border-[#916600]  bg-gradient-to-br from-[#F6FFFF] from-[99.11%] to-[#8D9090] rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${errors.primary_ampacity && "border-red-500"}`}
                    type="text"
                    name="primary_ampacity"
                    placeholder="0.00"
                    {...register("primary_ampacity", {
                      required: "Primary Ampacity is required",
                      pattern: validDecimalPattern,
                      max: { value: MAX_TRANSFORMER_VALUE, message: `Primary Ampacity should be less than or equal to ${MAX_TRANSFORMER_VALUE}` },
                    })}
                  />
                  {errors.primary_ampacity && <span className="text-red-500">{errors.primary_ampacity.message}</span>}
                </div>

                <div className="mb-4 flex flex-col items-start ml-3">
                  <label className="block text-black text-[15px] ml-2 font-[500]">
                    Secondary Ampacity ( A )
                  </label>
                  <input
                    className={`border border-[#916600]  bg-gradient-to-br from-[#F6FFFF] from-[99.11%] to-[#8D9090]  rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${errors.secondary_ampacity && "border-red-500"}`}
                    type="text"
                    name="secondary_ampacity"
                    placeholder="0.00"
                    {...register("secondary_ampacity", {
                      required: "Secondary Ampacity is required",
                      pattern: validDecimalPattern,
                      max: { value: MAX_TRANSFORMER_VALUE, message: `Secondary Ampacity should be less than or equal to ${MAX_TRANSFORMER_VALUE}` },
                    })}
                  />
                  {errors.secondary_ampacity && <span className="text-red-500">{errors.secondary_ampacity.message}</span>}
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
        {/* <div className="flex justify-center items-center">
          <button
            type="submit"
            className={`bg-yellow-500 text-center mt-1 text-saveButtonColor font-semibold py-4 px-4 rounded-xl w-[200px] ${name ? "opacity-80 hover:bg-yellow-500 hover:opacity-100" : "cursor-not-allowed opacity-15"}`}
            disabled={!name}
            onClick={handleSubmit(onSubmit)}
          >
            SAVE
          </button>
        </div> */}
        <div className="mt-8 flex justify-center gap-4">
            <button
               onClick={handleReset}
               disabled={!name}
              className="bg-[#E63C3C] hover:bg-red-600 text-[#460000] font-bold px-14 py-3.5 rounded-lg transition shadow-[0px_4px_4px_0px_#00000040] "
            >
              Reset
            </button>
            <button
              disabled={!name}
              onClick={handleSubmit(onSubmit)}
              className="bg-[#1BA13D] hover:bg-green-700 disabled:opacity-50 text-white font-bold px-16 py-3.5 rounded-lg transition shadow-[0px_4px_4px_0px_#00000040] "
            >
              Save
            </button>
          </div>
      </div>
    </div>
  );
};

export default TransformerForm;
