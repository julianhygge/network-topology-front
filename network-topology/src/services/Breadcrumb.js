import axios from "axios";
import { API_URL, TOKEN } from "services/Config";

export const fetchBreadcrumbNavigationPath = async (node_id) => {
  
  try {
    const response = await axios.get(`${API_URL}/breadcrumb/nodes/${node_id}/breadcrumb`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching breadcrumb navigation path details:", error.response);
    throw error;
  }
}
