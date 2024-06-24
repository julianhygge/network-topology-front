import React, { useState, useEffect } from "react";
import SubstationSelector from "./components/SubstationSelector";
import NetworkGraph from "./components/NetworkGraph";
import TransformerForm from "./components/TransformerForm";
import HouseForm from "./components/HouseForm";
import {
  getSubstationById,
  updateSubstationTopology,
} from "./services/Substation";
import "./App.css";

const NetworkTopologyBuilder = () => {
  const [selectedSubstationId, setSelectedSubstationId] = useState(null);
  const [substationData, setSubstationData] = useState({
    nodes: [],
    links: [],
  });
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

          const graphData = {
            nodes: [],
            links: [],
          };

          data.transformers.forEach((transformer, index) => {
            const transformerNode = {
              ids: transformer.id,
              id: `Transformer-${index}`,
              label: `Transformer-${index}`,
              color: transformer.is_complete ? "green" : "black",
              houses_details: transformer.houses_details || [],
            };
            graphData.nodes.push(transformerNode);

            transformer.houses_details.forEach((house, houseIndex) => {
              const houseNode = {
                ids: house.id,
                id: `House-${index}-${houseIndex}`,
                label: `House-${index}-${houseIndex}`,
                color: house.is_complete ? "green" : "black",
              };
              graphData.nodes.push(houseNode);

              graphData.links.push({
                source: transformerNode.id,
                target: houseNode.id,
              });
            });
          });

          console.log("Graph data being set:", graphData);
          setSubstationData(graphData);
          setTransformerCounter(data.transformers.length);
          setInitialSubstationData(graphData);
          
        } catch (error) {
          console.error("Error fetching substation data:", error);
        }
      };

      fetchSubstationData();
    }
  }, [selectedSubstationId]);

  const handleSaveTopology = async () => {
    try {
      const updatedData = { ...substationData, deletedNodes };
      await updateSubstationTopology(selectedSubstationId, updatedData);

      const newData = await getSubstationById(selectedSubstationId);

      const graphData = {
        nodes: [],
        links: [],
      };

      newData.transformers.forEach((transformer, index) => {
        const transformerNode = {
          ids: transformer.id,
          id: `Transformer-${index}`,
          label: `Transformer-${index}`,
          color: transformer.is_complete ? "green" : "black",
          houses_details: transformer.houses_details || [],
        };
        graphData.nodes.push(transformerNode);

        transformer.houses_details.forEach((house, houseIndex) => {
          const houseNode = {
            ids: house.id,
            id: `House-${index}-${houseIndex}`,
            label: `House-${index}-${houseIndex}`,
            color: house.is_complete ? "green" : "black",
          };
          graphData.nodes.push(houseNode);

          graphData.links.push({
            source: transformerNode.id,
            target: houseNode.id,
          });
        });
      });

      setSubstationData(graphData);
      setTransformerCounter(newData.transformers.length);
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
            color: updatedHouse.is_complete ? "green" : "black",
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

  const addTransformer = () => {
    const newTransformer = {
      ids: `temp-${transformerCounter}`,
      id: `Transformer-${transformerCounter}`,
      label: `Transformer-${transformerCounter}`,
      color: "grey",
      houses_details: [],
      is_complete: false,
    };

    setSubstationData((prevData) => ({
      ...prevData,
      nodes: [...prevData.nodes, newTransformer],
    }));

    setTransformerCounter(transformerCounter + 1);
  };

  const addHouse = (transformerId) => {
    const transformerIndex = transformerId.split("-")[1];
    const houseCount = substationData.nodes.filter((node) =>
      node.id.includes(`House-${transformerIndex}`)
    ).length;

    setSubstationData((prevData) => {
      const newHouse = {
        ids: `temp-house-${transformerIndex}-${houseCount}`,
        id: `House-${transformerIndex}-${houseCount}`,
        label: `House-${transformerIndex}-${houseCount}`,
        color: "grey",
        is_complete: false,
      };

      const updatedNodes = [...prevData.nodes, newHouse];
      const updatedLinks = [
        ...prevData.links,
        {
          source: transformerId,
          target: newHouse.id,
        },
      ];

      return {
        ...prevData,
        nodes: updatedNodes,
        links: updatedLinks,
      };
    });
  };

  const deleteNode = (nodeId) => {
    console.log(nodeId);
    setSubstationData((prevData) => {
      const nodeToDelete = prevData.nodes.find((node) => node.id === nodeId);

      if (nodeToDelete) {
        setDeletedNodes((prevDeleted) => {
          const updatedDeleted = [...prevDeleted, nodeToDelete.ids];
          return updatedDeleted;
        });

        const updatedNodes = prevData.nodes.filter(
          (node) => node.id !== nodeId
        );
        const updatedLinks = prevData.links.filter(
          (link) => link.source !== nodeId && link.target !== nodeId
        );

        return {
          ...prevData,
          nodes: updatedNodes,
          links: updatedLinks,
        };
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
    <div>
      <SubstationSelector setSelectedSubstation={setSelectedSubstationId} />
      {substationData && (
        <>
          <button className="ml-[700px] cursor-pointer border" onClick={handleSaveTopology}>
            Save
          </button>
          <button className="ml-[700px] cursor-pointer border mt-5" onClick={handleCancel}>
            Cancel
          </button>
          <div className="counter">
            <button className="border" onClick={addTransformer}>Add Transformer</button>
            <span>Transformers: {transformerCounter}</span>
          </div>
          <NetworkGraph
            data={substationData}
            onTransformerEdit={handleTransformerEdit}
            onHouseEdit={handleHouseEdit}
            addHouse={addHouse}
            deleteNode={deleteNode}
          />
        </>
      )}
      {transformerDetails && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseTransformerForm}>
              Close
            </span>
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
            <span className="close" onClick={handleCloseHouseForm}>
              Close
            </span>
            <HouseForm house={houseDetails} onSave={handleHouseSave} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkTopologyBuilder;
