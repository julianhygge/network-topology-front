import React, { useEffect, useState } from "react";
import {
  getSubstations,
  generateSubstation,
  deleteSubstation,
} from "services/Substation";
import Delete from "components/Common/DeleteConfirm";
import "./GridSideBar.css";

const GridSideBar = ({ onGridSelect, selectedGridId }) => {
  const [grids,       setGrids     ] = useState([]);
  const [selected,   setSelected   ] = useState(selectedGridId || null);
  const [contextMenu, setContext  ] = useState({ visible: false, x: 0, y: 0, grid: null });
  const [gridToDelete, setGridToDelete] = useState(null);

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
    const onDocClick = e => {
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
      const remaining = grids.filter(g => g.id !== gridToDelete.id);
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
      <div className="flex flex-col bg-sideBar h-full">
        <div className="flex-1 overflow-y-auto scrollbar">
          <div className="grid gap-y-5 pt-5">
            {grids.map((g) => (
              <button
                key={g.id}
                className={`flex flex-col items-center py-5 w-full ${selected === g.id ? "bg-white" : ""}`}
                onClick={() => { setSelected(g.id); onGridSelect(g.id); }}
                onContextMenu={e => {
                  e.preventDefault();
                  setContext({ visible: true, x: e.clientX, y: e.clientY, grid: g });
                }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/GridImage.png`}
                  alt="Grid Logo"
                  loading="lazy"
                  className="h-[52.81px] w-[46px]"
                />
                <span className={`mt-1 font-dinPro text-gridColor1 ${selected === g.id ? "text-brown font-bold" : ""}`}>
                  {g.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-3 grid justify-center">
          <button
            className="grid justify-center cursor-pointer hover:opacity-50"
            onClick={handleAdd}
          >
            <p className="flex justify-center items-center bg-[#FFF8E6] w-[80px] h-[50px] rounded-full text-3xl text-gridColor1 border-2 border-[#D59805]">
              +
            </p>
            <p className="text-white text-sm mt-2 font-dinPro font-medium">
              Add Grid
            </p>
          </button>
        </div>
      </div>

      {contextMenu.visible && (
        <div className="fixed z-10 context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
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
