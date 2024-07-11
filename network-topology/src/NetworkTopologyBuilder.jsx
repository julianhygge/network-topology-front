import React, { useState, useEffect,} from "react";
import NetworkGraph from "./components/NetworkGraph";
import TransformerForm from "./components/TransformerForm";
import HouseForm from "./components/HouseForm";
import { getSubstationById, updateSubstationTopology } from "./services/Substation";
import GridSideBar from "./components/GridSideBar";
import "./App.css";
import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";


const NetworkTopologyBuilder = () => {
  const location = useLocation();
  const [selectedSubstationId, setSelectedSubstationId] = useState(location.state?.substationId || null);
  //const [selectedSubstationId, setSelectedSubstationId] = useState(null);
  const [substationData, setSubstationData] = useState({ nodes: [], links: [] });
  const [transformerDetails, setTransformerDetails] = useState(null);
  const [houseDetails, setHouseDetails] = useState(null);
  const [transformerCounter, setTransformerCounter] = useState(0);
  const [deletedNodes, setDeletedNodes] = useState([]);
  const [initialSubstationData, setInitialSubstationData] = useState(null);

  useEffect(() => {
    if (selectedSubstationId) {
      const fetchSubstationData = async () => {
        try {
          const data = await getSubstationById(selectedSubstationId);
          console.log("Fetched substation data:", data);

          const buildGraphData = (nodes, parentId = null) => {
            return nodes.reduce(
              (acc, node) => {
                const newNode = {
                  ids: node.id,
                  id: node.type === 'transformer' ? `Transformer-${node.id}` : `House-${node.id}`,
                  label: node.type === 'transformer' ? `Transformer-${node.id}` : `House-${node.id}`,
                  color: node.is_complete ? 'green' : 'black',
                  type: node.type,
                  children: node.children || [],
                };

                if (parentId) {
                  acc.links.push({ source: parentId, target: newNode.id });
                }

                acc.nodes.push(newNode);
                if (node.children && node.children.length) {
                  const childGraphData = buildGraphData(node.children, newNode.id);
                  acc.nodes = acc.nodes.concat(childGraphData.nodes);
                  acc.links = acc.links.concat(childGraphData.links);
                }

                return acc;
              },
              { nodes: [], links: [] }
            );
          };

          const graphData = buildGraphData(data.nodes);

          console.log("Graph data being set:", graphData);
          setSubstationData(graphData);
          setTransformerCounter(data.nodes.filter(node => node.type === 'transformer').length);
          setInitialSubstationData(graphData);
        } catch (error) {
          console.error("Error fetching substation data:", error);
        }
      };

      fetchSubstationData();
    }
  }, [selectedSubstationId]);
  useEffect(() => {
    if (location.state?.substationId) {
      setSelectedSubstationId(location.state.substationId);
    }
  }, [location.state]);


  const handleSaveTopology = async () => {
    try {
      
      const updatedData = { ...substationData, deletedNodes };
      console.log('updated data',updatedData)
      await updateSubstationTopology(selectedSubstationId, updatedData);

      const newData = await getSubstationById(selectedSubstationId);

      const buildGraphData = (nodes, parentId = null) => {
        return nodes.reduce(
          (acc, node) => {
            const newNode = {
              ids: node.id,
              id: node.type === 'transformer' ? `Transformer-${node.id}` : `House-${node.id}`,
              label: node.type === 'transformer' ? `Transformer-${node.id}` : `House-${node.id}`,
              color: node.is_complete ? 'green' : 'black',
              type: node.type,
              children: node.children || [],
            };

            if (parentId) {
              acc.links.push({ source: parentId, target: newNode.id });
            }

            acc.nodes.push(newNode);
            if (node.children && node.children.length) {
              const childGraphData = buildGraphData(node.children, newNode.id);
              acc.nodes = acc.nodes.concat(childGraphData.nodes);
              acc.links = acc.links.concat(childGraphData.links);
            }

            return acc;
          },
          { nodes: [], links: [] }
        );
      };

      const graphData = buildGraphData(newData.nodes);

      console.log("Graph data being set:", graphData);
      setSubstationData(graphData);
      setTransformerCounter(newData.nodes.filter(node => node.type === 'transformer').length);
      setInitialSubstationData(graphData);
      setDeletedNodes([]);
    } catch (error) {
      console.error("Error saving substation topology:", error);
    }
  };

  const handleTransformerSave = (updatedTransformer) => {
    setSubstationData((prevData) => {
      const updatedNodes = prevData.nodes.map((node) => {
        if (node.ids === updatedTransformer.id) {
          return {
            ...node,
            color: updatedTransformer.is_complete ? "green" : "black",
          };
        }
        return node;
      });
      return { ...prevData, nodes: updatedNodes };
    });
    setTransformerDetails(null);
  };

  const handleHouseSave = (updatedHouse) => {
    setSubstationData((prevData) => {
      const updatedNodes = prevData.nodes.map((node) => {
        if (node.ids === updatedHouse.id) {
          return {
            ...node,
            color: updatedHouse.is_complete ? "green" : "black",
          };
        }
        return node;
      });
      return { ...prevData, nodes: updatedNodes };
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

  
  const addTransformer = (parentTransformerId = null) => {
    const newTransformer = {
      ids: `temp-${transformerCounter}`,
      id: `Transformer-${transformerCounter}`,
      label: `Transformer-${transformerCounter}`,
      color: "grey",
      type: 'transformer',
      is_complete: false,
      action: "add",
      children: [], 
    };
  
    setSubstationData((prevData) => {
      const updatedNodes = [...prevData.nodes, newTransformer];
      const updatedLinks = [...prevData.links];
  
      if (parentTransformerId) {

        const parentTransformerIndex = prevData.nodes.findIndex(node => node.id === parentTransformerId);
        if (parentTransformerIndex !== -1) {

          prevData.nodes[parentTransformerIndex].children.push(newTransformer);
          updatedLinks.push({ source: parentTransformerId, target: newTransformer.id });
        }
      }
  
      return { ...prevData, nodes: updatedNodes, links: updatedLinks };
    });
  
    setTransformerCounter(transformerCounter + 1);
  };
  
  const addHouse = (transformerId) => {
    setSubstationData((prevData) => {
      const transformerNode = prevData.nodes.find(node => node.id === transformerId);
      if (!transformerNode) return prevData;
  
      const newHouse = {
        ids: `temp-house-${transformerId}-${transformerNode.children.length}`,
        id: `House-${transformerId}-${transformerNode.children.length}`,
        label: `House-${transformerId}-${transformerNode.children.length}`,
        color: "grey",
        type: 'house',
        is_complete: false,
        action: "add",
        x: transformerNode.x || 0,
        y: transformerNode.y || 0,
      };
  
      const updatedNodes = [...prevData.nodes, newHouse];
      const updatedLinks = [...prevData.links, { source: transformerId, target: newHouse.id }];
  

      const transformerIndex = updatedNodes.findIndex(node => node.id === transformerId);
      if (transformerIndex !== -1) {
        updatedNodes[transformerIndex].children.push(newHouse);
      }
  
      return { ...prevData, nodes: updatedNodes, links: updatedLinks };
    });
  };
  


  const deleteNode = (nodeId) => {
    setSubstationData((prevData) => {
      const nodeToDelete = prevData.nodes.find((node) => node.id === nodeId);
  
      if (nodeToDelete) {

        const nodesToDelete = [];
        const collectNodesToDelete = (node) => {
          nodesToDelete.push(node.id);
          if (node.children) {
            node.children.forEach((child) => collectNodesToDelete(child));
          }
        };
        collectNodesToDelete(nodeToDelete);
  

        setDeletedNodes((prevDeleted) => [
          ...prevDeleted,
          ...nodesToDelete.map((id) => ({ id:nodeToDelete.ids, type: nodeToDelete.type })),
        ]);
  

        const removeNodesRecursively = (nodes, nodeIdsToDelete) => {
          return nodes.filter((node) => {
            if (nodeIdsToDelete.includes(node.id)) return false;
            if (node.children) {
              node.children = removeNodesRecursively(node.children, nodeIdsToDelete);
            }
            return true;
          });
        };
  

        const updatedNodes = removeNodesRecursively(prevData.nodes, nodesToDelete);
        const updatedLinks = prevData.links.filter(
          (link) => !nodesToDelete.includes(link.source) && !nodesToDelete.includes(link.target)
        );
  
        return { ...prevData, nodes: updatedNodes, links: updatedLinks };
      }
      return prevData;
    });
  };
  
  
  
  const handleCancel = () => {
    setSubstationData(initialSubstationData);
    setDeletedNodes([]);
    setTransformerDetails(null);
    setHouseDetails(null);
  };

  return (
    <>
  <Navbar />
  <div className="flex">
    <GridSideBar onGridSelect={setSelectedSubstationId} />
    <div className="flex-1 p-4">
      {substationData && (
        <>
          <div className="flex gap-2 mb-4">
            <button className="cursor-pointer border px-2 py-1" onClick={handleSaveTopology}>
              Save
            </button>
            <button className="cursor-pointer border px-2 py-1" onClick={handleCancel}>
              Cancel
            </button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <button className="cursor-pointer border px-2 py-1" onClick={() => addTransformer(null)}>
              Add Transformer
            </button>
            <span>Transformers: {transformerCounter}</span>
          </div>
          <NetworkGraph
            data={substationData}
            onTransformerEdit={handleTransformerEdit}
            onHouseEdit={handleHouseEdit}
            addHouse={addHouse}
            deleteNode={deleteNode}
            addTransformer={addTransformer}
            deletedNodes={deletedNodes}
          />
        </>
      )}
      {transformerDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded">
            <span className="cursor-pointer float-right" onClick={handleCloseTransformerForm}>
              Close
            </span>
            <TransformerForm transformer={transformerDetails} onSave={handleTransformerSave} />
          </div>
        </div>
      )}
      {houseDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded">
            <span className="cursor-pointer float-right" onClick={handleCloseHouseForm}>
              Close
            </span>
            <HouseForm house={houseDetails} selectedGridId={selectedSubstationId} onSave={handleHouseSave} />
          </div>
        </div>
      )}
    </div>
  </div>
</>

  );
};

export default NetworkTopologyBuilder;
