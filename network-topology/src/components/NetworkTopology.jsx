import React, { useEffect, useState } from 'react';
import NetworkGraph from './NetworkGraph';
import NetworkGraph2 from './NetworkGraph2';
import Navbar from './Navbar';
import GridSideBar from './GridSideBar';
import { useLocation } from "react-router-dom";
import { getSubstationById, updateSubstationTopology } from '../services/Substation';
import { fetchTransformerDetails } from '../services/Tranformer';
import { fetchHouseDetails } from '../services/House';
import TransformerForm from "./TransformerForm";
import HouseForm from './HouseForm';
import Breadcrumb from './Breadcrumb';
import Delete from './DeleteConfirm';


const NetworkTopology = () => {
    const location = useLocation();
    const [selectedSubstationId, setSelectedSubstationId] = useState(
        location.state?.substationId || null
    );
    const [selectedNode, setSelectedNode] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [transformerDetails, setTransformerDetails] = useState(null);
    const [houseDetails, setHouseDetails] = useState(null);
    const [transformerCounter, setTransformerCounter] = useState(0);
    const [deletedNodes, setDeletedNodes] = useState([]);
    const [nodeToDelete, setNodeToDelete] = useState(null);
    const [nodeToDeleteName, setNodeToDeleteName] = useState(null);
    const [nodeType, setNodeType] = useState(null);
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
            setSelectedNode(null);
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
        setNodeToDelete(transformerId);
        setShowDeletePopup(true);
    };

    const handleAddSubTransformer = (transformerId) => {
        const addSubTransformerRecursive = (node) => {
            if (node.id === transformerId) {
                const transformerCount = node.children.filter(child => child.type === "transformer").length;
                const prev_nomenclature = node.nomenclature.split('-')[1];
                const newSubTransformer = {
                    id: crypto.randomUUID(),
                    type: "transformer",
                    new:true,
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
        setData((prevData) => {
            const updatedNodes = prevData.nodes.map((node) => {
              if (node.id === updatedTransformer.id) {
                const updatedNode = {
                    ...node,
                    is_complete: updatedTransformer.is_complete,
                    color: updatedTransformer.is_complete ? "green" : "black",
                }
                console.log("updated Node: ", updatedNode);
                return updatedNode;
              }
              return node;
            });
            const newNodeData = {...prevData, nodes:updatedNodes};
            console.log("new node data: ", newNodeData);
            return newNodeData;
          });
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
    
      const handleEditNode = async(node) => {
        console.log("node: ", node);
        if (node.nomenclature.startsWith("T")) {
            console.log("transformer node");
            const transformerDetails = await fetchTransformerDetails(node.id);
            handleTransformerEdit(transformerDetails);
        } else if (node.nomenclature.startsWith("H")) {
            // TODO: make and implement the house form like transformer form
            console.log("house node");
            // const houseDetails = await fetchHouseDetails(node.id);
            // handleHouseEdit(houseDetails);
        }
    };

    const handleDelete = async() => {
        const payload = {
            "nodes": [
              {
                "id": nodeToDelete,
                "action": "delete",
                "type": nodeType
              }
            ]
        }
        try {
            await updateSubstationTopology(selectedSubstationId, payload);
            const data = await getSubstationById(selectedSubstationId);
            setData(data);
        } catch (error) {
            console.error('Error updating topology:', error);
        }
        setShowDeletePopup(false);
        setNodeToDelete(null);
        setNodeToDeleteName(null);
        setNodeType(null);
    };

    const handleSelectedNode = (node) => {
        setSelectedNode(node);
    };

    const handleRightClickSelectedNode = (node) => {
        console.log("right click node: ", node);
        setSelectedNode(node);
        if(node.name && node.name != node.nomenclature){
            setNodeToDeleteName(node.name + " " + node.nomenclature);
        }else{
            setNodeToDeleteName(node.nomenclature);
        }
        setNodeType(node.type);
    }

    const handleCloseDeletePopup = () => {
        setShowDeletePopup(false);
        setNodeToDelete(null);
        setNodeToDeleteName(null);
        setNodeType(null);
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
                            <div className="flex justify-between">
                            {selectedSubstationId && !selectedNode && <Breadcrumb nodeId={selectedSubstationId} onEditNode={handleEditNode} />}
                                {selectedNode && <Breadcrumb nodeId={selectedNode.id} onEditNode={handleEditNode} />}
                                <div className='flex mb-6 gap-2 justify-end'>
                                <button
                                    className="cursor-pointer  border px-9 py-1 items-end bg-[#49AC82] rounded-2xl text-white w-[120] border-[#49AC82]"
                                    onClick={handleSaveTopology}
                                >
                                    SAVE
                                </button>
                                <button
                                     className="cursor-pointer  border px-7 py-1 items-end bg-[#49AC82] rounded-2xl text-white w-[120] border-[#49AC82]"
                                     onClick={handleCancel}
                                >
                                    CANCEL
                                </button>
                                </div>
                            </div>
                            <NetworkGraph2
                                onSelectedNode={handleSelectedNode}
                                onRightClickSelectedNode={handleRightClickSelectedNode}
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
                    {showDeletePopup && (
                        <Delete
                        onClose={handleCloseDeletePopup}
                        onConfirm={handleDelete}
                        entityName={nodeToDeleteName}
                        entityType={nodeType}
                        />
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
                                <HouseForm 
                                house={houseDetails} 
                                onSave={handleHouseSave} 
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};




export default NetworkTopology;