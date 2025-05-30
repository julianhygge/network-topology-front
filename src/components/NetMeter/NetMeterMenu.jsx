import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation ,useParams} from 'react-router-dom'
import Navbar from 'components/Common/Navbar'
import GridSideBar from 'components/Grid/GridSideBar'
import LoadingPopup from './LoadingPopup'
import {
  fetchNetMeteringPolicies,
  selectNetMeteringPolicy,
  fetchSelectedPolicy
} from 'services/netMeteringService'

export default function NetMeterMenu() {
  const navigate = useNavigate()
  const { simulationRunId } = useParams()
  const [loading2,setLoading2]=useState(false);
  const [policies, setPolicies]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [popupInfo, setPopupInfo] = useState(null)
  const [error, setError] = useState("");

// why are we checking for selected policy when we just need to display the active net metering policies first and then the user will selct

// useEffect(() => {
//   if (!simulationRunId) {
//     navigate('/netmeter', { replace: true });
//     return;
//   }

//   const checkSelectedPolicy = async () => {
//     try {
//       const selected = await fetchSelectedPolicy(simulationRunId);

//       if (selected?.net_metering_policy_type_id) {
//         const data = await fetchNetMeteringPolicies();
//         const allPolicies = Array.isArray(data.items) ? data.items : [];
//         const chosen = allPolicies.find(p => p.id === selected.net_metering_policy_type_id);

//         if (chosen) {
//           switch (chosen.display_name) {
//             case 'Net Metering':
//               navigate(`/netmeter/netMetering/NetMetering/${simulationRunId}`);
//               break;
//             case 'Gross Metering':
//               navigate(`/netmeter/netMetering/GrossMetering/${simulationRunId}`);
//               break;
//             case 'TOU Rate Metering':
//               navigate(`/netmeter/netMetering/TOURateMetering${simulationRunId}`);
//               break;
//             default:
//               console.warn('Unknown policy type:', chosen.display_name);
//           }
//         }
//       } else {
//         // no policy selected, fetch all for manual selection
//         const data = await fetchNetMeteringPolicies();
//         setPolicies(Array.isArray(data.items) ? data.items : []);
//       }
//     } catch (error) {
//       // handle 404 (not selected yet)
//       if (error.response?.status === 400) {
//         try {
//           const data = await fetchNetMeteringPolicies();
//           setPolicies(Array.isArray(data.items) ? data.items : []);
//         } catch (innerErr) {
//           console.error('Error fetching policy list:', innerErr);
//         }
//       } else {
//         console.error('Error checking selected policy:', error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   checkSelectedPolicy();
// }, [simulationRunId, navigate]);

useEffect(() => {
  if (!simulationRunId) {
    navigate('/netmeter', { replace: true });
    return;
  }

  const activePoliciesUnderSelectedPolicy = async () => {
    try {
      const data = await fetchNetMeteringPolicies();
      setPolicies(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      if (error.response?.status === 400) {
        console.warn("Not able to fetch policies under the chosen algorithm.");
        setPolicies([]);
      } else {
        console.error('Unexpected error fetching policies for the chosen algorithm:', error);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  activePoliciesUnderSelectedPolicy();
}, [navigate, simulationRunId]);


  const handleSelect = async (policy) => {
    console.log(policy.id)
    console.log(simulationRunId)
    setLoading2(true);
    try {
        await selectNetMeteringPolicy({
        simulationRunId: simulationRunId,
        policyTypeId: policy.id
      })
      switch (policy.display_name) {
        case 'Net Metering':
          navigate(`/netmeter/netMetering/netMetering/${simulationRunId}`);
          break
        case 'Gross Metering':
          navigate(`/netmeter/netMetering/grossMetering/${simulationRunId}`);
          break
        case 'TOU Rate Metering':
          navigate(`/netmeter/netMetering/touMetering/${simulationRunId}`);
          break

        default:
          console.warn('Unknown policy selected:', policy.display_name)
      }
    } catch (err) {
      console.error('Error selecting policy:', err)
      setError(err.response.data.detail)
    }
    finally{
        setLoading2(false);
    }
  }

  const handleIconClick = (policy) => {
    setPopupInfo({
      title: policy.display_name,
      message: policy.description
    })
  }

  const closePopup = () => setPopupInfo(null)

  if (loading2) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 items-center justify-center bg-[#E7FAFF]">
          <span className="text-navColor">Loading</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 items-center justify-center bg-[#E7FAFF]">
          <span className="text-navColor">Loading policies…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        {/* <GridSideBar /> */}

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          <div className="flex flex-1 flex-col items-center justify-center bg-[#E7FAFF]">
            <div className="text-center text-2xl font-medium mb-6 text-navColor">
              Net metering algorithm has three types of policies
            </div>

            <div className="flex flex-col justify-center items-center w-full max-w-3xl p-12 bg-white border border-[#BF6A02] rounded-2xl shadow-lg">
              <h2 className="text-center text-xl font-medium mb-20 text-navColor">
                Please select one of the desired policies
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map((policy) => (
                  <button
                    key={policy.id}
                    onClick={() => handleSelect(policy)}
                    className="
                      relative
                      group
                      flex flex-row gap-3 items-center justify-center
                      w-full h-24 p-6 rounded-lg shadow transition
                      bg-[#FFB600] bg-opacity-30 text-navColor
                      hover:bg-opacity-100 hover:cursor-pointer
                    "
                  >
                    {/* Info Icon (visible on hover) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleIconClick(policy)
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
                        src="/images/Info.png"
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
  )
}
