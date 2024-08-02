import React, { useState } from "react";
import DeleteConfirm from "components/LoadProfile/DeleteConfirm";

const Page3 = ({ profiles, onUploadAgain }) => {
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
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc";

    try {
      const response = await fetch(`https://hygge-test.ddns.net:8080/net-topology-api${selectedDeleteLink}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      console.log(`Deleted file: ${selectedFileName}`);
      setShowDeleteConfirm(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete the file:", error);
    }
  };

  const handleUploadAgain = async (filename, deleteLink) => {
    onUploadAgain(deleteLink);
    setSelectedFileName(filename);
  };

  const handleDownload = async (downloadLink) => {
    console.log(downloadLink)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc";

    const fullUrl = `https://hygge-test.ddns.net:8080/net-topology-api/v1/load/download/file?profile_id=117`;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        console.error(`Response status text: ${response.statusText}`);
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers.get('content-disposition');
      const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'csv_file';
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log('Download successful');
    } catch (error) {
      console.error('Failed to download the file:', error);
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
      {profiles.items.map(profile => (
        <div key={profile.profile_id} className="flex flex-col gap-5 items-center px-20 py-5 w-[1250px] bg-sky-50 rounded-2xl max-md:flex-wrap max-md:px-5 max-md:max-w-full text-navColor">
          <div className="flex w-full">
            <div className="w-1/4 text-center mt-4">{new Date(profile.created_on).toLocaleDateString()}</div>
            <div className="w-1/4 text-center mt-4">{profile.user}</div>
            <div className="w-1/2 text-center flex-auto mt-4">{profile.file_name}</div>
            <div className="flex w-1/4 justify-center gap-2 text-1xl font-medium">
              <button
                className="px-8 py-4 shadow-sm bg-[#BDD8DB] rounded-[33px] max-md:px-5 text-navColor"
                onClick={() => handleDownload(profile.links.download)}
              >
                Download File
              </button>
              <img
                loading="lazy"
                src="images/DeleteButton.png"
                className="w-[36px] h-[41.23px] mt-2 cursor-pointer"
                alt="Icon"
                onClick={() => handleDeleteClick(profile.links.delete, profile.file_name)}
              />
            </div>
          </div>
        </div>
      ))}
      {profiles.items.map(profile => (
        <button key={profile.profile_id} className="self-center px-12 py-4 mt-20 text-1xl text-navColor font-semibold tracking-normal bg-[#6AD1CE] shadow-sm rounded-[33px] max-md:px-5 max-md:mt-10"
          onClick={() => handleDeleteClick(profile.links.delete, profile.file_name)}>
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

export default Page3;
