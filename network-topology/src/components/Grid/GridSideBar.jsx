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
  }); // State to manage the context menu's visibility and position
  const [showDeletePopup, setShowDeletePopup] = useState(false); // State to manage the delete confirmation popup visibility

  useEffect(() => {
    const fetchGrids = async () => {
      try {
        const data = await getSubstations();
        setGrids(data.items);

        if (!selectedGridId && data.items.length > 0) {
          console.log("hello");
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

  useEffect(() => {
    if (selectedGridId) {
      setSelectedGrid(selectedGridId);
    }
  }, [selectedGridId]);

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

      const newSubstations = await generateSubstation(payload);
      // Add new substations to the existing list, ensuring no duplicates
      const uniqueSubstations = [
        ...grids,
        ...newSubstations.items.filter(
          (newSub) => !grids.some((existingSub) => existingSub.id === newSub.id)
        ),
      ];
      setGrids(uniqueSubstations);
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
    try {
      await deleteSubstation(contextMenu.grid.id);
      setGrids(grids.filter((g) => g.id !== contextMenu.grid.id));
      setContextMenu({ visible: false, x: 0, y: 0, grid: null });
      setShowDeletePopup(false);
      setSelectedGrid(null);
      onGridSelect(null);
    } catch (error) {
      console.error("Failed to delete substation:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col bg-sideBar w-[110px] h-full relative ">
          <div className="flex-1 overflow-hidden">
            <div className="h-[80vh] overflow-auto scrollbar">
              <div className="grid gap-y-5">
                {grids.map((grid) => {
                  return <button
                    key={grid.id
                    }
                    className={`flex flex-col  items-center py-5 justify-center cursor-pointer   ${selectedGrid === grid.id ? "bg-white  " : ""
                      }`}
                    onClick={() => handleGridClick(grid.id)}
                    onContextMenu={(event) => handleContextMenu(event, grid)}
                  >
                    <img
                      loading="lazy"
                      src="images/GridImage.png"
                      alt="Grid Logo"
                      className="h-[52.81px] w-[46px]  "
                    />
                    <span
                      className={`text-gridColor1   font-dinPro ${selectedGrid === grid.id
                        ? "text-brown font-bold font-dinPro"
                        : ""
                        }`}
                    >
                      {grid.name}
                    </span>
                  </button>
                })}
              </div>
            </div>
          </div>
          <button
            className="fixed bottom-3 left-3 grid justify-center cursor-pointer hover:opacity-50"
            onClick={handleAddGrid}
          >
            <p className="flex justify-center items-center bg-[#FFF8E6] w-[80px] rounded-[50px] text-3xl text-gridColor1 border-2 border-[#D59805] pb-1">
              +
            </p>
            <p className="text-white text-m mt-2 font-dinPro font-medium">
              Add Grid
            </p>
          </button>
        </div>
      </div>
      {
        contextMenu.visible && (
          <div
            className="fixed z-10 context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              className="p-2 bg-white text-[#F21818] rounded"
              onClick={() => setShowDeletePopup(true)}
            >
              Delete
            </button>
          </div>
        )
      }
      {
        showDeletePopup && contextMenu.grid && (
          <Delete
            onConfirm={handleConfirmDelete}
            onClose={() => setShowDeletePopup(false)}
            entityType="grid"
            entityName={contextMenu.grid.name}
          />
        )
      }
    </>
  );
};

export default GridSideBar;
