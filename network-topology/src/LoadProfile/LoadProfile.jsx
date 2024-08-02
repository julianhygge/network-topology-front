import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchLoadProfiles } from "../services/LoadProfile";
import LoadBuilder from "./LoadBuilder";
import LoadProfileMenuCustom from "./LoadProfileMenu";
import FileUploadSelection from "./FileUploadSelection";
import LoadProfileFileList from "./LoadProfileFileList";

const LoadProfile = ({ setUnsaved, setSelectedButton }) => {
  const [loadProfiles, setLoadProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomMenu, setShowCustomMenu] = useState(false);
  const [searchParams] = useSearchParams();
  const houseId = searchParams.get("house_id");

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const profiles = await fetchLoadProfiles(houseId);
        setLoadProfiles(profiles);
        console.log("Load Profiles userConfig: ", profiles)
      } catch (error) {
        console.error("Error fetching load profiles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, [houseId])

  const handleUploadSuccess = async () => {
    setIsLoading(true);
    try {
      const profiles = await fetchLoadProfiles(houseId);
      setLoadProfiles(profiles);
      setSelectedButton("Load Profile");
    } catch (error) {
      console.error("Error fetching load profiles after upload:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAgain = async (deleteLink) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTgxMDE2MDgsImp0aSI6ImQwMzQ1OWM0LWJmZDktNDVmZS04MTI5LWY0YjA0NTRjN2JiOSIsImV4cCI6MTczMTA2MTYwOCwidXNlciI6Ijk0NTIyYTBhLWM4ZjEtNDBmOC1hMmU1LTlhZWQyZGMwMDAxMCIsInJvbGUiOlsiQ29uc3VtZXIiXSwicGVybWlzc2lvbnMiOlsicmV0cmlldmUtYmlkcyIsImRlbGV0ZS1iaWRzIiwicmV0cmlldmUtdXNlcnMiLCJyZXRyaWV2ZS10cmFuc2FjdGlvbnMiLCJjcmVhdGUtYmlkcyIsInVwZGF0ZS1iaWRzIiwic2VhcmNoLWJpZHMiXX0.tAMQrhw26ZJ385oeLSoLIpLwr9pheiGSygku-jny1fc";
    console.log(deleteLink)
    try {
      const response = await fetch(`https://hygge-test.ddns.net:8080/net-topology-api${deleteLink}`,
        {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

        });
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      console.log('Deleted file before uploading again');
      setSelectedButton(null); // Reset selected button to allow user to select an option from the left nav 
    } catch (error) {
      console.error("Failed to delete the file:", error);
    }
  };

  const handleNoClick = () => {
    setShowCustomMenu(true);
  };

  const onResetLoadProfile = () => {
    console.log("Resetting load profile");
    setShowCustomMenu(false);
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full text-xl">
          Loading...
        </div>
      );
    }
    console.log("LoadProfilesList: ", loadProfiles.items)
    if (!loadProfiles.items || loadProfiles.items?.length === 0) {
      if (showCustomMenu) {
        return <LoadProfileMenuCustom onReset={onResetLoadProfile} setUnsaved={setUnsaved} />;
      }
      return (<FileUploadSelection onUploadSuccess={handleUploadSuccess} onNoClick={handleNoClick} />);
    }

    return loadProfiles.items[0].source !== "Builder" ? (
      <LoadProfileFileList profiles={loadProfiles} onUploadAgain={handleUploadAgain} />
    ) : (<LoadBuilder onReset={() => { setLoadProfiles({}); onResetLoadProfile() }} profileId={loadProfiles.items[0].profile_id} setUnsaved={setUnsaved} />)
  }

  return renderContent();
}

export default LoadProfile;
