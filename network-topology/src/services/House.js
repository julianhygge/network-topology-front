import axios from "axios";
import { API_URL, TOKEN } from "services/Config";

export const fetchHouseDetails = async (houseId) => {
  try {
    const response = await axios.get(`${API_URL}/houses/${houseId}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching houses details:", error);
    throw error;
  }
};
export const updateHouseData = async (houseId, houseData) => {
  try {
    const response = await fetch(`${API_URL}/houses/${houseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(houseData),
    });
    console.log(response);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating transformer data:", error);
    throw error;
  }
};
