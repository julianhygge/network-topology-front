import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutlet,
  useParams,
} from "react-router-dom";
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
  };

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
        console.log("Load Profiles userConfig: ", profiles);
      } catch (error) {
        console.error("Error fetching load profiles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, [houseId, location.pathname]);

  const renderContent = () => {
    if (outlet) {
      return outlet;
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full text-xl">
          Loading...
        </div>
      );
    }
    console.log("LoadProfilesList: ", loadProfiles.items);
    if (!loadProfiles.items || loadProfiles.items?.length === 0) {
      return <LoadProfileMenuCustom />;
    }

    return <LoadProfileFileList profiless={loadProfiles} />;
  };

  return renderContent();
};

export default LoadProfile;
