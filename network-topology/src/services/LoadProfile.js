import axios from "axios";
import { API_URL, TOKEN } from "services/Config";

export const fetchLoadTemplate = async (houseId) => {
  try {
    const response = await axios.get(
      `${API_URL}/load/houses/${houseId}/load-predefined-template`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching load template:", error);
    throw error;
  }
};

export const saveLoadTemplate = async (houseId, templateId) => {
  try {
    const response = await axios.post(
      `${API_URL}/load/houses/${houseId}/load-predefined-template`,
      { template_id: templateId },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching houses details:", error);
    throw error;
  }
};

export const fetchLoadTemplates = async () => {
  try {
    const response = await axios.get(`${API_URL}/load/load_templates`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching load templates:", error);
    throw error;
  }
};

export const fetchLoadProfileItems = async (houseId) => {
  try {
    const response = await axios.get(
      `${API_URL}/load/houses/${houseId}/load-profile-items`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching houses details:", error);
    throw error;
  }
};

export const saveLoadProfileItems = async (houseId, loads) => {
  try {
    const response = await axios.post(
      `${API_URL}/load/houses/${houseId}/load-profile-items`,
      { items: loads },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving load profile items:", error);
    throw error;
  }
};

export const fetchLoadProfiles = async (houseId) => {
  try {
    const response = await axios.get(`${API_URL}/load/?house_id=${houseId}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching houses details:", error);
    throw error;
  }
};
export const uploadLoadProfile = async (
  houseId,
  profileName,
  file,
  interval15Minutes
) => {
  const formData = new FormData();
  formData.append("house_id", houseId);
  formData.append("profile_name", profileName);
  formData.append("file", file);
  formData.append("interval_15_minutes", interval15Minutes);

  try {
    const response = await axios.post(`${API_URL}/load/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading load profile:", error);
    throw error;
  }
};

export const deleteLoadProfile = async (profileId) => {
  try {
    const response = await axios.delete(`${API_URL}/load/${profileId}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting load profile:", error);
    throw error;
  }
};
export const saveGenerationProfile = async (houseId, payload) => {
  try {
    const response = await axios.post(
      `${API_URL}/load/houses/${houseId}/generation-engine`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading load profile:", error);
    throw error;
  }
};

export const fetchGenerationEngineProfile = async (houseId) => {
  try {
    const response = await axios.get(
      `${API_URL}/load/houses/${houseId}/generation-engine`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching generation engine profile:", error);
    throw error;
  }
};

export const deleteGenerationProfile = async (profileId) => {
  try {
    const response = await axios.delete(`${API_URL}/load/${profileId}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    console.log(response);
  } catch (error) {
    console.error("Failed to delete the file:", error);
  }
};
