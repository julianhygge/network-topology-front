import axiosInstance from "interceptor/AuthInterceptor";
// import { API_URL, TOKEN } from "services/Config";

export const fetchLoadTemplate = async (houseId) => {
  try {
    const response = await axiosInstance.get(
      `/load/houses/${houseId}/load-predefined-template`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching load template:", error);
    throw error;
  }
};
export const downloadFile = async (downloadLink) => {
  try {
    const response = await axiosInstance.get(`${downloadLink}`, {
      responseType: "blob", // Ensure that the response is in the form of a Blob
    });

    return response.data;
  } catch (error) {
    console.error("Failed to download file:", error);
    throw error;
  }
};
export const deleteFile = async (selectedDeleteLink) => {
  try {
    const response = await axiosInstance.delete(`${selectedDeleteLink}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete file:", error);
    throw error;
  }
};

export const saveLoadTemplate = async (houseId, templateId) => {
  try {
    const response = await axiosInstance.post(
      `/load/houses/${houseId}/load-predefined-template`,
      { template_id: templateId }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching houses details:", error);
    throw error;
  }
};

export const fetchLoadTemplates = async () => {
  try {
    const response = await axiosInstance.get(`/load/load_templates`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching load templates:", error);
    throw error;
  }
};

export const fetchLoadProfileItems = async (houseId) => {
  try {
    const response = await axiosInstance.get(
      `/load/houses/${houseId}/load-profile-items`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching houses details:", error);
    throw error;
  }
};

export const saveLoadProfileItems = async (houseId, loads) => {
  try {
    const response = await axiosInstance.post(
      `/load/houses/${houseId}/load-profile-items`,
      { items: loads }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving load profile items:", error);
    throw error;
  }
};

export const fetchLoadProfiles = async (houseId) => {
  try {
    const response = await axiosInstance.get(`/load/?house_id=${houseId}`, {});

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
    const response = await axiosInstance.post(`/load/upload`, formData, {
      // headers: {
      //   "Content-Type": "multipart/form-data",
      //   Authorization: `Bearer ${TOKEN}`,
      // },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading load profile:", error);
    throw error;
  }
};

export const deleteLoadProfile = async (profileId) => {
  try {
    const response = await axiosInstance.delete(`/load/${profileId}`, {});
    return response.data;
  } catch (error) {
    console.error("Error deleting load profile:", error);
    throw error;
  }
};
export const saveGenerationProfile = async (houseId, payload) => {
  try {
    const response = await axiosInstance.post(
      `/load/houses/${houseId}/generation-engine`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading load profile:", error);
    throw error;
  }
};

export const fetchGenerationEngineProfile = async (houseId) => {
  try {
    const response = await axiosInstance.get(
      `/load/houses/${houseId}/generation-engine`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching generation engine profile:", error);
    throw error;
  }
};

export const deleteGenerationProfile = async (profileId) => {
  try {
    const response = await axiosInstance.delete(`/load/${profileId}/`, {});
    console.log(response);
  } catch (error) {
    console.error("Failed to delete the file:", error);
  }
};
