import axios from "axios";
import { API_URL } from "services/Config";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc";

export const fetchLoadTemplate = async (houseId) => {
  try {
    const response = await axios.get(`${API_URL}/load/houses/${houseId}/load-predefined-template`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching load template:", error);
    throw error;
  }
}

export const saveLoadTemplate = async (houseId, templateId) => {
  try {
    const response = await axios.post(
      `${API_URL}/load/houses/${houseId}/load-predefined-template`,
      { template_id: templateId },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
    return response.data;
  } catch (error) {
    console.error("Error fetching houses details:", error);
    throw error;
  }
}

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
}

export const fetchLoadProfileItems = async (houseId) => {
  try {
    const response = await axios.get(`${API_URL}/load/houses/${houseId}/load-profile-items`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching houses details:", error);
    throw error;
  }
}

export const saveLoadProfileItems = async (houseId, loads) => {
  try {
    const response = await axios.post(`${API_URL}/load/houses/${houseId}/load-profile-items`, { items: loads }, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving load profile items:", error);
    throw error;
  }
}

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

}
export const saveGenerationProfile = async (houseId, payload) => {
  try {
    const response = await fetch(
      `${API_URL}/load/houses/${houseId}/generation-engine`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save profile");
    }

    return response.json();
  } catch (error) {
    console.error("Error uploading load profile:", error);
    throw error;
  }
};

export const fetchGenerationEngineProfile = async (houseId) => {
  try {
    const response = await fetch(`${API_URL}/load/houses/${houseId}/generation-engine`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },

    });
    return response.json();
  } catch (error) {
    console.error("Error fetching generation engine profile:", error);
    throw error;
  }
};

export const deleteGenerationProfile = async (profileId) => {
  try {
    const response = await fetch(`${API_URL}/load/${profileId}/`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },

    });
    console.log(response)
    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  } catch (error) {
    console.error("Failed to delete the file:", error);
  }
};
