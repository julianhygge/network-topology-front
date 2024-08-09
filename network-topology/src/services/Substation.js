import axios from "axios";
import { API_URL, TOKEN } from "services/Config";

console.log("Tokens:" + TOKEN);
console.log("api url:" + API_URL);

export const getSubstations = async () => {
   try {
    const response = await axios.get(`${API_URL}/substations`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching substations:", error.response);
    throw error;
  }
};

export const generateSubstation = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/substations/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating substation:", error.response);
    throw error;
  }
};

export const getSubstationById = async (substationId) => {
    try {
    const response = await axios.get(`${API_URL}/substations/${substationId}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching substation with ID ${substationId}:`, error);
    throw error;
  }
};

export const updateSubstationTopology = async (substationId, updatedData) => {
  const payload = {
    substation_id: substationId,
    nodes: updatedData.nodes,
  };

  console.log("Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${API_URL}/substations/${substationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to update substation topology");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating substation topology:", error);
    throw error;
  }
};


export const updateSubstationTransformers = async (substationId, payload) => {
  try {
    const response = await fetch(`${API_URL}/substations/${substationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to add transformer");
    }
    return await response.json();
  } catch (error) {
    console.error(
      "Error updating(adding Transformer) substation topology:",
      error
    );
    throw error;
  }
};

export const deleteSubstation = async (substationId) => {
  try {
    const response = await fetch(`${API_URL}/substations/${substationId}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete substation");
    }

    return response.data;
  } catch (error) {
    console.error("Error deleting substation:", error);
    throw error;
  }
};
