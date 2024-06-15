import React, { useState, useEffect } from 'react';
import { getSubstations } from '../services/Substation';

const SubstationSelector = ({ setSelectedSubstation }) => {
    const [substations, setSubstations] = useState([]);
    const [selectedSubstationId, setSelectedSubstationId] = useState('');


    useEffect(() => {
        const fetchSubstations = async () => {
            try {
                const fetchedSubstations = await getSubstations();

                if (fetchedSubstations && Array.isArray(fetchedSubstations.items)) {
                    setSubstations(fetchedSubstations.items);
                } else {
                    console.error('Substations data is not an array:', fetchedSubstations);
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
    }
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
