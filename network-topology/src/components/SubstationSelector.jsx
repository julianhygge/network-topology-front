import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubstationSelector = ({ setSelectedSubstation }) => {
    const [substations, setSubstations] = useState([]);
    const [selectedSubstationId, setSelectedSubstationId] = useState('');

    useEffect(() => {
        const fetchSubstations = async () => {
            const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc"
 
            try {
                const response = await axios.get('https://hyggedev.ddns.net:8000/net-topology-api/v1/substations',{
                    headers: {
                        'Authorization': `Bearer ${token}`
                      }
                });
                console.log('Substations response:', response.data);
                if (response.data && Array.isArray(response.data.items)) {
                    setSubstations(response.data.items);
                } else {
                    console.error('API response is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching substations:', error);
            }
        };

        fetchSubstations();
    }, []);

    const handleSubstationChange = (event) => {
        const substationId = event.target.value;
        setSelectedSubstationId(substationId);
        setSelectedSubstation(substationId);
    };

    return (
        <div>
            <label htmlFor="substation-select">Select Substation:</label>
            <select id="substation-select" value={selectedSubstationId} onChange={handleSubstationChange}>
                <option value="">-- Select a Substation --</option>
                {substations.map(substation => (
                    <option key={substation.id} value={substation.id}>{substation.name}</option>
                ))}
            </select>
        </div>
    );
};

export default SubstationSelector;
