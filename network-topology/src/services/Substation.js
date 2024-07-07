import axios from "axios";

const API_URL = "https://hygge-test.ddns.net:8080/net-topology-api/v1";

export const getSubstations = async () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc";
  try {
    const response = await axios.get(`${API_URL}/substations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching substations:", error.response);
    throw error;
  }
};

export const generateSubstation = async (payload) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc";
  try {
    const response = await fetch(`${API_URL}/substations/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc";
  try {
    const response = await axios.get(`${API_URL}/substations/${substationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching substation with ID ${substationId}:`, error);
    throw error;
  }
};

export const updateSubstationTopology = async (
  substationId,
  substationData
) => {
  const createNodeMap = (nodes) => {
    const nodeMap = {};
    nodes.forEach((node) => {
      nodeMap[node.id] = {
        id: node.ids.startsWith("temp") ? undefined : node.ids,
        type: node.type,
        action: node.ids.startsWith("temp") ? "add" : "update",
        children: [],
      };
    });
    return nodeMap;
  };

  const nodeMap = createNodeMap(substationData.nodes);

  substationData.links.forEach((link) => {
    const parentNode = nodeMap[link.source];
    const childNode = nodeMap[link.target];

    if (parentNode && childNode) {
      parentNode.children.push(childNode);
    }
  });

  const collectTopLevelNodes = (nodes, links) => {
    const childIds = new Set(links.map((link) => link.target));
    return nodes.filter((node) => !childIds.has(node.id));
  };

  const topLevelNodes = collectTopLevelNodes(
    substationData.nodes,
    substationData.links
  );

  const formatNode = (node) => {
    const formattedNode = {
      id: node.id,
      type: node.type,
      action: node.action,
      children: node.children.map((child) => formatNode(child)),
    };

    if (formattedNode.children.length === 0) {
      delete formattedNode.children;
    }

    return formattedNode;
  };

  const formattedNodes = topLevelNodes.map((node) =>
    formatNode(nodeMap[node.id])
  );

  const payload = {
    substation_id: substationId,
    nodes: [
      ...formattedNodes,
      ...substationData.deletedNodes.map((node) => ({
        id: node.id,
        type: node.type,
        action: "delete",
      })),
    ],
  };
  console.log(JSON.stringify(payload));
  try {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc";

    const response = await fetch(`${API_URL}/substations/${substationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
