import axios from 'axios';

const API_URL = 'https://hyggedev.ddns.net:8000/net-topology-api/v1';

export const getSubstations = async () => {
    const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc"
    try {
        const response = await axios.get(`${API_URL}/substations`,{
            headers: {
                'Authorization': `Bearer ${token}`
              }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching substations:', error.response);
        throw error;
    }
};

export const getSubstationById = async (substationId) => {
    const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc'
    try {
        const response = await axios.get(`${API_URL}/substations/${substationId}`,{
            headers: {
                'Authorization': `Bearer ${token}`
              }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching substation with ID ${substationId}:`, error);
        throw error;
    }
};

export const updateSubstationTopology = async (substationId, topologyData) => {
    const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc'
 

    try {
        const response = await axios.put(`${API_URL}/substations/${substationId}`,{
            headers: {
                'Authorization': `Bearer ${token}`
              }
        }, topologyData);
        return response.data;
    } catch (error) {
        console.error(`Error updating substation with ID ${substationId}:`, error);
        throw error;
    }
};
export const fetchTransformerDetails = async (transformerId) => {
    const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc'
 

    try {
        const response = await axios.get(`${API_URL}/transformers/${transformerId}`,{
            headers: {
                'Authorization': `Bearer ${token}`
              }
        });
    
    
        return response.data;
    } catch (error) {
        console.error('Error fetching transformer details:', error);
        throw error;
    }
};
export const updateTransformerData = async (transformerId, transformerData) => {
    const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc'
 
    try {
        const response = await fetch(`${API_URL}/transformers/${transformerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(transformerData),
        });
        console.log(response)
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating transformer data:', error);
        throw error;
    }
};

export const fetchHouseDetails=async(houseId)=>{
    const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc'
    try {
        const response = await axios.get(`${API_URL}/houses/${houseId}`,{
            headers: {
                'Authorization': `Bearer ${token}`
              }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching houses details:', error);
        throw error;
    }


}