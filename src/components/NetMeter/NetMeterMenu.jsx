import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "components/Common/Navbar";
import LoadingPopup from "./LoadingPopup";
import {
  fetchNetMeteringPolicies,
  selectNetMeteringPolicy,
  fetchSelectedPolicy,
  updateNetMeteringPolicy,
} from "services/netMeteringService";

export default function NetMeterMenu() {
  const navigate = useNavigate();
  const { simulationRunId } = useParams();
  const [loading2, setLoading2] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupInfo, setPopupInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!simulationRunId) {
      navigate("/netmeter", { replace: true });
      return;
    }

    const activePoliciesUnderSelectedPolicy = async () => {
      try {
        const data = await fetchNetMeteringPolicies();
        setPolicies(Array.isArray(data.items) ? data.items : []);
      } catch (error) {
        if (error.response?.status === 400) {
          console.warn(
            "Not able to fetch policies under the chosen algorithm."
          );
          setPolicies([]);
        } else {
          console.error(
            "Unexpected error fetching policies for the chosen algorithm:",
            error
          );
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    };

    activePoliciesUnderSelectedPolicy();
  }, [navigate, simulationRunId]);

  // const handleSelect = async (policy) => {
  //   setLoading2(true);
  //   try {
     
  //     const existing = await fetchSelectedPolicy(simulationRunId);
  //     console.log(existing);
  //     if (existing && existing.net_metering_policy_type_id) {
        
       
  //       await updateNetMeteringPolicy({
  //         simulation_run_id: simulationRunId,
  //         net_metering_policy_type_id: policy.id,
  //       });
  //     } else {
      
  //       await selectNetMeteringPolicy({
  //         simulationRunId,
  //         policyTypeId: policy.id,
  //       });
  //     }

  //     // then navigate as before
  //     switch (policy.display_name) {
  //       case "Net Metering":
  //         navigate(`/netmeter/netMetering/netMetering/${simulationRunId}`);
  //         break;
  //       case "Gross Metering":
  //         navigate(`/netmeter/netMetering/grossMetering/${simulationRunId}`);
  //         break;
  //       case "TOU Rate Metering":
  //         navigate(`/netmeter/netMetering/touMetering/${simulationRunId}`);
  //         break;

  //       default:
  //         console.warn('Unknown policy selected:', policy.display_name)
  //     }
  //   } catch (err) {
  //     console.error("Error selecting/updating policy:", err);
  //     setError(err.response?.data?.detail || "Failed to select policy");
  //   } finally {
  //     setLoading2(false);
  //   }
  // };
   const handleSelect = async (policy) => {
    setLoading2(true);
    try {
      // 1) try to GET existing; if 404 -> not created yet
      let existing = null;
      try {
        existing = await fetchSelectedPolicy(simulationRunId);
      } catch (err) {
        if (err.response?.status !== 400) throw err;
      }

      if (existing && existing.net_metering_policy_type_id) {
        // 2a) update
        await updateNetMeteringPolicy({
          simulation_run_id: simulationRunId,
          net_metering_policy_type_id: policy.id,
        });
      } else {
        // 2b) create
        await selectNetMeteringPolicy({
          simulationRunId,
          policyTypeId: policy.id,
        });
      }

      // 3) navigate based on the stable policy_code
      switch (policy.policy_code) {
        case "net_metering_standard":
          navigate(`/netmeter/netMetering/netMetering/${simulationRunId}`);
          break;
        case "gross_metering_standard":
          navigate(`/netmeter/netMetering/grossMetering/${simulationRunId}`);
          break;
        case "tou_rate_standard":
          navigate(`/netmeter/netMetering/touMetering/${simulationRunId}`);
          break;
        default:
          console.warn("Unknown policy selected:", policy.policy_code);
      }
    } catch (err) {
      console.error("Error selecting/updating policy:", err);
      setError(err.response?.data?.detail || "Failed to select policy");
    } finally {
      setLoading2(false);
    }
  };

  const handleIconClick = (policy) => {
    setPopupInfo({
      title: policy.display_name,
      message: policy.description,
    });
  };

  const closePopup = () => setPopupInfo(null);

  if (loading2) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 items-center justify-center  bg-gradient-to-br from-[#6CCECD] to-[#356770]">
          <span className="text-navColor">Loading</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 items-center justify-center  bg-gradient-to-br from-[#6CCECD] to-[#356770]">
          <span className="text-navColor">Loading policies…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen  bg-gradient-to-br from-[#6CCECD] to-[#356770]">
   
      <Navbar />
      <button
        onClick={() => navigate(-1)}
        className="absolute top-24 left-4 w-20 h-12 rounded-full border border-[#D59805] bg-[#FFF8E6] hover:bg-[#FFF3D7] flex items-center justify-center transition-colors  shadow-[0px_5px_10px_0px_#00000040]"
      >
        <img src={`${process.env.PUBLIC_URL}/images/Arrow 3.png`} alt="Back" className="w-6 h-6" />
      </button>

      <div className="flex flex-1">
       
        <div className="flex flex-col flex-1">
          <div className="flex flex-1 flex-col items-center justify-center ">

            <div className="flex flex-col justify-center items-center w-full max-w-5xl p-12 bg-[linear-gradient(135.13deg,rgba(246,255,255,0.5)_100%,rgba(141,144,144,0.5)_100%)] rounded-2xl shadow-[0px_-2px_8px_0px_#00000040]">
              <h2 className="text-center text-xl font-medium mb-20 text-black">
                Please select one of the desired policy for net metering algorithm
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {policies.map((policy) => (
                  <button
                    key={policy.id}
                    onClick={() => handleSelect(policy)}
                    className="
                      relative
                      group
                      flex flex-row gap-3 items-center justify-center
                      w-full h-24 p-6 rounded-lg  shadow-[0px_5px_10px_0px_#00000040] transition
                    bg-[#F0DBA4] text-navColor hover:bg-[#FFB600] hover:cursor-pointer
                    "
                  >
                    {/* Info Icon (visible on hover) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIconClick(policy);
                      }}
                      className="
                        absolute top-2 right-2
                        hidden group-hover:flex
                        items-center justify-center
                        w-6 h-6 rounded-full shadow
                        hover:bg-gray-100
                      "
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/images/info.png`}
                        alt="Info"
                        className="w-4 h-4"
                      />
                    </button>

                    {/* Policy Label */}
                    <span className="text-center font-semibold">
                      {policy.display_name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {error && (
              <div className="text-center text-md font-medium mt-6 text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animated Loading Popup */}
      {popupInfo && (
        <LoadingPopup
          title={`${popupInfo.title} Info`}
          duration={4000}
          onClose={closePopup}
        >
          <p>{popupInfo.message}</p>
        </LoadingPopup>
      )}
    </div>
  );
}
