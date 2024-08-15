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
    const response = await axios.put(
      `${API_URL}/houses/${houseId}`,
      houseData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating transformer data:", error);
    throw error;
  }
};
