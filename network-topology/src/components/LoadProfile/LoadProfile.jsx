import { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutlet, useParams } from "react-router-dom";
import { fetchLoadProfiles } from "services/LoadProfile";
import LoadProfileMenuCustom from "components/LoadProfile/LoadProfileMenu";
import FileUploadSelection from "components/LoadProfile/FileUploadSelection";
import LoadProfileFileList from "components/LoadProfile/LoadProfileFileList";

const LoadProfile = () => {
  const [loadProfiles, setLoadProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomMenu, setShowCustomMenu] = useState(false);
  const { houseId } = useParams();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const location = useLocation();

  const navigateOffLoadProfile = (path) => {
    navigate(`/config/${houseId}/load-profile/${path}`);
  }

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const profiles = await fetchLoadProfiles(houseId);
        setLoadProfiles(profiles);
        const hasEngineLoad = profiles.items?.some(
          (profile) => profile.source === "Engine"
        );
        const hasBuilderProfile = profiles.items?.some(
          (profile) => profile.source === "Builder"
        );
        const hasPredefinedProfile = profiles.items?.some(
          (profile) => profile.source === "Template"
        );
        if (hasBuilderProfile) {
          navigateOffLoadProfile("builder");
          return;
        } else if (hasEngineLoad) {
          navigateOffLoadProfile("generationEngine");
          return;
        } else if (hasPredefinedProfile) {
          navigateOffLoadProfile("predefinedTemplates");
          return;
        }
        console.log("Load Profiles userConfig: ", profiles)
      } catch (error) {
        console.error("Error fetching load profiles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, [houseId, location.pathname])

  const handleUploadSuccess = async () => {
    setIsLoading(true);
    try {
      const profiles = await fetchLoadProfiles(houseId);
      setLoadProfiles(profiles);
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
      navigateOffLoadProfile();
    } catch (error) {
      console.error("Failed to delete the file:", error);
    }
  };

  const handleNoClick = () => {
    setShowCustomMenu(true);
  };

  const renderContent = () => {
    if (outlet) { return outlet; }

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
        return <LoadProfileMenuCustom />;
      }
      return (<FileUploadSelection onUploadSuccess={handleUploadSuccess} onNoClick={handleNoClick} />);
    }

    return (
      <LoadProfileFileList profiles={loadProfiles} onUploadAgain={handleUploadAgain} />
    )
  }

  return renderContent();
}

export default LoadProfile;
