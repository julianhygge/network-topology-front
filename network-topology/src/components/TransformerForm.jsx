import React, { useState } from "react";
import { updateTransformerData } from "../services/Tranformer";

const TransformerForm = ({ transformer, onSave }) => {
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

  return (
    <div>
      <h2>Transformer Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Max Capacity (kW):</label>
          <input  className="border"
            type="text"
            name="max_capacity_kw"
            value={formData.max_capacity_kw}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Export Efficiency:</label>
          <input  className="border"
            type="text"
            name="export_efficiency"
            value={formData.export_efficiency}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Allow Export:</label>
          <input  className="border"
            type="checkbox"
            name="allow_export"
            checked={formData.allow_export}
            onChange={handleChange}
          />
        </div>
        <button  className='border'type="submit">Save</button>
      </form>
    </div>
  );
};

export default TransformerForm;
