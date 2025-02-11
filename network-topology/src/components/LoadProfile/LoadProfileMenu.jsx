import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const LoadProfileMenuCustom = () => {
  const navigate = useNavigate();
  const { houseId } = useParams();

  const handleNavigate = (path) => {
    navigate(`/config/${houseId}/load-profile/${path}`);
  };

  const handleLoadBuilderNavigation = () => {
    handleNavigate("builder");
  };
  const handleGenerationEngineNavigation = () => {
    handleNavigate("generationEngine");
  };

  const handlePredefinedTemplatesNavigation = () => {
    handleNavigate("predefinedTemplates");
  };
  const handleLoadFileNavigation = () => {
    handleNavigate("fileUpload");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#E7FAFF]">
      <div>
        <span className="flex text-center text-navColor items-center text-[24px] font-medium mb-2">
          Load profile generation is in process, <br />
          Please continue to do the configuration from below.
        </span>
      </div>
      <div className="flex flex-col items-center w-[65vw] px-10 pt-10 pb-20 font-medium text-center text-navColor bg-white rounded-2xl max-w-[860px] shadow-[0px_5px_10px_rgba(169,218,198,1)] max-md:px-5">
        <div className="mt-10 text-xl max-md:mt-10">
          Please select one of the following Methods <br />
          to Generate the Load Profile
        </div>
        <div className="flex gap-6 justify-between mt-10 max-w-full text-xl tracking-normal text-navColor whitespace-nowrap max-md:mt-10">
          <button
            className="flex justify-center items-center px-10 py-10 bg-white  border-[1px] border-navColor shadow-xl rounded-[20px] max-md:px-5"
            onClick={handlePredefinedTemplatesNavigation}
          >
            Predefined <br />
            Templates
          </button>
          <button
            className="flex justify-center items-center px-10 py-10 bg-white border-[1px] border-navColor shadow-xl rounded-[20px] max-md:px-5"
            onClick={handleGenerationEngineNavigation}
          >
            Generation <br />
            Engine
          </button>
          <button
            className="flex justify-center items-center px-14 py-10 shadow-xl bg-white  border-[1px] border-navColor  rounded-[20px] max-md:px-5"
            onClick={handleLoadBuilderNavigation}
          >
            Load <br />
            Builder
          </button>
          <button
            className="flex justify-center items-center px-16 py-10 shadow-xl bg-white  border-[1px] border-navColor  rounded-[20px] max-md:px-5"
            onClick={handleLoadFileNavigation}
          >
            Load <br />
            File
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadProfileMenuCustom;
