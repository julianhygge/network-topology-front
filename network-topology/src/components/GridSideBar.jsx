import React, { useEffect, useState } from 'react';
import { getSubstations, generateSubstation } from '../services/Substation';

const GridSideBar = ({onGridSelect}) => {
  const [grids, setGrids] = useState([]);
  const [selectedGrid, setSelectedGrid] = useState(null);

  useEffect(() => {
    const fetchGrids = async () => {
      try {
        const data = await getSubstations();
        setGrids(data.items);
      } catch (error) {
        console.error('Error fetching substations:', error);
      }
    };

    fetchGrids();
  }, []);

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
  

  const handleGridClick = (grid) => {
    setSelectedGrid(grid);
    onGridSelect(grid);
  };

  return (
    <div className="flex flex-col h-screen">
  <div className="flex flex-col bg-sideBar w-[120px] h-full overflow-auto">
    <div className="flex-1 h-full">  <div className="grid space-y-20 ">
        {grids.map((grid) => (
          <button
            key={grid.id}
            className={`grid justify-center  cursor-pointer mt-24 ${selectedGrid === grid.id ? 'bg-white' : ''}`}
            onClick={() => handleGridClick(grid.id)}
          >
            <img
              loading="lazy"
              src="images/GridImage.png"
              alt="Grid Logo"
              className="h-[70px] w-[70px]"
            />
            <span className="text-xl text-gridColor1 ">{grid.name}</span>
          </button>
        ))}
        <button className="grid justify-center mt-24   cursor-pointer hover:opacity-50" onClick={handleAddGrid}>
          <p className="bg-white w-[80px] px-4 rounded-[50px] text-3xl text-gridColor1 ">+</p>
          <p className="text-white text-sm mt-2">Add Grid</p>
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default GridSideBar;
