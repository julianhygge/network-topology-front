import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "components/Common/Navbar";
import {
  fetchAlgorithms,
  updateRunFromVersion,
} from "services/netMeteringService";

export default function AlgorithmSelection() {
  const {simulationId}=useParams();
  const navigate = useNavigate();
  const [algs, setAlgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState(null);

  // map display_name → your local image file
  const logoMap = {
    "Net Metering": "/images/NetMeter.png",
    "Autonomous Bidding": "/images/Autonomous.png",
    "Special Groups": "/images/SpecialGroup.png",
    "Option -4": "/images/Option.png",
  };

  useEffect(() => {
    fetchAlgorithms()
      .then((data) => {
        if (Array.isArray(data.items)) {
          setAlgs(data.items);
        } else {
          throw new Error("Invalid response format: expected data.items[]");
        }
      })
      .catch((err) => setError(err.message || "Unable to load algorithms"))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (alg) => {
    if (alg.display_name !== "Net Metering") {
      // not yet wired up
      return;
    }
    setLoading2(true);
    try {
      const res = await updateRunFromVersion({
        simulation_run_id: simulationId,
        topology_root_node_id: "6e6e0f2e-8b9e-4f88-a758-401c8281898c",
        simulation_algorithm_type_id: alg.id,
      });
      console.log(res);
      navigate(`/netmeter/netMetering/${simulationId}`);
    } catch (e) {
      console.error(e);
      setError("Failed to start simulation");
    } finally {
      setLoading2(false);
    }
  };
  if (loading2) {
    return (
      <div className="flex flex-col h-screen ">
        <Navbar />
        <div className="flex flex-1 items-center justify-center  bg-gradient-to-br from-[#6CCECD] to-[#356770]">
          <span className="text-navColor">Updating Simulation</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen ">
        <Navbar />
        <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-[#6CCECD] to-[#356770]">
          <span className="text-navColor">Loading Algorithms…</span>
        </div>
      </div>
    );
  }
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
     <div className="relative flex flex-col h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
      <Navbar />
      <button
        onClick={() => navigate(-1)}
        className="absolute top-24 left-4 w-20 h-12 rounded-full border border-[#D59805] bg-[#FFF8E6] hover:bg-[#FFF3D7] flex items-center justify-center transition-colors shadow-[0px_5px_10px_0px_#00000040]"
      >
        <img src="/images/Arrow 3.png" alt="Back" className="w-6 h-6" />
      </button>
      <div className="flex flex-1 pt-20">
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <div className="w-full max-w-5xl p-12 bg-[linear-gradient(135.13deg,rgba(246,255,255,0.5)_100%,rgba(141,144,144,0.5)_100%)] rounded-2xl shadow-[0px_-2px_8px_0px_#00000040]">
            <h2 className="text-center text-xl font-medium mb-20 text-navColor">
              Please select one of the following algorithms to simulate the energy flow
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {algs.map((alg) => {
                const logoSrc = logoMap[alg.display_name] || "/images/default-logo.png";
                return (
                  <button
                    key={alg.id}
                    onClick={() => handleSelect(alg)}
                    className="flex flex-row gap-3 items-center justify-center w-full h-24 p-6 rounded-lg  shadow-[0px_5px_10px_0px_#00000040] transition bg-[#F0DBA4] text-navColor hover:bg-[#FFB600] hover:cursor-pointer"
                  >
                    <img loading="lazy" src={logoSrc} alt={alg.display_name} className="w-5 h-5" />
                    <span className="text-center font-semibold">{alg.display_name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
