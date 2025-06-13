import { useState } from "react";
import Navbar from "./Navbar";

export default function SimulationList() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpenFor, setMenuOpenFor] = useState(null);

  const sims = [
    {
      id: "SM-01",
      title: "Preferential Partial Allocation",
      description:
        "Isolates and assesses the new 'Preferential Allocation' algorithm's effectiveness in prioritizing critical loads compared to the baseline 'Standard Allocation' engine.",
      status: "Completed",
    },
    {
      id: "SM-02",
      title: "Low Solar Winter",
      description:
        "Simulates network performance and battery storage dependency during a 5-day period with significantly reduced solar irradiance to test grid stability.",
      status: "Failed",
    },
    {
      id: "SM-03",
      title: "High EV Adoption",
      description:
        "Models the grid impact of a 40% increase in household EV chargers and tests the 'Smart Charging' allocation strategy to mitigate evening peak loads.",
      status: "Active",
    },
    {
      id: "SM-04",
      title: "Preferential Partial Allocation",
      description:
        "Models the grid impact of a 40% increase in household EV chargers and tests the 'Smart Charging' allocation strategy to mitigate evening peak loads.",
      status: "Draft",
    },
    {
      id: "SM-05",
      title: "Preferential Partial Allocation",
      description:
        "Models the grid impact of a 40% increase in household EV chargers and tests the 'Smart Charging' allocation strategy to mitigate evening peak loads.",
      status: "Completed",
    },
  
  ];

  const badgeColor = {
    Completed: "bg-[#74AA50]/30 text-[#4A890B]",
    Failed: "bg-[#FF725E]/30   text-[#B21919]",
    Active: "bg-[#2BC5C0] text-[#237B78]",
    Draft: "bg-[#B0B0B0]/30  text-[#767878]",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
      <Navbar />

      <main className="flex flex-col pt-24 px-6 h-screen">
        {/* Search + Filter */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-8 shrink-0">
          {/* back */}
          <button className="w-20 h-12 rounded-full bg-[#FFF8E6] hover:bg-[#FFF3D7] flex items-center justify-center"
           onClick={() => window.history.back()}>
            <img src="/images/Arrow 3.png" className="w-8 h-6" alt="" />
          </button>
          {/* search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search a simulation version"
              className="w-full bg-white/90 rounded-full border-none py-3 px-6 pr-16 placeholder-[#9E9E9E]"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-10 rounded-full bg-[#FFB600] hover:bg-[#E9AB09] flex items-center justify-center"
            >
              <img src="/images/Line 155.png" className="mt-1 w-6 h-5" alt="" />
            </button>
          </div>
          {/* filter */}
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
                <div className=" bg-white rounded-lg shadow border absolute flex  flex-col z-10 items-center border-1 border-[#8E8E8E]/80 right-0 mt-2 w-40 p-2 ">
                  {["Recently Added", "Oldest First", "Status"].map((opt) => (
                    <button
                      key={opt}
                      className=" block w-full px-4 rounded-md  py-2 text-sm text-navColor hover:bg-[#D3DDDE]"
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
            <p className="text-[#000505] text-sm mb-1">Versions</p>
            <h1 className="text-[#000505] text-4xl font-bold">
              Net Metering Test
            </h1>
          </div>
          <button className="bg-[#FFB600] hover:bg-[#E9AB09] text-[#23474F] font-semibold rounded-lg py-3 px-4 flex items-center gap-6 shadow">
            <img src="/images/Icon.png" className="w-5 h-5" alt="" />
            Add New Version
          </button>
        </div>

        {/* Column Labels */}
        <div
          className="grid grid-cols-[80px_2fr_5fr_auto]    
                        px-4 py-2 text-white font-semibold
                        rounded-t-2xl "
        >
          <div className="px-1"  >ID</div>
          <div className="px-5" >Title</div>
          <div className="px-24">Description</div>
          <div className=" px-72 justify-self-start">Status</div>
        </div>

        {/* List (grows, scrollbar only here) */}
        <div className="flex-1 overflow-y-auto space-y-2 py-4 hide-scrollbar">
          {/* hide WebKit scrollbar */}
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          {sims.map((s, i) => (
            <div
              key={s.id}
              className="grid grid-cols-[80px_2fr_5fr_auto]
                             items-center 
                             divide-x divide-[#E0A800]
                             bg-white/75 rounded-2xl
                             p-4 hover:bg-white transition"
            >
              <div className="font-bold text-[#000505]">{s.id}</div>
              <div className="pl-4 font-bold text-[#000505]">{s.title}</div>
              <div className="px-4 text-[#000505] text-sm">{s.description}</div>
              <div className="flex items-center justify-start gap-2 pl-4">
                <span
                  className={`${
                    badgeColor[s.status]
                  } w-28 text-center  font-semibold py-1 rounded-full`}
                >
                  {s.status}
                </span>
                <button
                  className="bg-[#FFB600] hover:bg-[#E9AB09]
                                   text-[#070C21] font-medium text-sm
                                   rounded-2xl px-4 py-2 flex items-center gap-1"
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
                    onClick={() => setMenuOpenFor((o) => (o === i ? null : i))}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <img src="/images/Frame 610.png" alt="Menu" />
                  </button>
                  {menuOpenFor === i && (
                    <div className="absolute flex  flex-col z-10 items-center border-1 border-[#8E8E8E]/80 right-0 mt-2 w-36 p-2 bg-white rounded-lg shadow border">
                      {["Edit Version", "Clone","Download File", "Delete"].map((opt) => (
                        <button
                          key={opt}
                          className="block w-full px-2 rounded-md  py-2 text-sm text-navColor hover:bg-[#D3DDDE]"
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
      </main>
    </div>
  );
}
