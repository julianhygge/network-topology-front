import React from "react";

const Page1 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#E7FAFF]">
      <div>
        <span className="flex text-center text-navColor items-center text-[24px]">
          Load profile is not created yet
          <br />
          Please do the configuration from below.
        </span>
      </div>
      <div className="flex flex-col items-center w-[50vw] px-10 pt-10 pb-20 font-medium text-center text-navColor bg-white rounded-2xl max-w-[860px] shadow-[0px_5px_10px_rgba(169,218,198,1)] max-md:px-5">
          {/* <div className="self-start text-xl max-md:max-w-full">BACK</div> */}
        <div className="mt-20 text-xl max-md:mt-10">
          Do you have the “Load file (csv)” available?
        </div>
        <div className="flex gap-8 justify-between mt-20 max-w-full text-xl tracking-normal text-white whitespace-nowrap max-md:mt-10">
          <button className="flex justify-center items-center px-20 py-4 bg-[#FFB600] shadow-sm rounded-[33px] max-md:px-5">
            NO
          </button>
          <button className="flex justify-center items-center px-20 py-4 shadow-sm bg-[#74AA50] rounded-[33px] max-md:px-5">
            YES
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page1;

