import React, { useState, useEffect } from "react"
import Navbar from "./Navbar"
import { useNavigate, useParams } from "react-router-dom"
import { Plus } from "lucide-react"
import { fetchSimulationRunsByContainer } from "services/netMeteringService"

export default function SimulationList() {
  const { simulationId } = useParams()
  const navigate = useNavigate()

  const [filterOpen, setFilterOpen] = useState(false)
  const [menuOpenFor, setMenuOpenFor] = useState(null)
  const [isViewProgress, setIsViewProgress] = useState(false)

  // API state
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSimulationRunsByContainer(simulationId)
      .then((data) => setRuns(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load versions"))
      .finally(() => setLoading(false))
  }, [simulationId])

  const badgeColor = {
    PENDING:   "bg-[#B0B0B0]/30 text-[#767878]",
    COMPLETED: "bg-[#74AA50]/30 text-[#4A890B]",
    FAILED:    "bg-[#FF725E]/30 text-[#B21919]",
    ERROR:     "bg-[#FF725E]/30 text-[#B21919]",
    ACTIVE:    "bg-[#2BC5C0] text-[#237B78]",
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <span className="text-black">Loading versions…</span>
        </div>
      </div>
    )
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
    )
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
            <h1 className="text-[#000505] text-4xl font-bold">{simulationId.slice(0, 4)}</h1>
          </div>
          </div>
          <div className="flex flex-1 items-center justify-center px-14">
            <div className="bg-[#F6FFFF]/50 rounded-lg shadow-lg p-10 max-w-xl w-full text-center">
             <img src="/images/NoSim.png" alt="No Simulations" className="mx-auto mb-8" />
              <h2 className="text-4xl font-bold mb-6">No Versions Yet!</h2>
              <p className="mb-10 text-gray-700">
                Click below to start your first simulation version
              </p>
              <button
                onClick={() => navigate(`/create/version/${simulationId}`)}
                className="mx-auto bg-[#FFB600] hover:bg-[#E0A800] text-black font-medium px-9 py-3 rounded-lg flex items-center gap-2"
              >
                <Plus size={20} /> Add New Version
              </button>
            </div>
          </div>
        </main>
      </div>
    )
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
            <h1 className="text-[#000505] text-4xl font-bold">{simulationId.slice(0, 4)}</h1>
          </div>
          <button className="bg-[#FFB600] hover:bg-[#E9AB09] text-[#23474F] font-semibold rounded-lg py-3 px-4 flex items-center gap-6 shadow" 
           onClick={() => navigate(`/create/version/${simulationId}`)}>
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
                <style>{`
                  .hide-scrollbar::-webkit-scrollbar { display: none; }
                  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
                {/* your hard‑coded sims here */}
                <div className="grid grid-cols-[80px_300px_100px] items-center divide-x divide-[#E0A800] bg-white/75 rounded-2xl p-4 hover:bg-white transition">
                  <div className="font-semibold text-[#000505] text-lg">SM-01</div>
                  <div className="pl-4 font-semibold text-[#000505] text-lg">
                    Preferential Partial Allocation
                  </div>
                  <div className="flex items-center justify-start gap-2 pl-4">
                    <button className="bg-[#FFB600] hover:bg-[#E9AB09] text-[#070C21] font-medium text-sm rounded-2xl px-4 py-2 flex items-center gap-1">
                      Edit
                      <img src="/images/Frame 230.png" className="w-4 h-4" alt="Edit" />
                    </button>
                  </div>
                </div>
                {/* …repeat as you originally had… */}
              </div>
            </div>

            {/* vertical bar */}
            <div className="w-[2px] bg-gradient-to-b from-[#FFB600] to-[#996D00] mx-2 rounded-full mt-12"></div>

            {/* right side view */}
            <div className="flex-1">
              <div className="grid grid-cols-[1fr] px-4 py-2 text-white font-semibold rounded-t-2xl">
                <div className="px-1">Progress</div>
              </div>
              <div className="h-[413px] w-full bg-white/75 mt-[7px] border border-[#9A9A9A] rounded-2xl">
                <div className="flex flex-col justify-center items-center p-4 gap-[60px]">
                  <div>Preferential Partial Allocation (SM-01)</div>
                  {/* steps */}
                  <div className="flex gap-28">
                    <div className="flex flex-col">
                      <div>{/* image */}</div>
                      <div>Network Topology</div>
                    </div>
                    <div className="flex flex-col">
                      <div>{/* image */}</div>
                      <div>Allocation Engine</div>
                    </div>
                    <div className="flex flex-col">
                      <div>{/* image */}</div>
                      <div>Result</div>
                    </div>
                  </div>
                  {/* cards */}
                  <div className="flex">
                    <div className="flex flex-col">
                      <div>Define or Modify the grid…</div>
                      <button>Quick View</button>
                      <button>Configure Topology</button>
                    </div>
                    <div className="flex flex-col">
                      <div>Define Allocation parameter…</div>
                      <button>Add Allocation Engine</button>
                    </div>
                    <div className="flex flex-col">
                      <div>Review Simulation output…</div>
                      <button>Run Simulation</button>
                    </div>
                  </div>
                  {/* action buttons */}
                  <div className="flex gap-2">
                    <button className="bg-[#E63C3C]/50 text-[#46000080] font-semibold px-14 py-3 rounded-lg shadow-md shadow-black/25">
                      Reset
                    </button>
                    <button className="bg-[#1BA13D]/50 text-white font-semibold px-14 py-3 rounded-lg shadow-md shadow-black/25">
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
                  <div className="font-bold text-[#000505]">{r.id.slice(0, 4)}</div>
                  <div className="pl-4 font-bold text-[#000505]">{r.run_name}</div>
                  <div className="px-4 text-[#000505] text-sm">{r.description}</div>
                  <div className="flex items-center justify-start gap-2 pl-4">
                    <span
                      className={`${badgeColor[r.status?.toUpperCase() || "PENDING"]} w-28 text-center font-semibold py-1 rounded-full`}
                    >
                      {r.status
                        ? r.status.charAt(0).toUpperCase() +
                          r.status.slice(1).toLowerCase()
                        : "Pending"}
                    </span>
                    <button
                      className="bg-[#FFB600] hover:bg-[#E9AB09] text-[#070C21] font-medium text-sm rounded-2xl px-4 py-2 flex items-center gap-1"
                      onClick={() => setIsViewProgress(true)}
                    >
                      View &amp; Edit Progress
                      <img src="/images/Frame 230.png" className="w-4 h-4" alt="Edit" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpenFor((o) => (o === i ? null : i))}
                        className="p-2 rounded-full hover:bg-gray-100"
                      >
                        <img src="/images/Frame 610.png" alt="Menu" />
                      </button>
                      {menuOpenFor === i && (
                        <div className="absolute flex flex-col z-10 items-center border-1 border-[#8E8E8E]/80 right-0 mt-2 w-36 p-2 bg-white rounded-lg shadow border">
                          {["Edit Version", "Clone", "Download File", "Delete"].map((opt) => (
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
  )
}
