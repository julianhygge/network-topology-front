import React, { useEffect, useState } from "react";
import {
  getSubstations,
  generateSubstation,
  deleteSubstation,
} from "services/Substation";
import Delete from "components/Common/DeleteConfirm";
import "./GridSideBar.css"

const GridSideBar = ({ onGridSelect, selectedGridId }) => {
  const [grids, setGrids] = useState([]);
  const [selectedGrid, setSelectedGrid] = useState(selectedGridId || null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    grid: null,
  }); 
  const [showDeletePopup, setShowDeletePopup] = useState(false); 

  useEffect(() => {
    const fetchGrids = async () => {
      try {
        const data = await getSubstations();
        setGrids(data.items);

        if (!selectedGridId && data.items.length > 0) {
          const firstGridId = data.items[0].id;
          setSelectedGrid(firstGridId);
          onGridSelect(firstGridId);
        }
      } catch (error) {
        console.error("Error fetching substations:", error);
      }
    };

    fetchGrids();
  }, [selectedGridId, onGridSelect]); 

  // Handle clicks outside of the context menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu.visible && !event.target.closest(".context-menu")) {
        setContextMenu({ visible: false, x: 0, y: 0, grid: null });
      }
    };

    if (contextMenu.visible) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  // Add a new grid
  const handleAddGrid = async () => {
    try {
      const payload = {
        locality_id: "94522a0a-c8f1-40f8-a2e5-9aed2dc55555", 
        number_of_substations: 1,
      };

      const data = await generateSubstation(payload);
      setGrids(data.items);
    } catch (error) {
      console.error("Error generating substations:", error);
    }
  };

  // Handle grid click to select it
  const handleGridClick = (gridId) => {
    setSelectedGrid(gridId);
    onGridSelect(gridId);
  };

  // Handle right-click to show the context menu
  const handleContextMenu = (event, grid) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      grid: grid,
    });
  };

  // Confirm and delete the selected grid
  const handleConfirmDelete = async () => {
    if (!contextMenu.grid) return; // Ensure grid exists

    try {
      await deleteSubstation(contextMenu.grid.id);
      const remainingGrids = grids.filter((g) => g.id !== contextMenu.grid.id);
      setGrids(remainingGrids);

      // If the deleted grid was selected, select the first remaining grid or null
      if (selectedGrid === contextMenu.grid.id) {
        const newSelectedGridId = remainingGrids.length > 0 ? remainingGrids[0].id : null;
        setSelectedGrid(newSelectedGridId);
        onGridSelect(newSelectedGridId);
      }

      setContextMenu({ visible: false, x: 0, y: 0, grid: null });
      setShowDeletePopup(false);

    } catch (error) {
      console.error("Failed to delete substation:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col bg-sideBar h-full">
        <div className="flex-1 overflow-y-auto scrollbar">
          <div className="grid gap-y-5 pt-5"> 
            {grids.map((grid) => (
              <button
                key={grid.id}
                className={`flex flex-col items-center py-5 justify-center cursor-pointer w-full ${ 
                  selectedGrid === grid.id ? "bg-white" : ""
                }`}
                onClick={() => handleGridClick(grid.id)}
                onContextMenu={(event) => handleContextMenu(event, grid)}
              >
                <img
                  loading="lazy"
                  src={`${process.env.PUBLIC_URL}/images/GridImage.png`} 
                  alt="Grid Logo"
                  className="h-[52.81px] w-[46px]"
                />
                <span
                  className={`text-gridColor1 font-dinPro mt-1 ${ 
                    selectedGrid === grid.id
                      ? "text-brown font-bold" 
                      : ""
                  }`}
                >
                  {grid.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Add Grid button: positioned at the bottom within the flex column */}
        <div className="p-3 grid justify-center"> 
          <button
            className="grid justify-center cursor-pointer hover:opacity-50"
            onClick={handleAddGrid}
          >
            <p className="flex justify-center items-center bg-[#FFF8E6] w-[80px] h-[80px] rounded-full text-3xl text-gridColor1 border-2 border-[#D59805]"> {/* Made circular and adjusted size */}
              +
            </p>
            <p className="text-white text-sm mt-2 font-dinPro font-medium">
              Add Grid
            </p>
          </button>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed z-10 context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="p-2 bg-white text-[#F21818] rounded shadow-md hover:bg-gray-100" 
            onClick={() => {
              setShowDeletePopup(true);
              // Close context menu when delete popup opens
              setContextMenu({ visible: false, x: 0, y: 0, grid: null });
            }}
          >
            Delete
          </button>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && contextMenu.grid && (
        <Delete
          onConfirm={handleConfirmDelete}
          onClose={() => setShowDeletePopup(false)}
          entityType="grid"
          entityName={contextMenu.grid.name}
        />
      )}
    </>
  );
};

export default GridSideBar;
