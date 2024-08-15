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
    const response = await fetch(`${API_URL}/transformers/${transformerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(transformerData),
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
