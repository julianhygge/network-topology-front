import React, { useState } from 'react';
import { TextField, } from '@mui/material';
import NetworkGraph from './components/NetworkGraph';
import HouseForm from './components/HouseForm';
import TransformerForm from './components/TransformerForm';
import './App.css';

const NetworkTopologyBuilder = () => {
    const [numTransformers, setNumTransformers] = useState(0);
    const [transformers, setTransformers] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [openHouseForm, setOpenHouseForm] = useState(false);
    const [openTransformerForm, setOpenTransformerForm] = useState(false);

    const handleTransformerChange = (e) => {
        let num = parseInt(e.target.value,10 );
        if(isNaN(num)){
            num=null;
        }
        setNumTransformers(num);
        
        const newTransformers = new Array(num).fill(0).map((_, i) => ({
            id: `t${i + 1}`,
            type: 'transformer',
            label: `Transformer ${i + 1}`,
            name: '',
            peak_value: 0,
            reverse_allowed: false,
            reverse_efficiency: 0,
            max_houses: 0,
            houses: [],
        }));
        setTransformers(newTransformers);
    };

    const handleHouseChange = (index, e) => {
        let numHouses = parseInt(e.target.value, 10);
        if(isNaN(numHouses)){
            numHouses=0;
        }
        setTransformers(prev => {
            const newTransformers = [...prev];
            const transformer = newTransformers[index];
            transformer.houses = new Array(numHouses).fill(0).map((_, i) => ({
                id: `h${index + 1}-${i + 1}`,
                type: 'house',
                label: `House ${index + 1}-${i + 1}`,
                name: '',
                load_profile: 0,
                solar: false,
                house_type: '',
                connection_number: '',
                battery: false,
                voluntary: false,
                color: 'red',
            }));
            return newTransformers;
        });
    };

    const handleNodeClick = (node) => {
        setSelectedNode(node);
        if (node.type === 'house') {
            setOpenHouseForm(true);
        } else if (node.type === 'transformer') {
            setOpenTransformerForm(true);
        }
    };

    const handleHouseFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSelectedNode(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleTransformerFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSelectedNode(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSaveHouse = () => {
        setTransformers(prev => {
            const newTransformers = [...prev];
            const transformerIndex = newTransformers.findIndex(t => t.id === selectedNode.id.split('-')[0]);
            const houseIndex = newTransformers[transformerIndex].houses.findIndex(h => h.id === selectedNode.id);
            newTransformers[transformerIndex].houses[houseIndex] = selectedNode;
            return newTransformers;
        });
        setOpenHouseForm(false);
        setSelectedNode(null);
    };

    const handleSaveTransformer = () => {
        setTransformers(prev => {
            const newTransformers = [...prev];
            const transformerIndex = newTransformers.findIndex(t => t.id === selectedNode.id);
            newTransformers[transformerIndex] = selectedNode;
            return newTransformers;
        });
        setOpenTransformerForm(false);
        setSelectedNode(null);
    };

    return (
        <div className="network-topology-builder">
            <form>
                <div >
                    <TextField
                        label="Enter number of transformers:"
                        type="number"
                        value={numTransformers ||''}
                        onChange={handleTransformerChange}
                        min="1"
                        fullWidth
                    />
                </div>
                {transformers.map((transformer, index) => (
                    <div key={index}>
                        <TextField
                            label={`Enter number of houses for Transformer ${index + 1}:`}
                            type="number"
                            value={transformer.houses.length || ''}
                            onChange={(e) => handleHouseChange(index, e)}
                            min="0"
                            fullWidth
                        />
                    </div>
                ))}
            </form>
            <div style={{ width: '100%', height: '800px' }}>
                <NetworkGraph transformers={transformers} onNodeClick={handleNodeClick} />
            </div>

            {selectedNode && selectedNode.type === 'house' && (
                <HouseForm
                    open={openHouseForm}
                    onClose={() => setOpenHouseForm(false)}
                    house={selectedNode}
                    onSave={handleSaveHouse}
                    handleChange={handleHouseFormChange}
                />
            )}

            {selectedNode && selectedNode.type === 'transformer' && (
                <TransformerForm
                    open={openTransformerForm}
                    onClose={() => setOpenTransformerForm(false)}
                    transformer={selectedNode}
                    onSave={handleSaveTransformer}
                    handleChange={handleTransformerFormChange}
                />
            )}
        </div>
    );
};

export default NetworkTopologyBuilder;
