import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UploadNetworkTopologyFile } from "services/Substation";

const ImportGrid = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false);
 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split(".").pop();
      if (fileExtension === "json") {
        setSelectedFile(file);
        setErrorMessage("");
      } else {
        setErrorMessage(
          <>
            The file you have uploaded is invalid. <br /> Please upload the
            correct json file.
          </>
        );
        setSelectedFile(null);
      }
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
        setIsUploading(true);
      try {
        await UploadNetworkTopologyFile(
          selectedFile,
        );
        await handleUploadSuccess(); // Fetch updated profiles
      } catch (error) {
        let errorMessage = "An error occurred while uploading the file.";
        if (error.response && error.response.data) {
          errorMessage =
            error.response.data.detail ||
            error.response.data.message ||
            errorMessage;
        }
        setErrorMessage(errorMessage);
      }
    }
  };

  const handleUploadSuccess = async () => {
    try {
      navigate("/");
      onClose()
    } catch (error) {
      console.error("Error Uploading:", error);
    }
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    setErrorMessage("");
    fileInputRef.current.value = null;
  };

 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col items-center justify-center bg-[#E7FAFF] w-full max-w-4xl max-h-[90vh] mx-4 rounded-lg overflow-y-auto p-8">
         
        <div className="flex flex-col items-center w-full max-w-[860px] px-10 pt-10 pb-20 font-medium text-center text-navColor bg-white rounded-2xl">
          <button
            className="self-start text-xl mb-8 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            ← Back
          </button>
          
          <div className="mt-4 text-xl w-full max-w-[335px] relative justify-center mb-6">
            {errorMessage ? (
              <span className="text-[#FC4C02]">{errorMessage}</span>
            ) : selectedFile ? (
              <div className="flex flex-row gap-6 justify-center items-center">
                <div>
                  You have attached the below file
                  <div className="font-bold mt-2">{selectedFile.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Size: {(selectedFile.size / 1024).toFixed(2)} KB
                  </div>
                </div>
                <button
                  className="w-[24px] h-[24px] cursor-pointer text-red-500 hover:text-red-700 text-xl font-bold border border-red-500 rounded-full flex items-center justify-center"
                  onClick={handleDeleteFile}
                  disabled={isUploading}
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                Please browse and upload the <br />
                json file from your computer
              </>
            )}
          </div>
          
          <div className="flex gap-8 justify-center mt-10 max-w-full text-xl tracking-normal text-[#204A56] whitespace-nowrap">
            <input
              type="file"
              id="file-upload"
              style={{ display: "none" }}
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={selectedFile !== null || isUploading}
              accept=".json"
            />
            <label
              htmlFor="file-upload"
              className={`flex justify-center items-center px-20 py-4 shadow-sm rounded-[33px] cursor-pointer transition-all ${
                selectedFile || isUploading
                  ? "bg-[#6AD1CE] opacity-50 cursor-not-allowed" 
                  : "bg-[#6AD1CE] hover:bg-[#5BC4C1]"
              }`}
            >
              {isUploading ? "Processing..." : "Attach"}
            </label>
            
            {selectedFile && (
              <button
                className={`flex justify-center items-center text-white px-20 py-4 shadow-sm rounded-[33px] transition-all ${
                  isUploading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-[#49AC82] hover:bg-[#3E9470]"
                }`}
                onClick={handleFileUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </div>
                ) : (
                  "Upload"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default ImportGrid;
