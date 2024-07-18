import React, { useState } from "react";
import { updateHouseData } from "../services/House";
import Breadcrumb from "./Breadcrumb";

const HouseForm = ({ house, onSave }) => {
  const [formData, setFormData] = useState({
    load_profile: house.load_profile || "",
    has_solar: house.has_solar || false,
    solar_kw: house.solar_kw || "",
    house_type: house.house_type || "",
    connection_kw: house.connection_kw || "",
    battery_type: house.battery_type || "Lithium-ion",
    has_battery: house.has_battery || false,
    voluntary_storage: house.voluntary_storage || false,
    battery_peak_charging_rate: house.battery_peak_charging_rate || "",
    battery_peak_discharging_rate: house.battery_peak_discharging_rate || "",
    battery_total_kwh: house.battery_total_kwh || "",
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

    try {
      const updatedHouse = await updateHouseData(house.id, formData);
      if (updatedHouse.is_complete) {
        house.color = "green";
      }
      onSave(updatedHouse);
    } catch (error) {
      console.error("Error updating house data:", error);
    }
  };

  return (
    <div>
      <Breadcrumb nodeId={house.id}/>
      <form onSubmit={handleSubmit}>
        <label>
          Load Profile:
          <input className="border"
            type="text"
            name="load_profile"
            value={formData.load_profile}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Has Solar:
          <input  className="border"
            type="checkbox"
            name="has_solar"
            checked={formData.has_solar}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Solar kW:
          <input  className="border"
            type="number"
            name="solar_kw"
            value={formData.solar_kw}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          House Type:
          <input  className="border"
            type="text"
            name="house_type"
            value={formData.house_type}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Connection kW:
          <input  className="border"
            type="number"
            name="connection_kw"
            value={formData.connection_kw}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Battery Type:
          <input  className="border"
            type="text"
            name="battery_type"
            value={formData.battery_type}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Has Battery:
          <input  className="border"
            type="checkbox"
            name="has_battery"
            checked={formData.has_battery}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Voluntary Storage:
          <input  className="border"
            type="checkbox"
            name="voluntary_storage"
            checked={formData.voluntary_storage}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Battery Peak Charging Rate:
          <input  className="border"
            type="number"
            name="battery_peak_charging_rate"
            value={formData.battery_peak_charging_rate}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Battery Peak Discharging Rate:
          <input  className="border"
            type="number"
            name="battery_peak_discharging_rate"
            value={formData.battery_peak_discharging_rate}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Battery Total kWh:
          <input  className="border"
            type="number"
            name="battery_total_kwh"
            value={formData.battery_total_kwh}
            onChange={handleChange}
          />
        </label>
        <br />
        <button  className="border"type="submit">Save</button>
      </form>
    </div>
  );
};

export default HouseForm;
