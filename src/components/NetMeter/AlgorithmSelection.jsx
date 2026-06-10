import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "components/Common/Navbar";
import {
  fetchAlgorithms,
  fetchSimulationRun,
  fetchTopologyReadiness,
  updateRunFromVersion,
} from "services/netMeteringService";
import { getSubstations } from "services/Substation";

export default function AlgorithmSelection() {
  const {simulationId}=useParams();
  const navigate = useNavigate();
  const [algs, setAlgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [checkingReadiness, setCheckingReadiness] = useState(true);

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

  // Validate that every house in the run's topology has the profiles
  // required to simulate (load profile mandatory, solar optional).
  useEffect(() => {
    const checkReadiness = async () => {
      try {
        let rootNodeId = null;
        try {
          const run = await fetchSimulationRun(simulationId);
          rootNodeId = run?.topology_root_node_id || null;
        } catch (e) {
          /* run not found — fall back below */
        }
        if (!rootNodeId) {
          const subs = await getSubstations();
          rootNodeId = subs?.items?.[0]?.id || null;
        }
        if (!rootNodeId) {
          setReadiness({ ready: false, total_houses: 0, houses: [] });
          return;
        }
        const data = await fetchTopologyReadiness(rootNodeId);
        setReadiness(data);
      } catch (err) {
        console.error("Error checking topology readiness:", err);
        setReadiness(null); // unknown — don't block
      } finally {
        setCheckingReadiness(false);
      }
    };
    checkReadiness();
  }, [simulationId]);

  const notReady = readiness !== null && !readiness.ready;
  const incompleteHouses = (readiness?.houses || []).filter(
    (h) => !h.has_load_profile
  );

  const handleSelect = async (alg) => {
    if (alg.display_name !== "Net Metering") {
      // not yet wired up
      return;
    }
    if (notReady || checkingReadiness) {
      return;
    }
    setLoading2(true);
    try {
      // Prefer the topology already selected on the run (progress page);
      // fall back to the first substation if none was set.
      let rootNodeId = null;
      try {
        const run = await fetchSimulationRun(simulationId);
        rootNodeId = run?.topology_root_node_id || null;
      } catch (err) {
        console.warn("Could not fetch run, falling back to first grid", err);
      }
      if (!rootNodeId) {
        const subs = await getSubstations();
        rootNodeId = subs?.items?.[0]?.id || null;
      }
      if (!rootNodeId) throw new Error("No substation found in topology");
      const res = await updateRunFromVersion({
        simulation_run_id: simulationId,
        topology_root_node_id: rootNodeId,
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
          <span className="text-navColor">Loading Algorithms...</span>
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
        <img src={`${process.env.PUBLIC_URL}/images/Arrow 3.png`} alt="Back" className="w-6 h-6" />
      </button>
      <div className="flex flex-1 pt-20">
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <div className="w-full max-w-5xl p-12 bg-[linear-gradient(135.13deg,rgba(246,255,255,0.5)_100%,rgba(141,144,144,0.5)_100%)] rounded-2xl shadow-[0px_-2px_8px_0px_#00000040]">
            <h2 className="text-center text-xl font-medium mb-8 text-navColor">
              Please select one of the following algorithms to simulate the energy flow
            </h2>
            {notReady && (
              <div className="mb-8 p-4 bg-[#FFF3CD] border border-[#D59805] rounded-lg text-[#664D03]">
                <p className="font-semibold mb-2">
                  ⚠ The topology for this version is not ready to simulate.
                </p>
                {readiness.total_houses === 0 ? (
                  <p>
                    The selected grid has no houses. Configure the topology
                    first (add houses with load profiles).
                  </p>
                ) : (
                  <>
                    <p className="mb-1">
                      These houses are missing a load profile (required for
                      billing):
                    </p>
                    <ul className="list-disc ml-6">
                      {incompleteHouses.map((h) => (
                        <li key={h.house_id}>
                          {h.house_name || h.house_id}
                          {!h.has_solar_profile &&
                            " (also missing solar profile)"}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2">
                      Complete them from the topology view (house → Load
                      Profile tab) and come back.
                    </p>
                  </>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {algs.map((alg) => (
                <button
                  key={alg.id}
                  onClick={() => handleSelect(alg)}
                  disabled={notReady || checkingReadiness}
                  className={`flex flex-row gap-3 items-center justify-center w-full h-24 p-6 rounded-lg shadow-[0px_5px_10px_0px_#00000040] transition ${
                    notReady || checkingReadiness
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#F0DBA4] text-navColor hover:bg-[#FFB600] hover:cursor-pointer"
                  }`}
                >
                  <span className="text-center font-semibold">{alg.display_name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
