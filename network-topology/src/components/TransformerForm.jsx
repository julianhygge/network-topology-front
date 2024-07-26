import React, { useState} from "react";
import { updateTransformerData } from "../services/Tranformer";
import Breadcrumb from "./Breadcrumb";
import "./Breadcrumb.css"
import { bgcolor } from "@mui/system";

const TransformerForm = ({ transformer, onSave, onClose}) => {
  const [formData, setFormData] = useState({
    name: transformer.name || "",
    max_capacity_kw: transformer.max_capacity_kw ? transformer.max_capacity_kw.toString() : "",
    years_of_service: transformer.years_of_service ? transformer.years_of_service.toString() : "",
    forward_efficiency: transformer.forward_efficiency ? transformer.forward_efficiency.toString() : "",
    allow_export: transformer.allow_export || false,
    digital_twin_model: transformer.digital_twin_model || false,
    backward_efficiency: transformer.backward_efficiency ? transformer.backward_efficiency.toString() : "",
    primary_ampacity: transformer.primary_ampacity ? transformer.primary_ampacity.toString() : "",
    secondary_ampacity: transformer.secondary_ampacity ? transformer.secondary_ampacity.toString() : ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateFormData = (data) => {
    const errors = [];
    if (data.allow_export && !data.backward_efficiency) {
      errors.push("Backward Efficiency is required if Allow Export is activated.");
    }

    if (data.max_capacity_kw && isNaN(parseFloat(data.max_capacity_kw))) {
      errors.push("Max Capacity must be a valid number.");
    }
    if (data.years_of_service && isNaN(parseInt(data.years_of_service, 10))) {
      errors.push("Years of Service must be a valid integer.");
    }
    if (data.forward_efficiency && isNaN(parseFloat(data.forward_efficiency))) {
      errors.push("Forward Efficiency must be a valid number.");
    }
    if (data.backward_efficiency && isNaN(parseFloat(data.backward_efficiency))) {
      errors.push("Backward Efficiency must be a valid number.");
    }
    if (data.primary_ampacity && isNaN(parseFloat(data.primary_ampacity))) {
      errors.push("Primary Ampacity must be a valid number.");
    }
    if (data.secondary_ampacity && isNaN(parseFloat(data.secondary_ampacity))) {
      errors.push("Secondary Ampacity must be a valid number.");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFormData(formData);
    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }

    const parsedFormData = {
      ...formData,
      max_capacity_kw: parseFloat(formData.max_capacity_kw) || 0.00,
      years_of_service: parseInt(formData.years_of_service, 10) || 0,
      forward_efficiency: parseFloat(formData.forward_efficiency) || 0.00,
      backward_efficiency: parseFloat(formData.backward_efficiency) || 0.00,
      primary_ampacity: parseFloat(formData.primary_ampacity) || 0.00,
      secondary_ampacity: parseFloat(formData.secondary_ampacity) || 0.00,
    };

    try {
      const updatedTransformer = await updateTransformerData(
        transformer.id,
        parsedFormData
      );
      console.log("updated transformer:" +  updatedTransformer.is_complete);

      onSave(updatedTransformer);
    } catch (error) {
      console.error("Error updating transformer data:", error);
    }
  };

  const handleClose = () => {
    onClose();
  }

  const handleBreadcrumbNodeClick = (node) => {
    // this function wont do anything
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-customBackground bg-opacity-55 z-50">
      <div className="relative bg-white rounded-2xl pt-[100px] px-28 pb-8 w-full max-w-5xl border border-solid shadow-sm max-md:px-5 mt-36 mb-16 ml-28 z-10">
      <div className="absolute top-4 left-0 right-0 z-1 text-[14px] text-black font-light">
          {transformer && transformer.new!==true && <Breadcrumb nodeId={transformer.id} onEditNode={handleBreadcrumbNodeClick} size="small-transformer-configuration"/>}
      </div>
      <div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-15 right-4 top-4" 
             style={{ 
               backgroundImage: `url(${process.env.PUBLIC_URL}/images/HyggeLogo.png)`,
               backgroundSize: "210px 210px",
               zIndex: -1
             }}>
      </div>
      <button className="cursor-pointer absolute top-1 right-5 p-2 text-4xl font-thin" onClick={handleClose}>&times;</button>
      <h2 className="text-lg font-semibold text-center mb-11">Enter / Edit the Transformer Configurations</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col mb-4 pr-4 border-r border-customBorderColor">
              <div className="mb-4 flex flex-col items-start ml-7">
                <label className="block text-customGrey-700 text-[13px] ml-2 font-[500]">Name of Transformer</label>
                <input
                  className="border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name of transformer"
                />
              </div>
              <div className="mb-4 flex flex-col items-start ml-7">
                <label className="block text-customGrey-700 text-[13px] ml-2 font-[500]">Max Capacity ( kW )</label>
                <input
                  className="border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm"
                  type="text"
                  name="max_capacity_kw"
                  value={formData.max_capacity_kw}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
              <div className="mb-4 flex flex-col items-start ml-7">
                <label className="block text-customGrey-700 text-[13px] ml-2 font-[500]">Years of Service</label>
                <input
                  className="border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm"
                  type="text"
                  name="years_of_service"
                  value={formData.years_of_service}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="mb-4 flex flex-col items-start ml-7">
                <label className="block text-customGrey-700 text-[13px] ml-2 font-[500]">Forward Efficiency ( % )</label>
                <input
                  className="border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm"
                  type="text"
                  name="forward_efficiency"
                  value={formData.forward_efficiency}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex flex-col mb-4 pl-4">
              <div className="grid grid-cols-2 mb-7 mt-9 ml-3">
                <div className="flex items-center">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="allow_export"
                    checked={formData.allow_export}
                    onChange={handleChange}
                    style={{ width: "20px", height: "20px" }}
                  />
                  <label className="text-customGrey-700 text-[13px] whitespace-nowrap font-[500]">Allow Export</label>
                </div>

                <div className="flex items-center">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="digital_twin_model"
                    checked={formData.digital_twin_model}
                    onChange={handleChange}
                    style={{ width: "20px", height: "20px" }}
                  />
                  <label className="text-customGrey-700 text-[13px] font-[500]">Digital Twin Model</label>
                </div>
              </div>
              <div className="mb-4 flex flex-col items-start ml-3">
                <label className={`block text-customGrey-700 text-[13px] ml-2 font-[500] ${formData.allow_export?'':"opacity-15"}`}>Backward Efficiency ( % )</label>
                <input
                  className={`border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm ${formData.allow_export?'':"opacity-15"}`}
                  type="text"
                  name="backward_efficiency"
                  value={formData.backward_efficiency}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled={!formData.allow_export}
                />
              </div>

              <div className="mb-4 flex flex-col items-start ml-3">
                <label className="block text-customGrey-700 text-[13px] ml-2 font-[500]">Primary Ampacity ( A )</label>
                <input
                  className="border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm"
                  type="text"
                  name="primary_ampacity"
                  value={formData.primary_ampacity}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div className="mb-4 flex flex-col items-start ml-3">
                <label className="block text-customGrey-700 text-[13px] ml-2 font-[500]">Secondary Ampacity ( A )</label>
                <input
                  className="border border-black rounded-xl w-80 py-2.5 px-3 mt-1 text-sm"
                  type="text"
                  name="secondary_ampacity"
                  value={formData.secondary_ampacity}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </form>
        <div className="flex justify-center items-center">
        <button 
          type="submit" 
          className="bg-yellow-500 text-center mt-1 opacity-80 text-saveButtonColor font-semibold py-4 px-4 rounded-xl hover:bg-yellow-500 hover:opacity-100 w-[200px]"
          onClick={handleSubmit}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransformerForm;
