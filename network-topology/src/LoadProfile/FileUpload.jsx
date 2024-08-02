import React, { useState, useRef } from "react";
import { uploadLoadProfile } from "../services/LoadProfile";
import { useSearchParams } from "react-router-dom";

const FileUpload = ({ onBack, attach15MinFile, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const houseId = searchParams.get("house_id");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split(".").pop();
      if (fileExtension === "csv" || fileExtension === "xlsx") {
        setSelectedFile(file);
        setErrorMessage("");
      } else {
        setErrorMessage(
          <>
            The file you have uploaded is invalid. <br /> Please upload the
            correct .csv file.
          </>
        );
        setSelectedFile(null);
      }
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        await uploadLoadProfile(houseId, "Profile name", selectedFile, false);
        onUploadSuccess();
      } catch (error) {
        setErrorMessage("File upload failed. Please try again.");
      }
    }
  };
  const handleDeleteFile = () => {
    setSelectedFile(null);
    setErrorMessage("");
    fileInputRef.current.value = null;
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
        <div className="mt-12 text-xl w-[335px] max-md:mt-10 relative justify-center mb-3">
          {errorMessage ? (
            <span className="text-[#FC4C02]">{errorMessage}</span>
          ) : selectedFile ? (
            <div className="flex flex-row gap-6 justify-center">
              <div>
                You have attached the below file
                <div className="font-bold">{selectedFile.name}</div>
              </div>
              <img
                src="images/DeleteButton.png"
                className="w-[24px] h-[28px] cursor-pointer mt-6"
                alt="Delete Icon"
                onClick={handleDeleteFile}
              />
            </div>
          ) : (
            <>
              Please browse and upload the <br />
              {attach15MinFile ? " 15 Min data load profile" : ""} .csv
              file from your computer
            </>
          )}
        </div>
        <div className="flex gap-8 justify-between mt-10 max-w-full text-xl tracking-normal text-[#204A56] whitespace-nowrap max-md:mt-10">
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={selectedFile !== null}
          />
          <label
            htmlFor="file"
            className={`flex justify-center items-center px-20 py-4 shadow-sm rounded-[33px] max-md:px-5 cursor-pointer ${selectedFile ? "bg-[#6AD1CE] opacity-50" : "bg-[#6AD1CE]"
              }`}
          >
            Attach
          </label>
          {selectedFile && (
            <button
              className="flex justify-center items-center text-white px-20 py-4 bg-[#49AC82] shadow-sm rounded-[33px] max-md:px-5"
              onClick={handleFileUpload}
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
