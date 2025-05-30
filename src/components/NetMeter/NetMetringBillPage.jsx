import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import Navbar from "components/Common/Navbar";
import GridSideBar from "components/Grid/GridSideBar";

export default function NetMeteringBillPage() {
  const [retailPrice, setRetailPrice] = useState("");
  const [fixedPrice, setFixedPrice] = useState("");

  const handleGenerateBill = () => {
    if (retailPrice) {
      // Handle bill generation logic
      console.log(
        "Generating bill with retail price:",
        retailPrice,
        "and fixed price:",
        fixedPrice
      );
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <GridSideBar />
        <div className="flex flex-1 flex-col items-center justify-center bg-[#E7FAFF]">
          <div className="text-center text-xl font-medium mb-8 text-navColor max-w-4xl px-4">
            You have selected Net Metering Policy, according to that policy
            billing of each house will be done as per the retail rate
          </div>

          <div className="w-full max-w-3xl py-14  px-28 bg-white border-2 border-[#BF6A02] rounded-2xl shadow-lg mx-4">
            {/* Energy Summary Cards */}
            <div className="flex justify-center gap-6 mb-10">
              {/* Total Energy Imported */}
              <div className="bg-[#2BC5C0]/75 rounded-2xl p-6 min-w-[230px] text-center">
                <h3 className="text-lg font-medium text-navColor mb-3">
                  Total Energy Imported
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <ArrowDown className="h-6 w-6 text-navColor" />
                  <span className="text-2xl font-bold text-navColor">
                    1750 kwh
                  </span>
                </div>
              </div>

              {/* Total Energy Exported */}
              <div className="bg-[#74AA50]/75 rounded-2xl p-6 min-w-[230px] text-center">
                <h3 className="text-lg font-medium text-navColor mb-3">
                  Total Energy Exported
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <ArrowUp className="h-6 w-6 text-navColor" />
                  <span className="text-2xl font-bold text-navColor">950 kwh</span>
                </div>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-6 mb-8">
              {/* Retail Price Input */}
              <div>
                <label className="block text-lg font-medium text-navColor mb-3">
                  Enter your retail price (in kwh) :
                </label>
                <input
                  type="text"
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(e.target.value)}
                  placeholder="eg. 12.5"
                  className="w-full h-12 px-4 border-1 border-navColor rounded-2xl text-navColor placeholder-gray-400 focus:outline-none focus:border-[#6AD1CE] transition-colors"
                />
              </div>

              {/* Fixed Price Input */}
              <div>
                <label className="block text-lg font-medium text-navColor mb-3">
                  Enter fixed price if any (in kwh) :
                </label>
                <input
                  type="text"
                  value={fixedPrice}
                  onChange={(e) => setFixedPrice(e.target.value)}
                  placeholder="eg. 12.5"
                  className="w-full h-12 px-4 border-1 border-navColor rounded-2xl text-navColor placeholder-gray-400 focus:outline-none focus:border-[#6AD1CE] transition-colors"
                />
              </div>
            </div>

            {/* Generate Bill Button */}
            <div className="flex justify-center">
              <button
                onClick={handleGenerateBill}
                disabled={!retailPrice}
                className={`px-12 py-4 rounded-full text-lg font-medium transition-all ${
                  retailPrice
                    ? "bg-[#74AA50] text-white hover:bg-[#7CB342] cursor-pointer shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Generate bill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
