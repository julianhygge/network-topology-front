
import React, { useState, useEffect } from 'react';
import SubstationSelector from './components/SubstationSelector';
import NetworkGraph from './components/NetworkGraph';
import TransformerForm from './components/TransformerForm'; 
import { getSubstationById, updateSubstationTopology } from './services/api';
import './App.css';

const NetworkTopologyBuilder = () => {
    const [selectedSubstationId, setSelectedSubstationId] = useState(null);
    const [substationData, setSubstationData] = useState(null);
    const [transformerDetails, setTransformerDetails] = useState(null);

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

    const handleTransformerEdit = (transformerDetails) => {
        setTransformerDetails(transformerDetails);
    };
    const handleCloseTransformerForm = () => {
        setTransformerDetails(null);
    };
    return (
        <div>
            <SubstationSelector setSelectedSubstation={setSelectedSubstationId} />
            {substationData && (
                <>
                    <NetworkGraph data={substationData} onTransformerEdit={handleTransformerEdit} />
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
        </div>
    );
};

export default NetworkTopologyBuilder;
