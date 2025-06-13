import React, { useState } from "react";
import Navbar from "./Navbar";

export default function SimulatorSettings() {
  const [timeStep, setTimeStep] = useState("5");
  const [powerUnit, setPowerUnit] = useState("Watt");
  const [algorithmEngine, setAlgorithmEngine] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    location: "",
    description: "",
  });

  const handleProfileChange = (e) =>
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleReset = () => {
    setTimeStep("5");
    setPowerUnit("Watt");
    setAlgorithmEngine("");
    setProfile({ name: "", location: "", description: "" });
  };
  const handleSave = () =>
    console.log({ timeStep, powerUnit, algorithmEngine, ...profile });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770] flex flex-col">
      <Navbar />

      <main className="flex-1 overflow-auto p-10 ">
        <div className="mb-4 mt-16 ">
          <button
            onClick={() => window.history.back()}
            className="w-20 h-12 rounded-full border-[1px] border-[#D59805] bg-[#FFF8E6] hover:bg-[#FFF3D7] flex items-center justify-center transition-colors shadow"
          >
            <img src="/images/Arrow 3.png" alt="Back" className="w-6 h-6" />
          </button>
        </div>

        <div className="mx-auto w-full max-w-4xl bg-[#F6FFFF]/50 rounded-2xl  shadow-lg p-10 px-14">
          <h2 className="text-3xl  font-bold text-black mb-6">
            Simulator Settings
          </h2>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-1 pr-6 space-y-6">
              <div>
                <p className=" text-2xl text-black font-medium mb-2">
                  Time Step
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["5", "5 min"],
                    ["15", "15 min"],
                    ["30", "30 min"],
                    ["custom", "Custom"],
                  ].map(([val, label]) => (
                    <label key={val} className="inline-flex items-center gap-3">
                      <input
                        type="radio"
                        name="timeStep"
                        value={val}
                        checked={timeStep === val}
                        onChange={() => setTimeStep(val)}
                        className="custom-radio"
                      />
                      <span className="text-black text-lg font-normal">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-2xl text-black font-medium mb-3">
                  Power Unit
                </label>
                <select
                  value={powerUnit}
                  onChange={(e) => setPowerUnit(e.target.value)}
                  className="w-full bg-white border border-yellow-400 rounded-xl px-3 py-3  outline-none"
                >
                  <option>Watt</option>
                  <option>KW</option>
                  <option>MW</option>
                </select>
              </div>

              <div>
                <label className="block text-2xl text-black font-medium mb-3">
                  Algorithm Engine
                </label>
                <select
                  value={algorithmEngine}
                  onChange={(e) => setAlgorithmEngine(e.target.value)}
                  disabled
                  className="w-full bg-[#8D9090]/88 border border-yellow-400 rounded-xl px-3 py-3 outline-none cursor-not-allowed "
                >
                  <option value="">Select engine…</option>
                  <option value="autonomous">Autonomous Bidding</option>
                  <option value="netMetering">Net Metering</option>
                  <option value="specialGroups">Special Groups</option>
                </select>
              </div>
            </div>
            <div className="w-[2px] bg-gradient-to-b from-[#FCB712] to-[#916600] rounded-full" />

            {/* Right Column */}
            <div className="flex-1 pl-6 space-y-6">
              <h3 className="text-2xl text-black font-medium ">
                Profile Details
              </h3>

              <div>
                <label className="block text-black text-xl  font-normal  ">
                  Name
                </label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full bg-white border border-yellow-400 rounded-xl px-3 py-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-black text-xl  font-normal">
                  Location
                </label>
                <input
                  name="location"
                  value={profile.location}
                  onChange={handleProfileChange}
                  className="w-full bg-white border border-yellow-400 rounded-xl px-3 py-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-black text-xl  font-normal   ">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  value={profile.description}
                  onChange={handleProfileChange}
                  className="w-full bg-white border border-yellow-400 rounded-xl px-3 py-3 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-8">
            <button
              onClick={handleReset}
              className="bg-[#E63C3C] hover:bg-red-600 text-[#460000] font-bold px-14 py-2.5 rounded-lg transition shadow"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="bg-[#1BA13D] hover:bg-green-700 text-white font-bold px-14 py-2.5 rounded-lg transition shadow"
            >
              Save
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
