
import axiosInstance from "interceptor/AuthInterceptor";
// import { API_URL, TOKEN } from "services/Config";

export const fetchBreadcrumbNavigationPath = async (node_id) => {
  
  try {
    const response = await axiosInstance.get(`/breadcrumb/nodes/${node_id}/breadcrumb`, {
      
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching breadcrumb navigation path details:", error.response);
    throw error;
  }
}

 