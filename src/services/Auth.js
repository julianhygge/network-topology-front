 
import axiosInstance from "interceptor/AuthInterceptor";
// import { API_URL } from "services/Config";

export const requestOtp = async (phone_number) => {
    try {
      const response = await axiosInstance.post(`/auth/user`, {phone_number, country_code:"91"
         
      });
      console.log("Response", response)
      return response.data;
    } catch (error) {
      console.error("Error requesting otp:", error);
      throw error;
    }
  }

export const verifyOtp = async(state_token, otp) => {
  try {
    const response = await axiosInstance.post(`/auth/${state_token}`, {state_token, otp});
    console.log('VerifyOtp', response)
    return response.data
  } catch (error) {
    console.error("Error verify otp:", error);
    throw error;
  }
}


