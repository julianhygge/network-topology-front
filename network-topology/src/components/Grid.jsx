import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { getSubstations, generateSubstation } from "../services/Substation";
import { useNavigate } from "react-router-dom";

const Grid = () => {
  const [gridNumber, setGridNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const Fetch = async () => {
      try {
        const data = await getSubstations();
        if (data.items.length > 0) {
          navigate("/gridPage");
        }
      } catch (error) {
        console.error("Error fetching substations:", error);
      }
    };
    Fetch();
  }, [navigate]);

  const handleInputChange = (event) => {
    setGridNumber(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        locality_id: "94522a0a-c8f1-40f8-a2e5-9aed2dc55555",
        number_of_substations: parseInt(gridNumber, 10),
      };

      const response = await generateSubstation(payload);

      if (response.items && response.items.length > 0) {
        navigate("/gridPage");
      } else {
        console.error("Error generating substations:", response);
      }
    } catch (error) {
      console.error("Error generating substations:", error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-col pb-1 text-white ">
        <main className="flex flex-col items-center mt-10 max-md:mt-10">
          <div className="flex flex-col items-center px-60 py-20 rounded-2xl shadow-2xl bg-navColor bg-opacity-90 max-md:px-5">
            <img
              loading="lazy"
              src="images/HyggeLogo.png"
              alt="Hygge Logo"
              className="w-[60px]"
            />
            <h2 className="mt-12 text-3xl tracking-wide text-center max-md:mt-10">
              Welcome to Hygge Power Trading Simulator
            </h2>
            <p className="mt-24 text-2xl max-md:mt-10">Enter Number of Grids</p>
            <input
              type="number"
              value={gridNumber}
              onChange={handleInputChange}
              className="mt-7 bg-white rounded-2xl h-[55px] w-[300px] p-4 text-black"
              placeholder="Enter grid number"
            />
            <button
              onClick={handleSubmit}
              className="px-20 py-1 mt-11 text-[20px] h-[55px] w-[300px] font-bold text-center text-navColor bg-amber-400 rounded-2xl max-md:px-5 max-md:mt-10"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Grid;
