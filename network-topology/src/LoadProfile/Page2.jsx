import React, { useState } from "react";

const Page2 = ({ onBack, attach15MinFile }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
   
    if (selectedFile) {
      console.log("File selected:", selectedFile);
     
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#E7FAFF]">
      <div>
        <span className="flex text-center text-navColor items-center text-[24px] font-medium">
          Please do the configuration from below.
        </span>
      </div>
      <div className="flex flex-col items-center w-[50vw] px-10 pt-10 pb-20 font-medium text-center text-navColor bg-white rounded-2xl max-w-[860px] shadow-[0px_5px_10px_rgba(169,218,198,1)] max-md:px-5">
        <button
          className="self-start text-xl max-md:max-w-full"
          onClick={onBack}
        >
          BACK
        </button>
        <div className="mt-12 text-xl w-[300px] max-md:mt-10">
          Please browse and upload the
          {attach15MinFile ? " 15 Min data load profile" : ""} .csv file
          from your computer
        </div>
        <div className="flex gap-8 justify-between mt-10 max-w-full text-xl tracking-normal text-[#204A56] whitespace-nowrap max-md:mt-10">
          <button className="flex justify-center items-center px-20 py-4 bg-[#6AD1CE] shadow-sm rounded-[33px] max-md:px-5">
            Attach
           </button>
         </div>
      
      </div>
    </div>
  );
};

export default Page2;

