import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  fetchAlgorithms,
  fetchSimulationRunsByContainer,
  updateRunFromVersion,
} from "services/netMeteringService";
import { getSubstations } from "services/Substation";

export default function SimulationProgress() {
  const { simulationId } = useParams();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const simulationName = search.get("name") || "";

  // UI state
  const [filterOpen, setFilterOpen] = useState(false);

  // API state
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Which run to show
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [selectedRunProgressTitle, setSelectedRunProgressTitle] = useState("");

  // Grid (topology root) selection for the selected run
  const [substations, setSubstations] = useState([]);
  const [savingGrid, setSavingGrid] = useState(false);
  const [algorithms, setAlgorithms] = useState([]);

  useEffect(() => {
    getSubstations()
      .then((data) => setSubstations(data?.items || []))
      .catch((err) => console.error("Error fetching substations:", err));
    fetchAlgorithms()
      .then((data) => setAlgorithms(Array.isArray(data.items) ? data.items : []))
      .catch((err) => console.error("Error fetching algorithms:", err));
  }, []);

  const selectedRun = runs.find((r) => r.id === selectedRunId);
  const selectedGridId = selectedRun?.topology_root_node_id || "";
  const configuredAlgorithm = selectedRun?.simulation_algorithm_type_id
    ? algorithms.find(
        (a) => a.id === selectedRun.simulation_algorithm_type_id
      ) || { display_name: "Allocation engine" }
    : null;

  const handleGridChange = async (gridId) => {
    if (!gridId || !selectedRunId) return;
    setSavingGrid(true);
    try {
      await updateRunFromVersion({
        simulation_run_id: selectedRunId,
        topology_root_node_id: gridId,
      });
      setRuns((prev) =>
        prev.map((r) =>
          r.id === selectedRunId
            ? { ...r, topology_root_node_id: gridId }
            : r
        )
      );
      const grid = substations.find((s) => s.id === gridId);
      toast.success(`Topology set to ${grid?.name || "selected grid"}`);
    } catch (err) {
      toast.error("Failed to update the topology for this version");
    } finally {
      setSavingGrid(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSimulationRunsByContainer(simulationId)
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setRuns(arr);

        // select first run by default
        if (arr.length > 0) {
          const first = arr[0];
          setSelectedRunId(first.id);
          setSelectedRunProgressTitle(
            `${first.run_name} (${first.run_sequence_identifier.toUpperCase()})`
          );
        }
      })
      .catch(() => setError("Failed to load versions"))
      .finally(() => setLoading(false));
  }, [simulationId]);

  const goBack = () => navigate(-1);

  const handleSelectRun = (r) => {
    setSelectedRunId(r.id);
    setSelectedRunProgressTitle(
      `${r.run_name} (${r.run_sequence_identifier.toUpperCase()})`
    );
  };

  const handleNetworkTopologyPageRoute = () => navigate("/");
  const handleAlgorithmsPageRoute = () => navigate(`/netmeter/${selectedRunId}`);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <span className="text-black">Loading…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <span className="text-black">No Versions Yet!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
      <Navbar />

      <main className="flex flex-col pt-24 px-6">
        {/* Search + Filter */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-8">
          <button
            onClick={goBack}
            className="w-20 h-12 rounded-full bg-[#FFF8E6] hover:bg-[#FFF3D7] flex items-center justify-center"
          >
            <img src={`${process.env.PUBLIC_URL}/images/Arrow 3.png`} className="w-8 h-6" alt="Back" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search a simulation version"
              className="w-full bg-white/90 rounded-full border-none py-3 px-6 pr-16 placeholder-[#9E9E9E]"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-10 rounded-full bg-[#FFB600] hover:bg-[#E9AB09] flex items-center justify-center">
              <img
                src= {`${process.env.PUBLIC_URL}/images/Line 155.png`}
                className="mt-1 w-6 h-5"
                alt="Search"
              />
            </button>
          </div>
          <div className="flex items-center gap-1 bg-[#557377] rounded-full">
            <span className="text-white font-medium px-4">Filter By</span>
            <div className="relative">
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="bg-[#FFF8E6] hover:bg-[#FFF3D7] rounded-full py-2 px-4 flex items-center gap-3"
              >
                <span className="text-navColor">Recently Added</span>
                <img
                  src={`${process.env.PUBLIC_URL}/images/Vector (2).png`}
                  className="w-3 h-2"
                  alt="▼"
                />
              </button>
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow p-2">
                  {["Recently Added", "Oldest First", "Status"].map((opt) => (
                    <button
                      key={opt}
                      className="block w-full text-left px-4 py-2 text-navColor hover:bg-[#D3DDDE]"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Header + Add */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3 gap-4">
          <div>
            <p className="text-[#000505] text-2xl mb-1">Versions</p>
            <h1 className="text-[#000505] text-4xl font-bold">
              {simulationName}
            </h1>
          </div>
          <button
            onClick={() =>
              navigate(
                `/create/version/${simulationId}?name=${encodeURIComponent(
                  simulationName
                )}`
              )
            }
            className="bg-[#FFB600] hover:bg-[#E9AB09] text-[#23474F] font-semibold rounded-lg py-3 px-4 flex items-center gap-6 shadow"
          >
            <Plus size={20} />
            Add New Version
          </button>
        </div>

        {/* View & Progress (exactly your original JSX) */}
        <div className="flex w-full h-full">
          {/* Left panel */}
          <div className="flex-shrink-0 basis-1/3 max-w-sm lg:basis-1/4 lg:max-w-md">
            <div className="grid grid-cols-[80px_1.5fr] px-4 py-2 text-white font-semibold rounded-t-2xl">
              <div className="px-1">ID</div>
              <div className="px-5">Title</div>
            </div>
            <div className="max-h-[60vh]  overflow-y-auto space-y-2 hide-scrollbar">
              {runs.map((r) => {
                const isSelected = r.id === selectedRunId;
                return (
                  <div
                    key={r.id}
                    className={`
                      grid grid-cols-[80px_250px_100px]
                      items-center divide-x divide-[#E0A800]
                      bg-white/75 rounded-2xl p-4
                      hover:bg-white transition cursor-pointer
                    `}
                    style={
                      isSelected
                        ? { border: "2px solid #E4A83A" }
                        : undefined
                    }
                  >
                    <div className="font-semibold text-[#000505] text-lg">
                      {r.run_sequence_identifier.toUpperCase()}
                    </div>
                    <div className="pl-4 font-semibold text-[#000505] text-lg">
                      {r.run_name}
                    </div>
                    <div className="flex items-center justify-start gap-2 pl-4">
                      <button
                        onClick={() => handleSelectRun(r)}
                        className="bg-[#FFB600] hover:bg-[#E9AB09] text-[#070C21] font-medium text-sm rounded-2xl px-4 py-2 flex items-center gap-1"
                      >
                        Edit
                        <img
                          src= {`${process.env.PUBLIC_URL}/images/Frame 230.png`}
                          className="w-4 h-4"
                          alt="Edit"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="w-[2px] bg-gradient-to-b from-[#FFB600] to-[#996D00] mx-2 rounded-full mt-12" />

          {/* Right panel */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-[1fr] px-4 py-2 text-white font-semibold rounded-t-2xl">
              <div className="px-1">Progress</div>
            </div>
            <div className="w-full bg-white/75 border border-[#9A9A9A] rounded-2xl max-h-[80vh] md:max-h-[65vh] overflow-y-auto">
              <div className="flex flex-col justify-center items-center p-5 gap-7 w-full">
                <div className="w-full text-center text-2xl font-semibold">
                  {selectedRunProgressTitle}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[1200px] mx-auto">
                  {/* Network Topology */}
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/network_topology.svg`}
                      alt="network topology icon"
                      className="w-12 h-12"
                    />
                    <div className="font-semibold text-2xl">
                      Network Topology
                    </div>
                    <div className="w-full bg-white border-2 border-[#498D07] rounded-2xl p-4 shadow min-h-[215px] flex flex-col flex-1">
                      <div className="space-y-4">
                        <p className="text-[#000505]">
                          Define or Modify the grid, assets, and profiles for
                          this version
                        </p>
                        <div>
                          <label className="block text-sm font-semibold text-[#000505] mb-1">
                            Grid used by this version:
                          </label>
                          <select
                            value={selectedGridId}
                            disabled={savingGrid}
                            onChange={(e) => handleGridChange(e.target.value)}
                            className="w-full h-10 px-2 border border-gray-400 rounded-lg bg-white text-[#000505] disabled:opacity-50"
                          >
                            <option value="" disabled>
                              Select a grid…
                            </option>
                            {substations.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-3 mt-auto">
                          <button
                            onClick={handleNetworkTopologyPageRoute}
                            className="flex items-center justify-center gap-2 bg-[#71E8E8] hover:bg-teal-400 font-medium py-2 rounded-xl"
                          >
                            <img
                              src={`${process.env.PUBLIC_URL}/images/eye_icon.svg`}
                              className="w-5 h-5"
                              alt=""
                            />
                            Quick View
                          </button>
                          <button
                            onClick={handleNetworkTopologyPageRoute}
                            className="flex items-center justify-center gap-2 bg-[#FFB600] hover:bg-[#E0A800] font-medium py-2 rounded-xl"
                          >
                            <img
                              src={`${process.env.PUBLIC_URL}/images/gear_icon.svg`}
                              className="w-5 h-5"
                              alt=""
                            />
                            Configure Topology
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Allocation Engine */}
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/allocation_icon.svg`}
                      alt="allocation engine icon"
                      className="w-12 h-12"
                    />
                    <div className="font-semibold text-2xl">
                      Allocation Engine
                    </div>
                    <div className="w-full bg-white border border-gray-300 rounded-2xl p-6 shadow-sm min-h-[215px] flex flex-col justify-between">
                      {configuredAlgorithm ? (
                        <>
                          <div>
                            <p className="text-[#000505] mb-2">
                              Allocation engine configured:
                            </p>
                            <p className="font-bold text-lg text-[#23474F]">
                              {configuredAlgorithm.display_name}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() =>
                                navigate(`/housebill/${selectedRunId}`)
                              }
                              className="flex items-center justify-center gap-2 bg-[#74AA50] hover:bg-[#7CB342] text-white font-semibold py-2 rounded-lg"
                            >
                              View House Bills
                            </button>
                            <button
                              onClick={handleAlgorithmsPageRoute}
                              className="text-sm text-[#23474F] underline hover:text-black"
                            >
                              Change allocation engine
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-[#000505]">
                            Define allocation parameters for this version.
                          </p>
                          <button
                            onClick={handleAlgorithmsPageRoute}
                            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#070C21] font-semibold py-2 rounded-lg"
                          >
                            <img
                              src={`${process.env.PUBLIC_URL}/images/plus_circle_icon.svg`}
                              className="w-5 h-5"
                              alt=""
                            />
                            Add Allocation Engine
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Results */}
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/results_icon.svg`}
                      alt="results icon"
                      className="w-12 h-12"
                    />
                    <div className="font-semibold text-2xl">Results</div>
                    <div className="w-full bg-white border border-gray-300 rounded-2xl p-6 shadow-sm min-h-[215px] flex flex-col justify-between">
                      <p className="text-[#000505]">
                        Review simulation output and visualizations.
                      </p>
                      <button className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#070C21] font-semibold py-2 rounded-lg">
                        <img
                          src={`${process.env.PUBLIC_URL}/images/play_icon.svg`}
                          className="w-5 h-5"
                          alt=""
                        />
                        Run Simulation
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-6">
                  <button className="bg-[#E63C3C]/50 hover:bg-[#E63C3C]/75 text-xl text-[#46000080] font-semibold px-14 py-2 rounded-lg shadow-md shadow-black/25">
                    Reset
                  </button>
                  <button className="bg-[#1BA13D]/50 hover:bg-[#1BA13D] text-xl text-white font-semibold px-14 py-2 rounded-lg shadow-md shadow-black/25">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
