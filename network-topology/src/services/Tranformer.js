import axios from "axios";
import { API_URL, TOKEN } from "services/Config";

export const fetchTransformerDetails = async (transformerId) => {
  try {
    const response = await axios.get(
      `${API_URL}/transformers/${transformerId}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching transformer details:", error);
    throw error;
  }
};
export const updateTransformerData = async (transformerId, transformerData) => {
  try {
    const response = await axios.put(
      `${API_URL}/transformers/${transformerId}`,
      transformerData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error updating transformer data:", error);
    throw error;
  }
};
