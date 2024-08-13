import React, { useEffect } from "react";
import { updateTransformerData } from "services/Tranformer";
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

  const { register, handleSubmit, watch, formState: { errors } } = methods;

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

  const handleClose = () => {
    onClose();
  };

  const validDecimalPattern = { value: /^\d*\.?\d{1,2}$/, message: "Invalid number" };

  const allowExport = watch("allow_export");
  const name = watch("name");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-customBackground bg-opacity-55 z-50">
      <div className="relative bg-white rounded-2xl pt-[100px] px-28 pb-8 w-full max-w-5xl border border-solid shadow-sm max-md:px-5 mt-36 mb-16 ml-28 z-10">
        <div className="absolute top-4 left-0 right-0 z-1 text-[14px] text-black font-light">
          {transformer && transformer.new !== true && (
            <Breadcrumb nodeId={transformer.id} onEditNode={() => { }} />
          )}
        </div>
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-15 right-4 top-4"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/HyggeLogo.png)`,
            backgroundSize: "210px 210px",
            zIndex: -1,
          }}
        ></div>
        <button
          className="cursor-pointer absolute top-1 right-5 p-2 text-4xl font-thin"
          onClick={handleClose}
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold text-center mb-11">
          Enter / Edit the Transformer Configurations
        </h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col mb-4 pr-4 border-r border-customBorderColor">
                <div className="mb-4 flex flex-col items-start ml-7">
                  <label className="block text-customGrey-700 text-[13px] ml-2 font-[500]">
                    Name of Transformer
                  </label>
                  <input
                    className={`border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${errors.name && "border-red-500"}`}
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
                  <label className="block text-customGrey-700 text-[13px] ml-2 font-[500]">
                    Max Capacity ( kW )
                  </label>
                  <input
                    className={`border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${errors.max_capacity_kw && "border-red-500"}`}
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
                  <label className="block text-customGrey-700 text-[13px] ml-2 font-[500]">
                    Years of Service
                  </label>
                  <input
                    className={`border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${errors.years_of_service && "border-red-500"}`}
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
                  <label className="block text-customGrey-700 text-[13px] ml-2 font-[500]">
                    Forward Efficiency ( % )
                  </label>
                  <input
                    className={`border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${errors.forward_efficiency && "border-red-500"}`}
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
                <div className="grid grid-cols-2 mb-7 mt-9 ml-3">
                  <div className="flex items-center">
                    <input
                      className="mr-2"
                      type="checkbox"
                      name="allow_export"
                      {...register("allow_export")}
                      style={{ width: "20px", height: "20px" }}
                    />
                    <label className="text-customGrey-700 text-[13px] whitespace-nowrap font-[500]">
                      Allow Export
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      className="mr-2"
                      type="checkbox"
                      name="digital_twin_model"
                      {...register("digital_twin_model")}
                      style={{ width: "20px", height: "20px" }}
                    />
                    <label className="text-customGrey-700 text-[13px] font-[500]">
                      Digital Twin Model
                    </label>
                  </div>
                </div>
                <div className="mb-4 flex flex-col items-start ml-3">
                  <label
                    className={`block text-customGrey-700 text-[13px] ml-2 font-[500] ${allowExport ? "" : "opacity-15"
                      }`}
                  >
                    Backward Efficiency ( % )
                  </label>
                  <input
                    className={`border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${!allowExport && "opacity-15"}`}
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
                  <label className="block text-customGrey-700 text-[13px] ml-2 font-[500]">
                    Primary Ampacity ( A )
                  </label>
                  <input
                    className={`border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${errors.primary_ampacity && "border-red-500"}`}
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
                  <label className="block text-customGrey-700 text-[13px] ml-2 font-[500]">
                    Secondary Ampacity ( A )
                  </label>
                  <input
                    className={`border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${errors.secondary_ampacity && "border-red-500"}`}
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
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className={`bg-yellow-500 text-center mt-1 text-saveButtonColor font-semibold py-4 px-4 rounded-xl w-[200px] ${name ? "opacity-80 hover:bg-yellow-500 hover:opacity-100" : "cursor-not-allowed opacity-15"}`}
            disabled={!name}
            onClick={handleSubmit(onSubmit)}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransformerForm;
