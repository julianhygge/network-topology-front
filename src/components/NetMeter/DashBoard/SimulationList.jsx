import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { fetchSimulationRunsByContainer } from "services/netMeteringService";

export default function SimulationList() {
  const { simulationId } = useParams();
  const navigate = useNavigate();

  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [isViewProgress, setIsViewProgress] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [selectedRunProgressTitle, setSelectedRunProgressTitle] = useState("");

  // API state
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search] = useSearchParams();
  const simulationName = search.get("name") || "";

  useEffect(() => {
    fetchSimulationRunsByContainer(simulationId)
      .then((data) => setRuns(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load versions"))
      .finally(() => setLoading(false));
  }, [simulationId]);

  console.log(runs);

  const badgeColor = {
    PENDING: "bg-[#B0B0B0]/30 text-[#767878]",
    COMPLETED: "bg-[#74AA50]/30 text-[#4A890B]",
    FAILED: "bg-[#FF725E]/30 text-[#B21919]",
    ERROR: "bg-[#FF725E]/30 text-[#B21919]",
    ACTIVE: "bg-[#2BC5C0] text-[#237B78]",
  };

  const handleSelectRun = (run_name, run_identifier, id) => {
    setIsViewProgress(true);
    setSelectedRunId(id);
    setSelectedRunProgressTitle(`${run_name} (${run_identifier})`);
  };

  const handleNetworkTopologyPageRoute = () => {
    navigate("/");
  };

  const handleAlgorithmsPageRoute = () => {
    navigate("/netmeter");
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <span className="text-black">Loading versions…</span>
        </div>
      </div>
    );
  }

  // Error
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

  // No versions
  if (runs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
        <Navbar />
        <main className="flex flex-col h-[calc(100vh-4rem)] pt-20">
          <div className="flex flex-row gap-16 px-6 pt-6">
            <button
              onClick={() => navigate(-1)}
              className=" w-20 h-12 rounded-full border-[1px] border-[#D59805] bg-[#FFF8E6] hover:bg-[#FFF3D7] flex  items-center justify-center transition-colors shadow"
            >
              <img src="/images/Arrow 3.png" alt="Back" className="w-6 h-6" />
            </button>
            <div>
              <p className="text-[#000505] text-2xl mb-1">Versions</p>
              <h1 className="text-[#000505] text-4xl font-bold">
                {" "}
                {simulationName}
              </h1>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center px-14">
            <div className="bg-[#F6FFFF]/50 rounded-lg shadow-lg p-10 max-w-xl w-full text-center">
              <img
                src="/images/NoSim.png"
                alt="No Simulations"
                className="mx-auto mb-8"
              />
              <h2 className="text-4xl font-bold mb-6">No Versions Yet!</h2>
              <p className="mb-10 text-gray-700">
                Click below to start your first simulation version
              </p>
              <button
                onClick={() =>
                  navigate(
                    `/create/version/${simulationId}?name=${encodeURIComponent(
                      simulationName
                    )}`
                  )
                }
                className="mx-auto bg-[#FFB600] hover:bg-[#E0A800] text-black font-medium px-9 py-3 rounded-lg flex items-center gap-2"
              >
                <Plus size={20} /> Add New Version
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
      <Navbar />

      <main className="flex flex-col pt-24 px-6">
        {/* Search + Filter */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-8 shrink-0">
          <button
            className="w-20 h-12 rounded-full bg-[#FFF8E6] hover:bg-[#FFF3D7] flex items-center justify-center"
            onClick={() => window.history.back()}
          >
            <img src="/images/Arrow 3.png" className="w-8 h-6" alt="" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search a simulation version"
              className="w-full bg-white/90 rounded-full border-none py-3 px-6 pr-16 placeholder-[#9E9E9E]"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-10 rounded-full bg-[#FFB600] hover:bg-[#E9AB09] flex items-center justify-center">
              <img src="/images/Line 155.png" className="mt-1 w-6 h-5" alt="" />
            </button>
          </div>
          <div className="flex items-center gap-1 bg-[#557377] rounded-full shrink-0">
            <span className="text-white font-medium px-4">Filter By</span>
            <div className="relative">
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="bg-[#FFF8E6] hover:bg-[#FFF3D7] rounded-full py-2 px-4 flex items-center gap-3"
              >
                <span className="text-navColor">Recently Added</span>
                <img src="/images/Vector (2).png" className="w-3 h-2" alt="" />
              </button>
              {filterOpen && (
                <div className="bg-white rounded-lg shadow border absolute flex flex-col z-10 items-center border-1 border-[#8E8E8E]/80 right-0 mt-2 w-40 p-2">
                  {["Recently Added", "Oldest First", "Status"].map((opt) => (
                    <button
                      key={opt}
                      className="block w-full px-4 rounded-md py-2 text-sm text-navColor hover:bg-[#D3DDDE]"
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 shrink-0">
          <div>
            <p className="text-[#000505] text-2xl mb-1">Versions</p>
            <h1 className="text-[#000505] text-4xl font-bold">
              {" "}
              {simulationName}
            </h1>
          </div>
          <button
            className="bg-[#FFB600] hover:bg-[#E9AB09] text-[#23474F] font-semibold rounded-lg py-3 px-4 flex items-center gap-6 shadow"
            onClick={() =>
              navigate(
                `/create/version/${simulationId}?name=${encodeURIComponent(
                  simulationName
                )}`
              )
            }
          >
            <img src="/images/Icon.png" className="w-5 h-5" alt="" />
            Add New Version
          </button>
        </div>

        {isViewProgress ? (
          <div className="flex w-full h-full">
            {/* left side view */}
            <div className="w-[520px]">
              <div className="grid grid-cols-[80px_1.5fr] px-4 py-2 text-white font-semibold rounded-t-2xl">
                <div className="px-1">ID</div>
                <div className="px-5">Title</div>
              </div>
              <div className="h-[420px] overflow-y-auto space-y-2 hide-scrollbar">
                {runs.map((r) => {
                  const isSelected = r.id === selectedRunId;
                  return (
                    <div
                      key={r.id}
                      className={`
                    grid grid-cols-[80px_300px_100px]
                    items-center divide-x divide-[#E0A800]
                    bg-white/75 rounded-2xl p-4
                    hover:bg-white transition cursor-pointer 
                  `}
                      style={
                        isSelected
                          ? {
                              border: "2px solid #E4A83A",
                            }
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
                          onClick={() =>
                            handleSelectRun(
                              r.run_name,
                              r.run_sequence_identifier.toUpperCase(),
                              r.id
                            )
                          }
                          className="bg-[#FFB600] hover:bg-[#E9AB09] text-[#070C21] font-medium text-sm rounded-2xl px-4 py-2 flex items-center gap-1"
                        >
                          Edit
                          <img
                            src="/images/Frame 230.png"
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

            {/* vertical bar */}
            <div className="w-[2px] bg-gradient-to-b from-[#FFB600] to-[#996D00] mx-2 rounded-full mt-12"></div>

            {/* right side view */}
            <div className="flex-1">
              <div className="grid grid-cols-[1fr] px-4 py-2 text-white font-semibold rounded-t-2xl">
                <div className="px-1">Progress</div>
              </div>
              <div className="h-[530px] w-full bg-white/75 mt-[7px] border border-[#9A9A9A] rounded-2xl">
                <div className="flex flex-col justify-center items-center p-8 gap-8 w-full">
                  <div className="w-full text-center text-2xl font-semibold">
                    {selectedRunProgressTitle}
                  </div>
                  {/* steps */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-center gap-4">
                      <div>
                        <img
                          src="/images/network_topology.svg"
                          alt="network topology icon"
                          className="w-12 h-12"
                        />
                      </div>
                      <div className="font-semibold text-2xl">
                        Network Topology
                      </div>
                      <div className="w-[280px] h-[210px] bg-white border-[#498D07] rounded-2xl border-2 p-4 space-y-8 shadow">
                        <p className="text-[#000505]">
                          Define or Modify the grid, assets, and profiles for
                          this version
                        </p>
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={handleNetworkTopologyPageRoute}
                            className="flex items-center justify-center gap-2 bg-[#71E8E8] hover:bg-teal-400 font-medium py-2 rounded-xl"
                          >
                            <img
                              src="/images/eye_icon.svg"
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
                              src="/images/gear_icon.svg"
                              className="w-5 h-5"
                              alt=""
                            />
                            Configure Topology
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-col items-center gap-4">
                        <div>
                          <img
                            src="/images/allocation_icon.svg"
                            alt="network topology icon"
                            className="w-12 h-12"
                          />
                        </div>
                        <div className="font-semibold text-2xl">
                          Allocation Engine
                        </div>
                        <div className="w-[280px] h-[210px] bg-white rounded-2xl border border-gray-300 p-6 flex flex-col shadow-sm">
                          <p className="text-[#000505]">
                            Define allocation parameters for this version.
                          </p>
                          <button
                            onClick={handleAlgorithmsPageRoute}
                            className="mt-auto flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#070C21] font-semibold py-2 rounded-lg"
                          >
                            <img
                              src="/images/plus_circle_icon.svg"
                              className="w-5 h-5"
                              alt=""
                            />
                            Add Allocation Engine
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-col items-center gap-4">
                        <div>
                          <img
                            src="/images/results_icon.svg"
                            alt="network topology icon"
                            className="w-12 h-12"
                          />
                        </div>
                        <div className="font-semibold text-2xl">Results</div>
                        <div className="w-[280px] h-[210px] bg-white rounded-2xl border border-gray-300 p-6 flex flex-col shadow-sm">
                          <p className="text-[#000505]">
                            Review simulation output and visualizations.
                          </p>
                          <button className="mt-auto flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#070C21] font-semibold py-2 rounded-lg">
                            <img
                              src="/images/play_icon.svg"
                              className="w-5 h-5"
                              alt=""
                            />
                            Run Simulation
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* action buttons */}
                  <div className="flex gap-6">
                    <button className="bg-[#E63C3C]/50 hover:bg-[#E63C3C]/75 text-xl text-[#46000080] font-semibold px-14 py-3 rounded-lg shadow-md shadow-black/25">
                      Reset
                    </button>
                    <button className="bg-[#1BA13D]/50 hover:bg-[#1BA13D] text-xl text-white font-semibold px-14 py-3 rounded-lg shadow-md shadow-black/25">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[80px_2fr_5fr_auto] px-4 py-2 text-white font-semibold rounded-t-2xl">
              <div className="px-1">ID</div>
              <div className="px-5">Title</div>
              <div className="px-24">Description</div>
              <div className="px-72 justify-self-start">Status</div>
            </div>
            <div className="h-[420px] overflow-y-auto space-y-2 pb-2 hide-scrollbar">
              <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>
              {runs.map((r, i) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[80px_2fr_5fr_auto] items-center divide-x divide-[#E0A800] bg-white/75 rounded-2xl p-4 hover:bg-white transition"
                >
                  <div className="font-bold text-[#000505]">
                    {r.run_sequence_identifier.toUpperCase()}
                  </div>
                  <div className="pl-4 font-bold text-[#000505]">
                    {r.run_name}
                  </div>
                  <div className="px-4 text-[#000505] text-sm">
                    {r.description}
                  </div>
                  <div className="flex items-center justify-start gap-2 pl-4">
                    <span
                      className={`${
                        badgeColor[r.status?.toUpperCase() || "PENDING"]
                      } w-28 text-center font-semibold py-1 rounded-full`}
                    >
                      {r.status
                        ? r.status.charAt(0).toUpperCase() +
                          r.status.slice(1).toLowerCase()
                        : "Pending"}
                    </span>
                    <button
                      className="bg-[#FFB600] hover:bg-[#E9AB09] text-[#070C21] font-medium text-sm rounded-2xl px-4 py-2 flex items-center gap-1"
                      onClick={() =>
                        handleSelectRun(
                          r.run_name,
                          r.run_sequence_identifier.toUpperCase(),
                          r.id
                        )
                      }
                    >
                      View &amp; Edit Progress
                      <img
                        src="/images/Frame 230.png"
                        className="w-4 h-4"
                        alt="Edit"
                      />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpenFor((o) => (o === i ? null : i))
                        }
                        className="p-2 rounded-full hover:bg-gray-100"
                      >
                        <img src="/images/Frame 610.png" alt="Menu" />
                      </button>
                      {menuOpenFor === i && (
                        <div className="absolute flex flex-col z-10 items-center border-1 border-[#8E8E8E]/80 right-0 mt-2 w-36 p-2 bg-white rounded-lg shadow border">
                          {[
                            "Edit Version",
                            "Clone",
                            "Download File",
                            "Delete",
                          ].map((opt) => (
                            <button
                              key={opt}
                              className="block w-full px-2 rounded-md py-2 text-sm text-navColor hover:bg-[#D3DDDE]"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
