import React, { useEffect, useState } from 'react';
import NetworkGraph from './NetworkGraph';
import NetworkGraph2 from './NetworkGraph2';
import Navbar from './Navbar';
import GridSideBar from './GridSideBar';
import { useLocation } from "react-router-dom";
import { getSubstationById, updateSubstationTopology } from '../services/Substation';
import TransformerForm from "./TransformerForm";
import HouseForm from './HouseForm';


const NetworkTopology = () => {
    const location = useLocation();
    const [selectedSubstationId, setSelectedSubstationId] = useState(
        location.state?.substationId || null
    );
    const [transformerDetails, setTransformerDetails] = useState(null);
    const [houseDetails, setHouseDetails] = useState(null);
    const [transformerCounter, setTransformerCounter] = useState(0);
    const [deletedNodes, setDeletedNodes] = useState([]);
    const [initialSubstationData, setInitialSubstationData] = useState(null);
    const [data, setData] = React.useState({
        "nodes": []
    }
    );

    useEffect(() => {
        if (selectedSubstationId) {
            const fetchSubstationData = async () => {
                try {
                    const data = await getSubstationById(selectedSubstationId);

                    setData(data);
                    setTransformerCounter(
                        data.nodes.filter((node) => node.type === "transformer").length
                    );
                    setInitialSubstationData(data);
                } catch (error) {
                    console.error("Error fetching substation data:", error);
                }
            };

            fetchSubstationData();
        }
    }, [selectedSubstationId]);

    const handleAddTransformer = () => {
        const transformerCount = data.nodes.filter(child => child.type === "transformer").length;
        const match = data.substation_name.match(/(\d+)$/);
        const grid = parseInt(match[1], 10);
        const newTransformer = {
            ids: `temp-${transformerCounter}`,
            id: `Transformer-${transformerCounter}`,
            label: `Transformer-${transformerCounter}`,
            color: "grey",
            type: "transformer",
            is_complete: false,
            new: true,
            action: "add",
            nomenclature: `T-${grid}.${transformerCount+1}`,
            name: `T-${grid}.${transformerCount+1}`,
            children: [],
        };

        setData((prevState) => ({
            ...prevState,
            nodes: [...prevState.nodes, newTransformer],
        }));
        setTransformerCounter(transformerCounter + 1);
    };

    const handleDeleteHouse = (houseId) => {
        setData(prevData => {
            const deleteHouseRecursive = (nodes) => {
                return nodes.map(node => {
                    if (node.children) {
                        return {
                            ...node,
                            children: deleteHouseRecursive(node.children.filter(child => child.id !== houseId))
                        };
                    }
                    return node;
                });
            };

            return {
                ...prevData,
                nodes: deleteHouseRecursive(prevData.nodes)
            };
        });
    };

    const handleAddHouse = (transformerId) => {
        const addHouseRecursive = (node) => {
            if (node.id === transformerId) {
                const houseCount = node.children.filter(child => child.type === "house").length;
                let prev_nomenclature = node.nomenclature.split('-')[1];
                const newHouse = {
                    id: crypto.randomUUID(),
                    type: "house",
                    is_complete: false,
                    new: true,
                    nomenclature: `H.${prev_nomenclature}.${houseCount + 1}`,
                    name: `H.${prev_nomenclature}.${houseCount + 1}`,
                    children: null,
                };
                return {
                    ...node,
                    children: [...node.children, newHouse],
                };
            }
            if (node.children && node.children.length > 0) {
                return {
                    ...node,
                    children: node.children.map(addHouseRecursive),
                };
            }
            return node;
        };

        setData((prevState) => ({
            ...prevState,
            nodes: prevState.nodes.map(addHouseRecursive),
        }));
    };

    const handleDeleteTransformer = (transformerId) => {
        const deleteTransformerRecursive = (node) => {
            if (node.children && node.children.some((sub) => sub.id === transformerId)) {
                return {
                    ...node,
                    children: node.children.filter(
                        (sub) => sub.id !== transformerId
                    ),
                };
            }
            if (node.children && node.children.length > 0) {
                return {
                    ...node,
                    children: node.children.map(deleteTransformerRecursive),
                };
            }
            return node;
        };

        setData((prevState) => ({
            ...prevState,
            nodes: prevState.nodes
                .filter((t) => t.id !== transformerId)
                .map(deleteTransformerRecursive),
        }));
    };

    const handleAddSubTransformer = (transformerId) => {
        const addSubTransformerRecursive = (node) => {
            if (node.id === transformerId) {
                const transformerCount = node.children.filter(child => child.type === "transformer").length;
                const prev_nomenclature = node.nomenclature.split('-')[1];
                const newSubTransformer = {
                    id: crypto.randomUUID(),
                    type: "transformer",
                    color:"grey",
                    is_complete: false,
                    nomenclature: `T-${prev_nomenclature}.${transformerCount + 1}`,
                    name: `T-${prev_nomenclature}.${transformerCount + 1}`,
                    children: [],
                };
                return {
                    ...node,
                    children: [...node.children, newSubTransformer],
                };
            }
            if (node.children && node.children.length > 0) {
                return {
                    ...node,
                    children: node.children.map(addSubTransformerRecursive),
                };
            }
            return node;
        };

        setData((prevState) => ({
            ...prevState,
            nodes: prevState.nodes.map(addSubTransformerRecursive),
        }));
    };

    const handleCancel = () => {
        setData(initialSubstationData);
        setDeletedNodes([]);
        setTransformerDetails(null);
        setHouseDetails(null);
    };

    const handleCloseTransformerForm = () => {
        setTransformerDetails(null);
    };

    const handleTransformerSave = (updatedTransformer) => {
        setTransformerDetails(null);
    };

    const handleSaveTopology = async () => {
        const compareNodes = (currentNode, initialNode) => {
            if (!initialNode) {
                return { type: currentNode.type, action: 'add', children: currentNode.children ? currentNode.children.map(child => compareNodes(child, null)) : null };
            }

            if (!currentNode) {
                return { id: initialNode.id, type: initialNode.type, action: 'delete' };
            }
            const hasChanges = currentNode.nomenclature !== initialNode.nomenclature ||
                currentNode.name !== initialNode.name ||
                currentNode.is_complete !== initialNode.is_complete;

            const updatedChildren = [];
            const initialChildrenMap = new Map(initialNode.children ? initialNode.children.map(child => [child.id, child]) : []);

            if (currentNode.children) {
                for (const child of currentNode.children) {
                    const initialChild = initialChildrenMap.get(child.id);
                    const comparedChild = compareNodes(child, initialChild);
                    if (comparedChild) {
                        updatedChildren.push(comparedChild);
                    }
                    initialChildrenMap.delete(child.id);
                }
            }

            for (const [, removedChild] of initialChildrenMap) {
                updatedChildren.push({ id: removedChild.id, type: removedChild.type, action: 'delete' });
            }

            if (hasChanges || updatedChildren.length > 0) {
                return {
                    id: currentNode.id,
                    type: currentNode.type,
                    action: 'update',
                    children: updatedChildren.length > 0 ? updatedChildren : undefined
                };
            }

            return null;
        };

        const findDeletedNodes = (currentNodes, initialNodes) => {
            const currentNodeIds = new Set(currentNodes.map(node => node.id));
            return initialNodes.filter(node => !currentNodeIds.has(node.id))
                .map(node => ({ id: node.id, type: node.type, action: 'delete' }));
        };

        const updatedData = {
            nodes: [
                ...data.nodes.map(node => compareNodes(node, initialSubstationData.nodes.find(n => n.id === node.id))).filter(Boolean),
                ...findDeletedNodes(data.nodes, initialSubstationData.nodes)
            ]
        };

        try {
            await updateSubstationTopology(selectedSubstationId, updatedData);
            const data = await getSubstationById(selectedSubstationId);
            setData(data);
            setInitialSubstationData(data);
        } catch (error) {
            console.error('Error updating topology:', error);
        }
    };

    const handleTransformerEdit = (transformerDetails) => {
        setTransformerDetails(transformerDetails);
        setHouseDetails(null);
    };

    const handleHouseEdit = (houseDetails) => {
        setHouseDetails(houseDetails);
        setTransformerDetails(null);
    };

    const handleCloseHouseForm = () => {
        setHouseDetails(null);
    };

    const handleHouseSave = (updatedHouse) => {
        setHouseDetails(null);
      };
    

    return (
        <>
            <Navbar />
            <div className="flex">
                <GridSideBar
                    onGridSelect={setSelectedSubstationId}
                    selectedGridId={selectedSubstationId}
                />
                <div className="flex-1 p-4">
                    {data && (
                        <>
                            <div className="flex gap-2 mb-4">
                                <button
                                    className="cursor-pointer border px-2 py-1"
                                    onClick={handleSaveTopology}
                                >
                                    Save
                                </button>
                                <button
                                    className="cursor-pointer border px-2 py-1"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                            <NetworkGraph2
                                data={data}
                                onAddTransformer={handleAddTransformer}
                                onAddHouse={handleAddHouse}
                                onDeleteTransformer={handleDeleteTransformer}
                                onAddSubTransformer={handleAddSubTransformer}
                                onDeleteHouse={handleDeleteHouse}
                                onTransformerEdit={handleTransformerEdit}
                                onHouseEdit={handleHouseEdit}
                            />
                        </>
                    )}
                    {transformerDetails && 
                        <TransformerForm
                            transformer={transformerDetails}
                            onSave={handleTransformerSave}
                            onClose={handleCloseTransformerForm}
                        />
                    }
                    {houseDetails && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-4 rounded">
                                <span
                                    className="cursor-pointer float-right"
                                    onClick={handleCloseHouseForm}
                                >
                                    Close
                                </span>
                                <HouseForm house={houseDetails} onSave={handleHouseSave} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};




export default NetworkTopology;