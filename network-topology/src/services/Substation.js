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


export const updateSubstationTopology = async (substationId, substationData) => {
    console.log(substationData)
    if (!substationData) {
        throw new Error('Missing substation data');
    }
    const transformers = substationData.nodes.filter(node => node.label.startsWith('Transformer')).map(transformer => ({
        action: transformer.ids.startsWith('temp') ? 'add' : 'update',
        id: transformer.ids.startsWith('temp') ? null : transformer.ids,
        houses_details: substationData.links.filter(link => link.source === transformer.id).map(link => {
            const house = substationData.nodes.find(node => node.id === link.target);
            return {
                action: house.ids.startsWith('temp') ? 'add' : 'update',
                id: house.ids.startsWith('temp') ? null : house.ids,
            };
        }),
    }));
    console.log(transformers)


    const payload = {
        transformers,
    };
    console.log(payload)
    const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc'
  

    const response = await fetch(`${API_URL}/substations/${substationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to update substation topology');
    }

    return await response.json();
};