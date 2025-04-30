
import axiosInstance from "interceptor/AuthInterceptor";

export const fetchSolarDetails = async (houseId) => {
  try {
    const response = await axiosInstance.get(
      `/solar/${houseId}`,
       
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Solar profile details:", error);
    throw error;
  }
};


export const createSolarDetails = async (solarData) => {
    try {
      const response = await axiosInstance.post(
        `/solar`, solarData
         
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating Solar profile details:", error);
      throw error;
    }
  };

export const updateSolarData = async (houseId, solarData) => {
  try {
    const response = await axiosInstance.put(
      `/solar/${houseId}`,
      solarData,
      
    );
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error updating solar Profile data:", error);
    throw error;
  }
};


 