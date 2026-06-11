import Navbar from "components/Common/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ArrowDown, ArrowUp } from "lucide-react";
import { GetBill } from "services/House";

export default function HouseBillSummary() {
  const { simulationId } = useParams();
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!simulationId) return;
    GetBill(simulationId)
      .then((res) => setBills(Array.isArray(res) ? res : []))
      .catch((err) => {
        console.error("Error fetching house bills:", err);
        setError("Failed to load house bills.");
      })
      .finally(() => setIsLoading(false));
  }, [simulationId]);

  const formatNumber = (num) =>
    typeof num === "number"
      ? new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num)
      : "0.00";

  const Shell = ({ children }) => (
    <div className="flex flex-col min-h-screen pt-20 bg-gradient-to-br from-[#6CCECD] to-[#356770]">
      <Navbar />
      <button
        onClick={() => navigate(-1)}
        className="absolute top-24 left-4 w-20 h-12 rounded-full border border-[#D59805] bg-[#FFF8E6] hover:bg-[#FFF3D7] flex items-center justify-center transition-colors shadow-[0px_5px_10px_0px_#00000040]"
      >
        <img
          src={`${process.env.PUBLIC_URL}/images/Arrow 3.png`}
          alt="Back"
          className="w-6 h-6"
        />
      </button>
      <div className="flex flex-1 flex-col items-center justify-center py-10">
        {children}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Shell>
        <span className="text-navColor">Loading bills…</span>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <span className="text-red-600">{error}</span>
      </Shell>
    );
  }

  if (bills.length === 0) {
    return (
      <Shell>
        <div className="bg-[#F6FFFF]/60 rounded-2xl shadow-lg p-10 max-w-xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">
            No bills yet for this version
          </h2>
          <p className="text-gray-700">
            Generate the bills first: select the allocation engine, choose a
            policy and billing cycle, then press "Generate bill".
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="w-full max-w-6xl bg-[linear-gradient(135.13deg,rgba(246,255,255,0.5)_100%,rgba(141,144,144,0.5)_100%)] rounded-2xl shadow-[0px_-2px_8px_0px_#00000040] p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 mb-8 border-b-2 border-[#916600]">
          <div className="flex items-center space-x-4">
            <img
              loading="lazy"
              src={`${process.env.PUBLIC_URL}/images/HyggeLogo.png`}
              alt="Hygge Logo"
              className="shrink-0 w-[40px]"
            />
            <h1 className="text-2xl font-bold text-black">
              Utility Bill Summary
            </h1>
          </div>
          <button
            onClick={() => navigate(`/housebill/${simulationId}/cumulative`)}
            className="flex items-center gap-2 bg-[#74AA50] hover:bg-[#7CB342] text-white font-semibold px-6 py-3 rounded-xl shadow"
          >
            Go To Cumulative Bill <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* House cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bills.map((bill) => {
            const houseName =
              bill.bill_details?.house_name || bill.house_node_id;
            return (
              <div
                key={bill.house_node_id}
                className="bg-white/85 rounded-2xl p-5 shadow hover:bg-white transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-black truncate">
                    {houseName}
                  </h3>
                  <button
                    onClick={() =>
                      navigate(
                        `/housebill/${simulationId}/house/${bill.house_node_id}`
                      )
                    }
                    className="flex items-center gap-1 bg-[#FFB600] hover:bg-[#E9AB09] text-[#070C21] text-sm font-medium px-3 py-1.5 rounded-xl shrink-0"
                  >
                    Go To Bill <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 text-sm text-black">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-1">
                    <span className="flex items-center gap-1">
                      <ArrowDown className="w-4 h-4 text-[#1B7A78]" />
                      Total Energy Import
                    </span>
                    <span className="font-semibold">
                      {formatNumber(bill.total_energy_imported_kwh)} kWh
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-200 pb-1">
                    <span className="flex items-center gap-1">
                      <ArrowUp className="w-4 h-4 text-[#4A890B]" />
                      Total Energy Export
                    </span>
                    <span className="font-semibold">
                      {formatNumber(bill.total_energy_exported_kwh)} kWh
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span>Amount Due</span>
                    <span className="font-bold">
                      ₹ {formatNumber(bill.calculated_bill_amount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
