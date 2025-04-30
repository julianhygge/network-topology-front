 
import axiosInstance from "interceptor/AuthInterceptor";
// import { API_URL, TOKEN } from "services/Config";

export const fetchHouseDetails = async (houseId) => {
  try {
    const response = await axiosInstance.get(`/houses/${houseId}`, {
       
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
    const response = await axiosInstance.put(
      `/houses/${houseId}`,
      houseData,
       
    );

    return response.data;
  } catch (error) {
    console.error("Error updating transformer data:", error);
    throw error;
  }
};


  