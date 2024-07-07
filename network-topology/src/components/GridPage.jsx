import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { getSubstations, generateSubstation } from "../services/Substation";

const GridPage = () => {
  const [substations, setSubstations] = useState([]);

  useEffect(() => {
    fetchSubstations();
  }, []);

  const fetchSubstations = async () => {
    try {
      const data = await getSubstations();
      setSubstations(data.items);
    } catch (error) {
      console.error("Failed to fetch substations:", error);
    }
  };

  const handleAddSubstation = async () => {
    try {
      const payload = {
        locality_id: "94522a0a-c8f1-40f8-a2e5-9aed2dc55555",
        number_of_substations: 1,
      };
      const newSubstations = await generateSubstation(payload);
      console.log(newSubstations);
      setSubstations((prevSubstations) => [
        ...prevSubstations,
        ...newSubstations.items,
      ]);
    } catch (error) {
      console.error("Failed to add substation:", error);
    }
  };

  return (
    <div className="bg-backPage min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center px-5 mt-12 w-full text-4xl text-center text-navColor max-md:mt-10 max-md:max-w-full">
        <button className="justify-center items-start self-end   px-11 py-2.5  text-xl tracking-normal text-white bg-customGreen border border-green-500 border-solid shadow-sm rounded-[31px] w-[250px] h-[50px] max-md:pr-5 max-md:pl-8">
          Tree View
        </button>

        <div className="flex justify-center space-x-20 mt-[-45px]">
          <div className="z-10 shrink-0 self-start mt-0 rounded-full bg-slate-500 h-[50px] w-[50px] max-md:ml-2.5" />
          <div className="m-2 shrink-0 mt-0 rounded-full bg-zinc-300 h-[50px] w-[50px]" />
          <div className="z-10 shrink-0 mt-0 rounded-full bg-zinc-300 h-[50px] w-[50px]" />
        </div>
      </div>
      <div className="flex flex-col  px-5 mt-11   max-md:max-w-full">
        <div className="max-md:max-w-full">
          <div className="  grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4  gap-5">
            {substations.map((substation, index) => (
              <div key={substation.id} className="flex flex-col w-full mb-5">
                <div className="text-xl font-bold mb-5 text-cyan-900 flex justify-center  ">
                  {substation.name}
                </div>
                <div className="flex flex-col grow px-5 pt-20 pb-10 mx-auto w-full text-center text-white bg-white rounded-3xl border border-solid shadow-sm border-navColor max-md:mt-10">
                  <button className="flex gap-5 items-start px-12 py-3 mt-60 bg-customGreen border border-green-500 border-solid shadow-sm rounded-[33px] max-md:px-5 max-md:mt-10 h-[60px]">
                    <div className="flex-auto text-1xl font-medium tracking-normal mt-1">
                      <span>Add </span>Transformers
                    </div>
                    <div className="text-5xl max-md:text-2xl mt-[-11px]">+</div>
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddSubstation}
              className="flex flex-col w-[150px]  ml-36"
            >
              <div className="flex flex-col items-center self-stretch h-[150px] px-10 pt-8 pb-8 my-auto w-full text-center text-navColor whitespace-nowrap bg-white rounded-3xl border border-solid shadow-sm border-navColor max-md:px-5 max-md:mt-10">
                <div className="text-5xl max-md:text-4xl ">+</div>
                <div className="mt-1 text-2xl">Add</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridPage;
