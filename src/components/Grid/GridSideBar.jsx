import React, { useEffect, useState } from "react";
import {
  getSubstations,
  generateSubstation,
  deleteSubstation,
} from "services/Substation";
import Delete from "components/Common/DeleteConfirm";
import "./GridSideBar.css";
import ImportGrid from "./ImportGrid";
import { Plus } from "lucide-react";

const GridSideBar = ({ onGridSelect, selectedGridId }) => {
  const [grids, setGrids] = useState([]);
  const [selected, setSelected] = useState(selectedGridId || null);
  const [contextMenu, setContext] = useState({
    visible: false,
    x: 0,
    y: 0,
    grid: null,
  });
  const [gridToDelete, setGridToDelete] = useState(null);
  const [isImportPopupOpen, setIsImportPopupOpen] = useState(false);

  const handleImportGrid = () => {
    setIsImportPopupOpen(true);
  };

  const handleCloseImportPopUp = () => {
    setIsImportPopupOpen(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const { items } = await getSubstations();
        setGrids(items);
        if (!selectedGridId && items.length) {
          setSelected(items[0].id);
          onGridSelect(items[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [selectedGridId, onGridSelect]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (contextMenu.visible && !e.target.closest(".context-menu")) {
        setContext({ visible: false, x: 0, y: 0, grid: null });
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [contextMenu.visible]);

  const handleAdd = async () => {
    try {
      const { items } = await generateSubstation({
        locality_id: "94522a0a-c8f1-40f8-a2e5-9aed2dc55555",
        number_of_substations: 1,
      });
      setGrids(items);
    } catch (e) {
      console.error(e);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteSubstation(gridToDelete.id);
      const remaining = grids.filter((g) => g.id !== gridToDelete.id);
      setGrids(remaining);
      if (selected === gridToDelete.id) {
        const next = remaining[0]?.id || null;
        setSelected(next);
        onGridSelect(next);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGridToDelete(null);
    }
  };

  return (
    <>
      <div className="flex flex-col bg-#0F5D67F2 h-full rounded-2xl">
        <div className="flex-1 overflow-y-auto scrollbar">
          <div className="grid gap-y-5 pt-5">
            {grids.map((g) => (
              <button
                key={g.id}
                className={`
      flex flex-col items-center 
      py-5 
      mx-2           
      my-1          
      rounded-xl     
      transition-colors duration-200
      ${
        selected === g.id
          ? " bg-[linear-gradient(135.13deg,rgba(246,255,255,0.88)_99.11%,rgba(141,144,144,0.88)_99.11%)]  text-[#0F5D67]"
          : "hover:bg-[#E8F8F5]/20 text-white"
      }
    `}
                onClick={() => {
                  setSelected(g.id);
                  onGridSelect(g.id);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContext({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    grid: g,
                  });
                }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/Grid.png`}
                  alt="Grid Logo"
                  loading="lazy"
                  className="h-[52.81px] w-[46px]"
                />
                <span
                  className={`mt-1 font-dinPro text-gridColor1 ${
                    selected === g.id ? "text-brown font-bold" : ""
                  }`}
                >
                  {g.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-3 grid justify-center">
          <button
            className="flex flex-col items-center justify-center cursor-pointer hover:opacity-80"
            onClick={handleAdd}
          >
            <div
              className="
      flex items-center justify-center
      w-[50px] h-[50px]
      rounded-full
      bg-[linear-gradient(38.79deg,_#FFC429_14.85%,_#EF403D_84.64%)]

    "
            >
              <Plus size={30} color="white" />
            </div>
            <span className="text-white text-sm mt-2 font-dinPro font-medium text-center">
              Add Grid
            </span>
          </button>
        </div>

        <div className="p-3 grid justify-center">
          <button
            className="flex flex-col items-center justify-center cursor-pointer hover:opacity-80"
            onClick={handleImportGrid}
          >
            <div
              className="
      flex items-center justify-center
      w-[50px] h-[50px]
      rounded-full
      bg-[linear-gradient(38.79deg,_#FFC429_14.85%,_#EF403D_84.64%)]
    "
            >
              <Plus size={30} color="white" />
            </div>
            <span className="text-white text-sm mt-2 font-dinPro font-medium text-center">
              Import Grid
            </span>
          </button>
        </div>

        {isImportPopupOpen && (
          <ImportGrid
            isOpen={isImportPopupOpen}
            onClose={handleCloseImportPopUp}
          />
        )}
      </div>

      {contextMenu.visible && (
        <div
          className="fixed z-10 context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="p-2 bg-white text-[#F21818] rounded shadow-md hover:bg-gray-100"
            onClick={() => {
              setGridToDelete(contextMenu.grid);
              setContext({ visible: false, x: 0, y: 0, grid: null });
            }}
          >
            Delete
          </button>
        </div>
      )}

      {gridToDelete && (
        <Delete
          onConfirm={confirmDelete}
          onClose={() => setGridToDelete(null)}
          entityType="grid"
          entityName={gridToDelete.name}
        />
      )}
    </>
  );
};

export default GridSideBar;
