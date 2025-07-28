import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "components/Common/Navbar";
import {
  generateGrossMeteringPolicyBill,
  fetchEnergySummary,
  fetchGrossMeteringPolicy,
  updateGrossMeteringPolicy,
  triggerBillCalculation,
} from "services/netMeteringService";
import { useParams, useLocation } from "react-router-dom";

const GrossMeteringBillPage = () => {
  const { simulationRunId } = useParams();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const startDatetime = params.get("start"); // e.g. "2021-01-01 00:00"
  const endDatetime = params.get("end"); // e.g. "2021-02-01 00:00"

  const navigate = useNavigate();
  const [retailPrice, setRetailPrice] = useState(0);
  const [wholesalePrice, setWholesalePrice] = useState(0);
  const [fixedPrice, setFixedPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const [totalImported, setTotalImported] = useState(null);
  const [totalExported, setTotalExported] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  useEffect(() => {
    const nodeId = "420f29da-f8e3-44f8-8245-9964d10e62cd"; // replace with actual node ID
    if (!startDatetime || !endDatetime) {
      console.error("Missing startDatetime or endDatetime");
      setSummaryError("Date range not provided");
      setSummaryLoading(false);
      return;
    }

    fetchEnergySummary({ nodeId, startDatetime, endDatetime })
      .then((data) => {
        console.log(data);
        setTotalImported(data.total_imported_units);
        setTotalExported(data.total_exported_units);
      })
      .catch((err) => {
        console.error(err);
        setSummaryError("Failed to load energy summary");
      })
      .finally(() => setSummaryLoading(false));
  }, [startDatetime, endDatetime]);

  // const handleGenerateBill = async () => {
  //   setLoading(true);
  //   try {
  //     // see if a policy already exists
  //   //  const existing = await fetchGrossMeteringPolicy(simulationRunId);
  //    const existing=await  fetchSelectedPolicy(simulationRunId);
  //     let res;
  //     if (existing ) {
  //       // update
  //       res = await updateGrossMeteringPolicy({
  //         simulation_run_id: simulationRunId,
  //         import_retail_price_per_kwh:  +retailPrice,
  //         export_wholesale_price_per_kwh: +wholesalePrice,
  //         fixed_charge_tariff_rate_per_kw: +fixedPrice
  //       });
  //     } else {
  //       // create new
  //       res = await generateGrossMeteringPolicyBill({
  //         simulationRunId,
  //         retailPrice:  +retailPrice,
  //         wholesalePrice: +wholesalePrice,
  //         fixedChargeRate: +fixedPrice
  //       });
  //     }
  //     console.log(res);
  //     navigate("/housebill");
  //   } catch (e) {
  //     console.error(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleGenerateBill = async () => {
    setLoading(true);
    try {
      let existing = null;
      try {
        existing = await fetchGrossMeteringPolicy(simulationRunId);
      } catch (err) {
        if (err.response?.status !== 400) throw err;
      }

      if (existing) {
        await updateGrossMeteringPolicy({
          simulation_run_id: simulationRunId,
          import_retail_price_per_kwh: +retailPrice,
          export_wholesale_price_per_kwh: +wholesalePrice,
          fixed_charge_tariff_rate_per_kw: +fixedPrice,
        });
      } else {
        await generateGrossMeteringPolicyBill({
          simulationRunId,
          retailPrice: +retailPrice,
          wholesalePrice: +wholesalePrice,
          fixedChargeRate: +fixedPrice,
        });
      }
      await triggerBillCalculation(simulationRunId);
      navigate(`/housebill/${simulationRunId}`);
    } catch (e) {
      console.error("Error generating/updating gross‐metering policy:", e);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col h-screen pt-20  bg-gradient-to-br from-[#6CCECD] to-[#356770]">
        <Navbar />
        <div className="flex flex-1 items-center justify-center ">
          <span className="text-navColor">Generating Bill</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen pt-20 bg-gradient-to-br from-[#6CCECD] to-[#356770]">
      <Navbar />
        <button
        onClick={() => navigate(-1)}
        className="absolute top-24 left-4 w-20 h-12 rounded-full border border-[#D59805] bg-[#FFF8E6] hover:bg-[#FFF3D7] flex items-center justify-center transition-colors  shadow-[0px_5px_10px_0px_#00000040]"
      >
        <img src={`${process.env.PUBLIC_URL}/images/Arrow 3.png`} alt="Back" className="w-6 h-6" />
      </button>
      <div className="flex flex-1 bg-gradient-to-br from-[#6CCECD] to-[#356770]">
        {/* <GridSideBar /> */}
        <div className="flex flex-1 flex-col items-center justify-center ">
          {/* <div className="text-center text-2xl font-medium mb-6 text-navColor max-w-6xl">
            You have selected Gross Metering Policy, according to this policy
            billing of imported energy will be as per the retail rate and energy
            exported will billed as per the wholesale rate
          </div> */}

           <div className="w-full max-w-3xl py-10 px-36 bg-[linear-gradient(135.13deg,rgba(246,255,255,0.5)_100%,rgba(141,144,144,0.5)_100%)] rounded-2xl shadow-[0px_-2px_8px_0px_#00000040] mx-4">
            <h1 className="flex justify-center font-bold text-black text-4xl mb-3">Gross Metering Policy</h1>
            <div className="flex justify-center text-xl text-black mb-6">Buy at retail price, sell at wholesale price</div>
            {/* Energy Summary Cards */}
            <div className="flex justify-center gap-4 mb-10">
              {/* Total Energy Imported */}
             <div className="bg-[#2BC5C0] rounded-2xl p-6 min-w-[230px] text-center">
                <h3 className="text-lg font-medium text-black mb-3">
                  Total Energy Imported
                </h3>
                {summaryLoading ? (
                  <span className="text-black">Loading…</span>
                ) : summaryError ? (
                  <span className="text-red-500">{summaryError}</span>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <ArrowDown className="h-6 w-6 text-black" />
                    <span className="text-2xl font-bold text-black">
                      {totalImported} kwh
                    </span>
                  </div>
                )}
              </div>

              {/* Total Energy Exported */}
               <div className="bg-[#74AA50]/75 rounded-2xl p-6 min-w-[230px] text-center">
                <h3 className="text-lg font-medium text-black mb-3">
                  Total Energy Exported
                </h3>
                {summaryLoading ? (
                  <span className="text-black">Loading…</span>
                ) : summaryError ? (
                  <span className="text-red-500">{summaryError}</span>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <ArrowUp className="h-6 w-6 text-black" />
                    <span className="text-2xl font-bold text-black">
                      {totalExported} kwh
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Input Fields */}
            <div className="space-y-5 mb-5">
              {/* Retail Price Input */}
              <div>
                <label className="block text-lg font-medium text-black mb-3">
                  Enter your retail price (in kwh) :
                </label>
                <input
                  type="text"
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(e.target.value)}
                  placeholder="eg. 12.5"
                  className="w-full h-12 px-4 border-1 border-navColor rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:border-[#6AD1CE] transition-colors"
                />
              </div>
              {/* Wholsale Price Input */}
              <div>
                <label className="block text-lg font-medium text-black mb-3">
                  Enter your wholesale price (in kwh) :
                </label>
                <input
                  type="number"
                  value={wholesalePrice}
                  onChange={(e) => setWholesalePrice(e.target.value)}
                  placeholder="eg. 12.5"
                  className="w-full h-12 px-4 border-1 border-navColor rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:border-[#6AD1CE] transition-colors"
                />
              </div>

              {/* Fixed Price Input */}
              <div>
                <label className="block text-lg font-medium text-black mb-3">
                  Enter fixed price if any (in kwh) :
                </label>
                <input
                  type="number"
                  value={fixedPrice}
                  onChange={(e) => setFixedPrice(e.target.value)}
                  placeholder="eg. 12.5"
                  className="w-full h-12 px-4 border-1 border-navColor rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:border-[#6AD1CE] transition-colors"
                />
              </div>
            </div>

            {/* Generate Bill Button */}
             <div className="flex justify-center">
              <button
                onClick={handleGenerateBill}
                disabled={!retailPrice}
                className={`px-12 py-4 rounded-2xl text-xl  font-bold transition-all ${
                  retailPrice
                    ? "bg-[#74AA50] text-white hover:bg-[#7CB342] cursor-pointer  shadow-[0px_5px_10px_0px_#00000040] "
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
};

export default GrossMeteringBillPage;
