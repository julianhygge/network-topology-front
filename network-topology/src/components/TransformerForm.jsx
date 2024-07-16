import React, { useState } from "react";
import { updateTransformerData } from "../services/Tranformer";

const TransformerForm = ({ transformer, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    max_capacity_kw: transformer.max_capacity_kw || "",
    export_efficiency: transformer.export_efficiency || "",
    allow_export: transformer.allow_export || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(formData.max_capacity_kw) || isNaN(formData.export_efficiency)) {
      alert("Max Capacity and Export Efficiency must be numbers");
      return;
    }

    try {
      const updatedTransformer = await updateTransformerData(
        transformer.id,
        formData
      );
      console.log(updatedTransformer);

      onSave(updatedTransformer);
    } catch (error) {
      console.error("Error updating transformer data:", error);
    }
  };

  const handleClose = () => {
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-customBackground bg-opacity-55 z-50">
      <div className="bg-white rounded-2xl p-32 w-full max-w-5xl border border-solid shadow-sm max-md:px-5 mt-20 mb-20">
      <button className="cursor-pointer float-right" onClick={handleClose}>close</button>
      <h2 className="text-lg font-semibold text-center">Enter/Edit the Transformer Configurations</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col mb-4 pr-4 border-r border-customBorderColor border-1">
              <div className="mb-4 flex flex-col items-center">
                <div className="w-full flex justify-start ml-1">
                  <label className="block text-customGrey-700 text-[14px]">Name of Transformer</label>
                </div>
                <input
                  className="border border-black rounded-xl w-[300px] py-2 px-3 mt-1"
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4 flex flex-col items-center">
                <div className="w-full flex justify-start ml-1">
                  <label className="block text-customGrey-700 text-[14px]">Max Capacity [kW]</label>
                </div>
                <input
                  className="border border-black rounded-xl w-[300px] py-2 px-3 mt-1"
                  type="text"
                  name="max_capacity_kw"
                  value={formData.max_capacity_kw}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4 flex flex-col items-center">
                <div className="w-full flex justify-start ml-1">
                  <label className="block text-customGrey-700 text-[14px]">Years of Service</label>
                </div>
                <input
                  className="border border-black rounded-xl w-[300px] py-2 px-3 mt-1"
                  type="text"
                  name="years_of_service"
                  value={formData.years_of_service || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4 flex flex-col items-center">
                <div className="w-full flex justify-start ml-1">
                  <label className="block text-customGrey-700 text-[14px]">Forward Efficiency</label>
                </div>
                <input
                  className="border border-black rounded-xl w-[300px] py-2 px-3 mt-1"
                  type="text"
                  name="years_of_service"
                  value={formData.forward_efficiency || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col mb-4 pl-4">
              <div className="grid grid-cols-2 mb-7.625 mt-8">
                <div className="flex items-center">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="allow_export"
                    checked={formData.allow_backward}
                    onChange={handleChange}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <label className="text-customGrey-700 text-[14px] whitespace-nowrap">Allow Backward</label>
                </div>

                <div className="flex items-center">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="allow_export"
                    checked={formData.digital_twin_model}
                    onChange={handleChange}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <label className="text-customGrey-700 text-[14px]">Digital Twin Model</label>
                </div>
              </div>
              <div className="mb-4 flex flex-col items-center">
                <div className="w-full flex justify-start ml-1">
                  <label className="block text-customGrey-700 text-[14px]">Backward Efficiency [%]</label>
                </div>
                <input
                  className="border border-black rounded-xl w-[300px] py-2 px-3 mt-1"
                  type="text"
                  name="backward_efficiency"
                  value={formData.backward_efficiency}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4 flex flex-col items-center">
                <div className="w-full flex justify-start ml-1">
                  <label className="block text-customGrey-700 text-[14px]">Primary Ampacity [Ampere]</label>
                </div>
                <input
                  className="border border-black rounded-xl w-[300px] py-2 px-3 mt-1"
                  type="text"
                  name="primary_ampacity"
                  value={formData.primary_ampacity}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4 flex flex-col items-center">
                <div className="w-full flex justify-start ml-1">
                  <label className="block text-customGrey-700 text-[14px]">Secondary Ampacity [Ampere]</label>
                </div>
                <input
                  className="border border-black rounded-xl w-[300px] py-2 px-3 mt-1"
                  type="text"
                  name="secondary_ampacity"
                  value={formData.secondary_ampacity}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </form>
          <button 
          type="submit" 
          className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded w-full hover:bg-yellow-600"
          >
            Save
          </button>
      </div>
    </div>
  );
};

export default TransformerForm;
