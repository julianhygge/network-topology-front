import axios from "axios";
import { API_URL, TOKEN } from "services/Config";

export const fetchAppliances = async () => {
  try {
    const response = await axios.get(`${API_URL}/appliances`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appliances:", error);
    throw error;
  }
}
