import React, { useEffect, useState } from 'react';
import { getSubstations, generateSubstation, deleteSubstation } from '../services/Substation';
import Delete from './DeleteConfirm'; 

const GridSideBar = ({ onGridSelect, selectedGridId }) => {
  const [grids, setGrids] = useState([]);
  const [selectedGrid, setSelectedGrid] = useState(selectedGridId || null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, grid: null });
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
        console.error('Error fetching substations:', error);
      }
    };

    fetchGrids();
  }, [selectedGridId, onGridSelect]);

  useEffect(() => {
    if (selectedGridId) {
      setSelectedGrid(selectedGridId);
    }
  }, [selectedGridId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu.visible && !event.target.closest('.context-menu')) {
        setContextMenu({ visible: false, x: 0, y: 0, grid: null });
      }
    };

    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  const handleAddGrid = async () => {
    try {
      const payload = {
        locality_id: '94522a0a-c8f1-40f8-a2e5-9aed2dc55555',
        number_of_substations: 1,
      };

      const newSubstations = await generateSubstation(payload);

      const uniqueSubstations = [
        ...grids,
        ...newSubstations.items.filter(
          (newSub) =>
            !grids.some((existingSub) => existingSub.id === newSub.id)
        ),
      ];
      setGrids(uniqueSubstations);
    } catch (error) {
      console.error('Error generating substations:', error);
    }
  };

  const handleGridClick = (gridId) => {
    setSelectedGrid(gridId);
    onGridSelect(gridId);
  };

  const handleContextMenu = (event, grid) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      grid: grid,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSubstation(contextMenu.grid.id);
      setGrids(grids.filter(g => g.id !== contextMenu.grid.id));
      setContextMenu({ visible: false, x: 0, y: 0, grid: null });
      setShowDeletePopup(false);
    } catch (error) {
      console.error('Failed to delete substation:', error);
    }
  };

  return (
    <div className="flex flex-col  h-screen ">
      <div className="flex flex-col bg-sideBar w-[120px]  h-full  overflow-auto ">
        <div className="flex-1   ">
          <div className="grid space-y-10">
            {grids.map((grid) => (
              <button
                key={grid.id}
                className={`grid justify-center cursor-pointer mt-2 ${
                  selectedGrid === grid.id ? 'bg-white py-3' : ''
                }`}
                onClick={() => handleGridClick(grid.id)}
                onContextMenu={(event) => handleContextMenu(event, grid)}
              >
                <img
                  loading="lazy"
                  src="images/GridImage.png"
                  alt="Grid Logo"
                  className="h-[55px] w-[55px]"
                />
                <span className=" text-gridColor1 ">{grid.name}</span>
              </button>
            ))}
            <button
              className="grid justify-center  cursor-pointer hover:opacity-50"
              onClick={handleAddGrid}
            >
              <p className="bg-white w-[80px] px-4 rounded-[50px] text-3xl text-gridColor1 ">
                +
              </p>
              <p className="text-white text-sm mt-2">Add Grid</p>
            </button>
          </div>
        </div>
      </div>
      {contextMenu.visible && (
        <div
          className="fixed z-10 context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x}}
        >
          <button
            className="p-2 bg-white  text-[#F21818] rounded"
            onClick={() => setShowDeletePopup(true)}
          >
            Delete
          </button>
        </div>
      )}
      {showDeletePopup && contextMenu.grid && (
        <Delete
          onConfirm={handleConfirmDelete}
          onClose={() => setShowDeletePopup(false)}
          transformerName={contextMenu.grid.name}
        />
      )}
    </div>
  );
};

export default GridSideBar;