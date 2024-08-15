
import axiosInstance from "interceptor/AuthInterceptor";
// import { API_URL, TOKEN } from "services/Config";

export const fetchTransformerDetails = async (transformerId) => {
  try {
    const response = await axiosInstance.get(
      `/transformers/${transformerId}`,
       
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
    const response = await axiosInstance.put(
      `/transformers/${transformerId}`,
      transformerData,
      
    );
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error updating transformer data:", error);
    throw error;
  }
};


 