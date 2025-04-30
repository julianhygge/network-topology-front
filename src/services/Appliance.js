 
import axiosInstance from "interceptor/AuthInterceptor";
// import { API_URL, TOKEN } from "services/Config";

export const fetchAppliances = async () => {
  try {
    const response = await axiosInstance.get(`/appliances`, {
      
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appliances:", error);
    throw error;
  }
}

 
