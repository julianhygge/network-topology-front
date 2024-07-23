import React, { useState } from "react";
import Page2 from "./Page2";
import { Page3 } from "./Page3";
import { DeleteConfirm } from "./DeleteConfirm";

const Page1 = () => {
  const [showSecondStep, setShowSecondStep] = useState(false);
  const [showThirdStep, setShowThirdStep] = useState(false);

  const handleNoClick = () => {
    if (showSecondStep) {
      setShowSecondStep(false);
    }
  };

  const handleYesClick = () => {
    if (showSecondStep) {
      setShowThirdStep(true);
    } else {
      setShowSecondStep(true);
    }
  };

  const handleBackClick = () => {
    if (showThirdStep) {
      setShowThirdStep(false);
      setShowSecondStep(true);
    } else if (showSecondStep) {
      setShowSecondStep(false);
    }
  };

  if (showThirdStep) {
    return <Page2 onBack={handleBackClick} />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#E7FAFF]">
      <div>
        <span className="flex text-center text-navColor items-center text-[24px] font-medium">
          {showSecondStep ? (
            "Please do the configuration from below."
          ) : (
            <>
              Load profile is not created yet
              <br />
              Please do the configuration from below.
            </>
          )}
        </span>
      </div>
      <div className="flex flex-col items-center w-[50vw] px-10 pt-10 pb-20 font-medium text-center text-navColor bg-white rounded-2xl max-w-[860px] shadow-[0px_5px_10px_rgba(169,218,198,1)] max-md:px-5">
        {showSecondStep && (
          <button
            className="self-start text-xl max-md:max-w-full"
            onClick={handleBackClick}
          >
            BACK
          </button>
        )}
        <div className="mt-20 text-xl max-md:mt-10">
          {showSecondStep
            ? "Do you have the “15 Min Load profile Data” available ?"
            : "Do you have the “Load file (csv)” available?"}
        </div>
        <div className="flex gap-8 justify-between mt-20 max-w-full text-xl tracking-normal text-white whitespace-nowrap max-md:mt-10">
          <button
            className="flex justify-center items-center px-20 py-4 bg-[#FFB600] shadow-sm rounded-[33px] max-md:px-5"
            onClick={handleNoClick}
          >
            NO
          </button>
          <button
            className="flex justify-center items-center px-20 py-4 shadow-sm bg-[#74AA50] rounded-[33px] max-md:px-5"
            onClick={handleYesClick}
          >
            YES
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page1;
