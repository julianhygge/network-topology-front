
import React, { useState, useEffect } from 'react';
import SubstationSelector from './components/SubstationSelector';
import NetworkGraph from './components/NetworkGraph';
import TransformerForm from './components/TransformerForm'; 
import HouseForm from './components/HouseForm';
import { getSubstationById, updateSubstationTopology } from './services/Substation';
import './App.css';

const NetworkTopologyBuilder = () => {
    const [selectedSubstationId, setSelectedSubstationId] = useState(null);
    const [substationData, setSubstationData] = useState(null);
    const [transformerDetails, setTransformerDetails] = useState(null);
    const [houseDetails, setHouseDetails] = useState(null);

    useEffect(() => {
        if (selectedSubstationId) {
            const fetchSubstationData = async () => {
                try {
                    const data = await getSubstationById(selectedSubstationId);
                    console.log('Fetched substation data:', data);

                    const graphData = {
                        nodes: [],
                        links: [],
                    };

                    data.transformers.forEach((transformer, index) => {
                        const transformerNode = {
                            ids: transformer.id,
                            id: `Transformer-${index}`,
                            label: `Transformer-${index}`,
                            color: transformer.is_complete ? 'green' : 'black',
                        };
                        graphData.nodes.push(transformerNode);

                        transformer.houses_details.forEach((house, houseIndex) => {
                            const houseNode = {
                                ids: house.id,
                                id: `House-${index}-${houseIndex}`,
                                label: `House-${index}-${houseIndex}`,
                                color: house.is_complete ? 'green' : 'black',
                            };
                            graphData.nodes.push(houseNode);

                            graphData.links.push({
                                source: transformerNode.id,
                                target: houseNode.id,
                            });
                        });
                    });

                    console.log('Graph data being set:', graphData);
                    setSubstationData(graphData);
                } catch (error) {
                    console.error('Error fetching substation data:', error);
                }
            };

            fetchSubstationData();
        }
    }, [selectedSubstationId]);

    const handleSaveTopology = async () => {
        try {
            await updateSubstationTopology(selectedSubstationId, substationData);
        } catch (error) {
            console.error('Error saving substation topology:', error);
        }
    };

    const handleTransformerSave = (updatedTransformer) => {
        setSubstationData((prevData) => {
            const updatedNodes = prevData.nodes.map((node) => {
                if (node.ids === updatedTransformer.id) {
                    return {
                        ...node,
                        color: updatedTransformer.is_complete ? 'green' : 'black',
                    };
                }
                return node;
            });
            return {
                ...prevData,
                nodes: updatedNodes,
            };
        });
        setTransformerDetails(null);
    };

    const handleHouseSave = (updatedHouse) => {
        setSubstationData((prevData) => {
            const updatedNodes = prevData.nodes.map((node) => {
                if (node.ids === updatedHouse.id) {
                    return {
                        ...node,
                        color: updatedHouse.is_complete ? 'green' : 'black',
                    };
                }
                return node;
            });
            return {
                ...prevData,
                nodes: updatedNodes,
            };
        });
        setHouseDetails(null);
    };

    const handleTransformerEdit = (transformerDetails) => {
        setTransformerDetails(transformerDetails);
        setHouseDetails(null); 
    };

    const handleHouseEdit = (houseDetails) => {
        setHouseDetails(houseDetails);
        setTransformerDetails(null); 
    };

    const handleCloseTransformerForm = () => {
        setTransformerDetails(null);
    };

    const handleCloseHouseForm = () => {
        setHouseDetails(null);
    };

    return (
        <div>
            <SubstationSelector setSelectedSubstation={setSelectedSubstationId} />
            {substationData && (
                <>
                    <NetworkGraph 
                        data={substationData} 
                        onTransformerEdit={handleTransformerEdit} 
                        onHouseEdit={handleHouseEdit}
                    />
                    <button onClick={handleSaveTopology}>Save</button>
                </>
            )}
            
            {transformerDetails && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseTransformerForm}>close</span>
                        <TransformerForm
                            transformer={transformerDetails}
                            onSave={handleTransformerSave}
                        />
                    </div>
                </div>
            )}

            {houseDetails && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseHouseForm}>close</span>
                        <HouseForm
                            house={houseDetails}
                            onSave={handleHouseSave}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NetworkTopologyBuilder;
