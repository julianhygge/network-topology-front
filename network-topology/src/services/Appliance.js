import axios from "axios";
import { API_URL } from "services/Config";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc";

export const fetchAppliances = async () => {
  try {
    const response = await axios.get(`${API_URL}/appliances`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appliances:", error);
    throw error;
  }
}
