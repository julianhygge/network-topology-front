import React, { useState } from "react";
import DeleteConfirm from "components/LoadProfile/DeleteConfirm";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteFile, downloadFile } from "services/LoadProfile";

const LoadProfileFileList = ({ profiless, onUploadAgain }) => {
  const location = useLocation();
  const profiles = location.state?.profiles || profiless;
  const navigate = useNavigate();
  const { houseId } = useParams();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedDeleteLink, setSelectedDeleteLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDeleteClick = (deleteLink, fileName) => {
    setSelectedDeleteLink(deleteLink);
    setSelectedFileName(fileName);
    setShowDeleteConfirm(true);
  };

  const handleClosePopup = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const correctedDeleteLink = selectedDeleteLink.startsWith("/v1")
        ? selectedDeleteLink.replace("/v1", "")
        : selectedDeleteLink;
      await deleteFile(correctedDeleteLink);
      setShowDeleteConfirm(false);
      navigate(`/config/${houseId}/load-profile/`);
    } catch (error) {
      console.error("Failed to delete the file:", error);
    }
  };

  const handleDownload = async (downloadLink, filename) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const correctedDeleteLink = downloadLink.startsWith("/v1")
        ? downloadLink.replace("/v1", "")
        : downloadLink;

      const blob = await downloadFile(correctedDeleteLink);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log("Download successful");
    } catch (error) {
      console.error("Failed to download the file:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-1xl mt-[150px] font-bold text-center text-navColor">
      <div className="flex justify-center items-center px-16 py-5 w-[1250px] bg-sky-100 rounded-2xl max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 w-full max-w-[1075px] max-md:flex-wrap max-md:max-w-full">
          <div className="w-1/4">Date</div>
          <div className="w-1/4">User</div>
          <div className="w-1/2">Uploaded file</div>
          <div className="w-1/4">Action</div>
        </div>
      </div>
      {profiles.items.map((profile) => (
        <div
          key={profile.profile_id}
          className="flex flex-col gap-5 items-center px-20 py-5 w-[1250px] bg-sky-50 rounded-2xl max-md:flex-wrap max-md:px-5 max-md:max-w-full text-navColor"
        >
          <div className="flex w-full">
            <div className="w-1/4 text-center mt-4">
              {new Date(profile.created_on).toLocaleDateString()}
            </div>
            <div className="w-1/4 text-center mt-4">{profile.user}</div>
            <div className="w-1/2 text-center flex-auto mt-4">
              {profile.file_name}
            </div>
            <div className="flex w-1/4 justify-center gap-2 text-1xl font-medium">
              <button
                className="px-8 py-4 shadow-sm bg-[#BDD8DB] rounded-[33px] max-md:px-5 text-navColor"
                onClick={() =>
                  handleDownload(profile.links.download, profile.file_name)
                }
              >
                Download File
              </button>
              <img
                loading="lazy"
                src={`${process.env.PUBLIC_URL}/images/DeleteButton.png`}
                className="w-[36px] h-[41.23px] mt-2 cursor-pointer"
                alt="Icon"
                onClick={() =>
                  handleDeleteClick(profile.links.delete, profile.file_name)
                }
              />
            </div>
          </div>
        </div>
      ))}
      {profiles.items.map((profile) => (
        <button
          key={profile.profile_id}
          className="self-center px-12 py-4 mt-20 text-1xl text-navColor font-semibold tracking-normal bg-[#6AD1CE] shadow-sm rounded-[33px] max-md:px-5 max-md:mt-10"
          onClick={() =>
            handleDeleteClick(profile.links.delete, profile.file_name)
          }
        >
          Upload Again
        </button>
      ))}
      {showDeleteConfirm && (
        <DeleteConfirm
          onClose={handleClosePopup}
          onConfirm={handleConfirmDelete}
          fileName={selectedFileName}
        />
      )}
      {isLoading && <div className="text-xl mt-20 ">Loading...</div>}
      {errorMessage && <div>Error: {errorMessage}</div>}
    </div>
  );
};

export default LoadProfileFileList;
