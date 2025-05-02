import React, { useEffect, useState } from "react";
import NetworkGraph from "components/Network/NetworkGraph";
import { NODE_STATUS } from "components/Network/NetworkUtils";
import Navbar from "components/Common/Navbar";
import GridSideBar from "components/Grid/GridSideBar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getSubstationById,
  updateSubstationTopology,
} from "services/Substation";
import { fetchTransformerDetails } from "services/Transformer";
import TransformerForm from "components/Transformer/TransformerForm";
import HouseForm from "components/House/HouseForm";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import Delete from "components/Common/DeleteConfirm";

// Helper function to generate nomenclature for a new transformer
const generateTransformerNomenclature = (parentNode, existingSiblings) => {
  const transformerCount = existingSiblings.filter(
    (child) => child.type === "transformer"
  ).length;

  let parentPrefix;
  if (parentNode.substation_name) {
    const match = parentNode.substation_name.match(/(\d+)$/);
    parentPrefix = match ? match[1] : 'X';
  } else if (parentNode.nomenclature && parentNode.type === "transformer") {
    parentPrefix = parentNode.nomenclature.split("-")[1];
  } else {
    console.error("Cannot determine parent prefix for transformer nomenclature:", parentNode);
    parentPrefix = 'UNKNOWN';
  }

  return `T-${parentPrefix}.${transformerCount + 1}`;
};

