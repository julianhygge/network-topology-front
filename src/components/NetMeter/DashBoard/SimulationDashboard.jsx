import React, { useState, useEffect } from "react";
import {
  Plus,
  MoreVertical,
  Download,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { fetchSimulationContainers } from "services/netMeteringService";

export default function SimulationDashboard() {
  const navigate = useNavigate();
  const perPage = 3;

  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchSimulationContainers()
      .then((data) => {
        setRuns(Array.isArray(data.items) ? data.items : []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load simulations");
      })
      .finally(() => setLoading(false));
  }, []);

  // carousel math
  const maxOffset = Math.max(0, runs.length - perPage) * (100 / perPage);
  const prev = () => setOffset((o) => Math.max(o - 100 / perPage, 0));
  const next = () => setOffset((o) => Math.min(o + 100 / perPage, maxOffset));

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
        <main className="flex items-center justify-center h-[calc(100vh-4rem)] px-14">
          <div className="bg-[#F6FFFF]/50 rounded-lg shadow-lg p-10 max-w-xl w-full text-center">
            <img
              src={`${process.env.PUBLIC_URL}/images/NoSim.png`}
              alt="No Simulations"
              className="mx-auto mb-8"
            />
            <h2 className="text-4xl font-bold mb-6">No Simulations Yet!</h2>
            <p className="mb-10 text-gray-700">
              Click below to start your first simulation
            </p>
            <button
              onClick={() => navigate("/create")}
              className="mx-auto bg-[#FFB600] hover:bg-[#E0A800] text-black px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} /> Create New Simulation
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
      <Navbar />

      <main className="flex flex-col mx-auto px-16 pt-36">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold text-black">Simulation Runs</h2>
          <button
            onClick={() => navigate("/create")}
            className="bg-[#FFB600] hover:bg-amber-500 text-black px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Create New Simulation
          </button>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${offset}%)` }}
          >
            {runs.map((run) => {
              const statusObj = run.status || {};
              const completedCount = statusObj.COMPLETED || 0;
              const pendingCount = statusObj.PENDING || 0;
              const errorCount = statusObj.ERROR || 0;
              const totalVersions = completedCount + pendingCount + errorCount;

              const topology = run.topologyFile || "Something.json";
              const location = run.location_name || "Unknown location";
              const created = run.created_on
                ? new Date(run.created_on).toLocaleDateString()
                : "N/A";
              const modified = run.modified_on
                ? new Date(run.modified_on).toLocaleDateString()
                : "N/A";

              return (
                <div key={run.id} className="flex-shrink-0 w-1/3 px-2">
                  <div className="bg-[#F6FFFF]/85 rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold">{run.name}</h3>
                          <p className="text-gray-600">Run ID: {run.id}</p>
                        </div>
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="border-t border-[#9CAAAD] my-4" />

                      <p className="text-sm">{run.description}</p>

                      <div className="mt-4">
                        <h4 className="font-semibold">Version Summary:</h4>
                        <p>{totalVersions} Versions</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <span className="h-3 w-3 rounded-full bg-[#09A326]" />
                            {completedCount} completed
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="h-3 w-3 rounded-full bg-[#B3B3B3]" />
                            {pendingCount} pending
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="h-3 w-3 rounded-full bg-[#BC0E10]" />
                            {errorCount} error
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold">Base Topology:</h4>
                        <div className="flex justify-between items-center">
                          <p>{topology}</p>
                          <button className="p-1 rounded-full hover:bg-gray-100">
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold">Location:</h4>
                        <div className="flex justify-between items-center">
                          <p>{location}</p>
                          <button className="p-1 rounded-full hover:bg-gray-100">
                            <MapPin className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-gray-500 space-y-1">
                        <p>Created: {created}</p>
                        <p>Last Modified: {modified}</p>
                      </div>

                      <button
                        className="w-full mt-4 bg-[#FFB600] hover:bg-amber-500 text-black py-2 rounded-md flex items-center justify-center gap-2"
                        onClick={() =>
                          navigate(
                            `/dash/sim/${run.id}?name=${encodeURIComponent(
                              run.name
                            )}`
                          )
                        }
                      >
                        Open Simulation <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={prev}
            disabled={offset === 0}
            className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            disabled={offset >= maxOffset}
            className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