// Helper function to generate nomenclature for a new house
const generateHouseNomenclature = (parentNode, existingSiblings) => {
  if (!parentNode.nomenclature || parentNode.type !== "transformer") {
     console.error("Cannot generate house nomenclature for non-transformer parent:", parentNode);
     return `H-UNKNOWN.1`;
  }
  const houseCount = existingSiblings.filter(
    (child) => child.type === "house"
  ).length;
  const parentNomenclaturePart = parentNode.nomenclature.split("-")[1];
  return `H.${parentNomenclaturePart}.${houseCount + 1}`;
};
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
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [nodeToDeleteName, setNodeToDeleteName] = useState(null);
  const [nodeType, setNodeType] = useState(null);
  const [initialSubstationData, setInitialSubstationData] = useState(null);
  const [data, setData] = React.useState({
    nodes: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedSubstationId) return;
    // Fetch substation data when a substation is selected
    const fetchSubstationData = async () => {
      try {
        const data = await getSubstationById(selectedSubstationId);

        setData(data);
        setTransformerCounter(
          data.nodes.filter((node) => node.type === "transformer").length
        );
        setInitialSubstationData(data);
        setSelectedNode(null);
        if (location.state?.substationId !== selectedSubstationId) {
          navigate(location.pathname, { replace: true });
        }
      } catch (error) {
        console.error("Error fetching substation data:", error);
        setSelectedNode(null);
      }
    };
    fetchSubstationData();
  }, [selectedSubstationId]);

  // Clear the location.state used for the breadcrumb when a new node is selected
  useEffect(() => {
    if (!selectedNode) return;
    navigate(location.pathname, { replace: true })
  }, [selectedNode])

  const handleAddTransformer = () => {
    const newNomenclature = generateTransformerNomenclature(data, data.nodes);
    const newTransformer = {
      ids: `temp-${transformerCounter}`,
      id: `Transformer-${transformerCounter}`,
      label: newNomenclature,
      type: "transformer",
      status: NODE_STATUS.EMPTY,
      new: true,
      action: "add",
      nomenclature: newNomenclature,
      name: newNomenclature,
      children: [],
    };

    setData((prevState) => ({
      ...prevState,
      nodes: [...prevState.nodes, newTransformer],
    }));
    setTransformerCounter(transformerCounter + 1);
  };
  // Deletes a house node from the network
  const handleDeleteHouse = (house, newHouse) => {
    // Recursive function to delete a house from the nodes array
    const deleteHouseRecursive = (nodes, parentId, houseId) => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: node.children
              ? node.children.filter((child) => child.id !== houseId)
              : [],
          };
        } else if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: deleteHouseRecursive(node.children, parentId, houseId),
          };
        }
        return node;
      });
    };

    if (newHouse) {
      // Delete the house if it's newly added and not saved yet
      const updatedNodes = deleteHouseRecursive(
        data.nodes,
        house.parentId,
        house.id
      );
      setData((prevState) => ({
        ...prevState,
        nodes: updatedNodes,
      }));
    } else {
      setNodeToDelete(house.id);
      setShowDeletePopup(true);
    }
  };

  // Adds a new house under a transformer
  const handleAddHouse = (transformerId) => {
    // Recursive function to add a house to a specific transformer
    const addHouseRecursive = (node) => {
      if (node.id === transformerId) {
        const newNomenclature = generateHouseNomenclature(node, node.children);
        const newHouse = {
          id: crypto.randomUUID(),
          type: "house",
          status: NODE_STATUS.EMPTY,
          new: true,
          nomenclature: newNomenclature,
          name: newNomenclature,
          children: null,
          parentId: transformerId,
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
  // Deletes a transformer node from the network
  const handleDeleteTransformer = (transformerId, newTransformer) => {
    const deleteTransformerRecursive = (nodes, transformId) => {
      return nodes
        .filter((node) => node.id !== transformId)
        .map((node) => ({
          ...node,
          children: node.children
            ? deleteTransformerRecursive(node.children, transformId)
            : [],
        }));
    };

    if (newTransformer) {
      // Delete the transformer if it's newly added and not saved yet
      const updatedNodes = deleteTransformerRecursive(
        data.nodes,
        transformerId
      );
      setData((prevState) => ({
        ...prevState,
        nodes: updatedNodes,
      }));
    } else {
      setNodeToDelete(transformerId);
      setShowDeletePopup(true);
    }
  };

  // Adds a sub-transformer under a transformer
  const handleAddSubTransformer = (transformerId) => {
    const addSubTransformerRecursive = (node) => {
      if (node.id === transformerId) {
        const newNomenclature = generateTransformerNomenclature(node, node.children);
        const newSubTransformer = {
          id: crypto.randomUUID(),
          type: "transformer",
          new: true,
          status: NODE_STATUS.EMPTY,
          nomenclature: newNomenclature,
          name: newNomenclature,
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

  const handleCloseTransformerForm = () => {
    setTransformerDetails(null);
  };

  // Helper function to update a node anywhere in the nested structure
  const updateNode = (id, updater) => {
    const search = (node) => {
      if (!node) return;
      if (node.id === id) {
        updater(node);
        return;
      }
      if (!node.children) return;
      node.children.forEach(element => {
        search(element)
      });
    }
    setData((prev) => {
      const prevData = { children: prev.nodes };
      search(prevData);
      return { ...prev };
    })
  }

  // Saves changes to a transformer and updates its state
  const handleTransformerSave = (updatedTransformer) => {
    console.log("handle transformer save: ", updatedTransformer)
    const updateTransformerStatus = (node) => {
      node.status = updatedTransformer.status;
    }
    updateNode(updatedTransformer.id, updateTransformerStatus);
    setTransformerDetails(null);
  };
  // Saves the network topology to the server
  const handleSaveTopology = async () => {
    // Recursive function to compare current node state with initial state
    // and determine necessary actions (add, update, delete) for the API payload.
    const compareNodes = (currentNode, initialNode) => {
      if (!initialNode) {
        return {
          type: currentNode.type,
          action: "add",
          children: currentNode.children
            ? currentNode.children.map((child) => compareNodes(child, null))
            : null,
        };
      }

      if (!currentNode) {
        return { id: initialNode.id, type: initialNode.type, action: "delete" };
      }
      const hasChanges =
        currentNode.nomenclature !== initialNode.nomenclature ||
        currentNode.name !== initialNode.name ||
        currentNode.status !== initialNode.status;

      const updatedChildren = [];
      const initialChildrenMap = new Map(
        initialNode.children
          ? initialNode.children.map((child) => [child.id, child])
          : []
      );

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
        updatedChildren.push({
          id: removedChild.id,
          type: removedChild.type,
          action: "delete",
        });
      }

      if (hasChanges || updatedChildren.length > 0) {
        return {
          id: currentNode.id,
          type: currentNode.type,
          action: "update",
          children: updatedChildren.length > 0 ? updatedChildren : undefined,
        };
      }

      return null;
    };

    // Helper function to find nodes present in initialNodes but not in currentNodes
    const findDeletedNodes = (currentNodes, initialNodes) => {
      const currentNodeIds = new Set(currentNodes.map((node) => node.id));
      return initialNodes
        .filter((node) => !currentNodeIds.has(node.id))
        .map((node) => ({ id: node.id, type: node.type, action: "delete" }));
    };

    const updatedData = {
      nodes: [
        ...data.nodes
          .map((node) =>
            compareNodes(
              node,
              initialSubstationData.nodes.find((n) => n.id === node.id)
            )
          )
          .filter(Boolean),
        ...findDeletedNodes(data.nodes, initialSubstationData.nodes),
      ],
    };

    try {
      console.log("updated data: ", updatedData);
      await updateSubstationTopology(selectedSubstationId, updatedData);
      const data = await getSubstationById(selectedSubstationId);
      setData(data);
      setInitialSubstationData(data);
    } catch (error) {
      console.error("Error updating topology:", error);
    }
  };
  // Opens the transformer form for editing
  const handleTransformerEdit = (transformerDetails) => {
    setTransformerDetails(transformerDetails);
    setHouseDetails(null);
  };
  // Opens the house form for editing
  const handleHouseEdit = (houseDetails) => {
    setHouseDetails(houseDetails);
    setTransformerDetails(null);
};
const handleCloseHouseForm = () => {
    setHouseDetails(null);
  };
const handleHouseSave = (updatedHouse) => {
    // TODO: Implement logic to update the house data in the main state 'data'
    // For now, just closing the form. Consider updating local state optimistically.
    setHouseDetails(null);
  };
  // Handles node editing logic based on the node type
  const handleEditNode = async (node) => {
    console.log("node: ", node);
    if (node.nomenclature.startsWith("T")) {
      console.log("transformer node");
      const transformerDetails = await fetchTransformerDetails(node.id);
      handleTransformerEdit(transformerDetails);
    } else if (node.nomenclature.startsWith("H")) {
      // TODO: Implement house form fetching and display similar to transformer form
      console.log("house node");
      // const houseDetails = await fetchHouseDetails(node.id); // Example API call
      // handleHouseEdit(houseDetails); // Example state update
    }
  };
  // Deletes the selected node after confirmation
  const handleDelete = async () => {
    const payload = {
      nodes: [
        {
          id: nodeToDelete,
          action: "delete",
          type: nodeType,
        },
      ],
    };
    try {
      await updateSubstationTopology(selectedSubstationId, payload);
      const data = await getSubstationById(selectedSubstationId);
      setData(data);
    } catch (error) {
      console.error("Error updating topology:", error);
    }
    setShowDeletePopup(false);
    setNodeToDelete(null);
    setNodeToDeleteName(null);
    setNodeType(null);
    setSelectedNode(null);
  };

  const handleSelectedNode = (node) => {
    setSelectedNode(node);
  };
  // Handles right-click on a node to trigger delete action
  const handleRightClickSelectedNode = (node) => {
    console.log("right click node: ", node);
    setSelectedNode(node);
    if (node.name && node.name !== node.nomenclature) {
      setNodeToDeleteName(node.name + " " + node.nomenclature);
    } else {
      setNodeToDeleteName(node.nomenclature);
    }
    setNodeType(node.type);
  };
  // Closes the delete confirmation dialog
  const handleCloseDeletePopup = () => {
    setShowDeletePopup(false);
    setNodeToDelete(null);
    setNodeToDeleteName(null);
    setNodeType(null);
  };

  const renderBreadcrumb = () => {
    if (selectedNode && !selectedNode.new) {
      return (
        <Breadcrumb
          nodeId={selectedNode.id}
          onEditNode={handleEditNode}
        />
      )
    }
    if (!selectedNode && location.state?.houseId) {
      return (
        <Breadcrumb
          nodeId={location.state?.houseId}
          onEditNode={handleEditNode}
        />
      )
    }
    return (<>
      {selectedSubstationId && (!location.state?.houseId ||
        !selectedNode || selectedNode.new) && (
          <Breadcrumb
            nodeId={selectedSubstationId}
            onEditNode={handleEditNode}
          />
        )}
    </>
    )
  }

  return (
    <div className="full-container flex flex-col h-screen">
      <Navbar />
      <div className="topology-container flex flex-row flex-1 overflow-hidden">
        <div className="bg-sideBar h-full flex-shrink-0">
          <GridSideBar
            onGridSelect={setSelectedSubstationId}
            selectedGridId={selectedSubstationId}
          />
        </div>
        <div className="structure-container flex flex-col flex-1 overflow-hidden box-border w-full">
          {data && (
            <>
              <div className="flex justify-between items-center bg-breadcrumbBackgroundColor py-2 pr-[24px] flex-shrink-0">
                <div className="grow mt-[6px]">
                  {renderBreadcrumb()}
                </div>
                <div className="flex-none items-center justify-between font-dinPro font-medium">
                  <button
                    className="cursor-pointer border px-[65px] mt-[-12px] py-[8px] items-end bg-[#49AC82] rounded-3xl text-white text-lg font-sm w-[120] border-[#49AC82]"
                    onClick={handleSaveTopology}
                  >
                    SAVE
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto network-graph-container scrollbar">
                <NetworkGraph
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
              </div>
            </>
          )}
        </div>
        {showDeletePopup && (
          <Delete
            onClose={handleCloseDeletePopup}
            onConfirm={handleDelete}
            entity={selectedNode}
            entityId={nodeToDelete}
            entityName={nodeToDeleteName}
            entityType={nodeType}
          />
        )}
        {transformerDetails && (
          <TransformerForm
            transformer={transformerDetails}
            onSave={handleTransformerSave}
            onClose={handleCloseTransformerForm}
          />
        )}
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

  );
};

export default NetworkTopology;
