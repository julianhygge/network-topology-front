import Navbar from "components/Common/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetBill } from "services/House";

// Builds a single synthetic "bill" out of every house bill in the run,
// summing the energy figures and every additive charge. The rates and the
// billing cycle are taken from the first bill (they are the same for the
// whole simulation run).
const aggregateBills = (bills) => {
  const sum = (sel) =>
    bills.reduce((acc, b) => acc + (Number(sel(b)) || 0), 0);
  const first = bills[0];
  return {
    house_node_id: null,
    total_energy_imported_kwh: sum((b) => b.total_energy_imported_kwh),
    total_energy_exported_kwh: sum((b) => b.total_energy_exported_kwh),
    net_energy_balance_kwh: sum((b) => b.net_energy_balance_kwh),
    calculated_bill_amount: sum((b) => b.calculated_bill_amount),
    bill_details: {
      ...first.bill_details,
      house_name: `All houses (${bills.length})`,
      energy_charges: sum((b) => b.bill_details?.energy_charges),
      imported_energy_charges: sum(
        (b) => b.bill_details?.imported_energy_charges
      ),
      exported_energy_credit: sum(
        (b) => b.bill_details?.exported_energy_credit
      ),
      fixed_charges: sum((b) => b.bill_details?.fixed_charges),
      fac_charges: sum((b) => b.bill_details?.fac_charges),
      tax_amount_on_energy: sum((b) => b.bill_details?.tax_amount_on_energy),
    },
  };
};

export default function HouseBill() {
  const [billData, setBillData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { simulationId, houseNodeId } = useParams();
  const isCumulative = !houseNodeId;

  useEffect(() => {
    const fetchHouseBill = async (simId) => {
      try {
        setIsLoading(true);
        const res = await GetBill(simId);
        if (res && res.length > 0) {
          if (houseNodeId) {
            setBillData(
              res.find((b) => b.house_node_id === houseNodeId) || null
            );
          } else {
            setBillData(aggregateBills(res));
          }
        } else {
          setBillData(null);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching bill data:", err);
        setError("Failed to load bill data.");
        setBillData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (simulationId) {
      fetchHouseBill(simulationId);
    }
  }, [simulationId, houseNodeId]);

  const formatNumber = (num) => {
    if (typeof num !== "number") {
      return "0.00";
    }
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // if (isLoading) {
  //   return (
  //     <div className="bg-[#E7FAFF] h-screen flex items-center justify-center">
  //       <p className="text-xl font-semibold">Loading Bill...</p>
  //     </div>
  //   );
  // }
    if (isLoading) {
      return (
        <div className="flex flex-col h-screen pt-20  bg-gradient-to-br from-[#6CCECD] to-[#356770]">
          <Navbar />
          <div className="flex flex-1 items-center justify-center ">
            <span className="text-navColor">Loading Bill...</span>
          </div>
        </div>
      );
    }

  if (error) {
    return (
     <div className="flex flex-col h-screen pt-20  bg-gradient-to-br from-[#6CCECD] to-[#356770]">
          <Navbar />
          <div className="flex flex-1 items-center justify-center ">
            <span className="text-navColor">{error}</span>
          </div>
        </div>
    );
  }

  if (!billData) {
    return (
       <div className="flex flex-col h-screen pt-20  bg-gradient-to-br from-[#6CCECD] to-[#356770]">
          <Navbar />
          <div className="flex flex-1 items-center justify-center ">
            <span className="text-navColor">No Bid Data available.</span>
          </div>
        </div>
    );
  }

  const {
    bill_details,
    total_energy_imported_kwh,
    total_energy_exported_kwh,
    net_energy_balance_kwh,
    calculated_bill_amount,
  } = billData;

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formattedPeriod =
    bill_details.billing_cycle_month && bill_details.billing_cycle_year
      ? `${monthNames[bill_details.billing_cycle_month - 1]} ${
          bill_details.billing_cycle_year
        }`
      : "N/A";

  return (
    <div className=" flex flex-col  bg-gradient-to-br from-[#6CCECD] to-[#356770] h-screen pt-20 ">
      <Navbar />
      <button
        onClick={() => navigate(-1)}
        className="absolute top-24 left-4 w-20 h-12 rounded-full border border-[#D59805] bg-[#FFF8E6] hover:bg-[#FFF3D7] flex items-center justify-center transition-colors shadow-[0px_5px_10px_0px_#00000040] z-10"
      >
        <img
          src={`${process.env.PUBLIC_URL}/images/Arrow 3.png`}
          alt="Back"
          className="w-6 h-6"
        />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center   ">
        <div className="w-full max-w-6xl   bg-[linear-gradient(135.13deg,rgba(246,255,255,0.5)_100%,rgba(141,144,144,0.5)_100%)] rounded-2xl shadow-[0px_-2px_8px_0px_#00000040]  ">
        <div className="flex items-center justify-between py-3  border-b-2 border-[#916600]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center ml-3">
              <img
                loading="lazy"
                src={`${process.env.PUBLIC_URL}/images/HyggeLogo.png`}
                alt="Hygge Logo"
                className="shrink-0 w-[40px] cursor-pointer"
              />
            </div>
            <h1 className="text-2xl font-bold text-black   ">
              {isCumulative ? "Cumulative Utility Bill" : "Utility Bill"}
            </h1>
          </div>

          <div className="flex item-center mr-6">
            <p className=" text-black mr-2">Bill ID:</p>
            <p className=" text-black">INV-2025-00123</p>
          </div>
          
        </div>

        <div className="flex gap-6 p-11 ">
          <div className="flex-1  bg-[linear-gradient(135.13deg,rgba(246,255,255,0.88)_100%,rgba(141,144,144,0.88)_100%)] rounded-xl p-6  ">
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-black mb-6 pb-2 border-b-2 border-[#916600]">
                Account Information
              </h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-200 ">
                  <span className="text-sm text-black ">
                    {isCumulative ? "Houses" : "House"}
                  </span>
                  <span className="font-bold text-black">
                    {bill_details.house_name || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center  border-b border-gray-200">
                  <span className="text-sm text-black">Address</span>
                  <span className="font-bold text-black">
                    Krishna Apartment, Dwaraka, IN 851101
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-black">Customer ID</span>
                  <span className="font-bold text-black">1234567890</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-black">Billing Period</span>
                  <span className="font-bold text-black">
                    {formattedPeriod}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-6 pb-2 border-b-2 border-[#916600]">
                Energy Usage
              </h2>
              <div className="space-y-5">
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-black">Meter Number</span>
                  <span className="font-bold text-black">
                    MTR-ELE-98762
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-black">
                    Total Imported Energy
                  </span>
                  <span className="font-bold text-black">
                    {formatNumber(total_energy_imported_kwh)} kWh
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-black">
                    Total Exported Energy
                  </span>
                  <span className="font-bold text-black">
                    {formatNumber(total_energy_exported_kwh)} kWh{" "}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-black">
                    Net Energy Consumed
                  </span>
                  <span className="font-bold ">
                    {formatNumber(net_energy_balance_kwh)} kWh
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[linear-gradient(135.13deg,rgba(246,255,255,0.88)_100%,rgba(141,144,144,0.88)_100%)] rounded-xl p-6 ">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-black mb-4 pb-2  border-b-2 border-[#916600]">
                Total Bill Summary
              </h2>
              <div className="space-y-8 mt-6">
                {bill_details.policy_type === "SIMPLE_NET" && (
                  <>
                    <div className="flex justify-between items-center border-b border-gray-200">
                      <span className="text-sm text-black">
                        Retail Charges ({formatNumber(net_energy_balance_kwh)}{" "}
                        kWh @ ₹{formatNumber(bill_details.retail_rate_per_kwh)}
                        /kWh)
                      </span>
                      <span className="font-bold text-black">
                        ₹ {formatNumber(bill_details.energy_charges)}
                      </span>
                    </div>
                  </>
                )}

                {bill_details.policy_type === "GROSS_METERING" && (
                  <>
                    <div className="flex justify-between items-center border-b border-gray-200">
                      <span className="text-sm text-black">
                        Retail Charges (
                        {formatNumber(total_energy_imported_kwh)} kWh @ ₹
                        {formatNumber(bill_details.import_retail_price_per_kwh)}
                        /kWh)
                      </span>
                      <span className="font-bold text-black">
                        ₹ {formatNumber(bill_details.imported_energy_charges)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200">
                      <span className="text-sm text-black">
                        Wholesale Charges (
                        {formatNumber(total_energy_exported_kwh)} kWh @ ₹
                        {formatNumber(bill_details.exp_whole_price_kwh)}/kWh)
                      </span>
                      <span className="font-bold text-black">
                        - ₹ {formatNumber(bill_details.exported_energy_credit)}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-black">Fixed Charge</span>
                  <span className="font-bold text-black ">
                    ₹ {formatNumber(bill_details.fixed_charges)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-bold text-black">Tax on Energy</span>
                  <span className="font-bold text-black">
                    ₹ {formatNumber(bill_details.tax_amount_on_energy)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-1 bg-[#CFDBDB]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-black font-semibold">
                  Total Amount Due
                </h2>
                <p className="text-2xl text-black font-bold">
                  ₹ {formatNumber(calculated_bill_amount)}
                </p>
              </div>
              <p className="text-sm text-black ">Due by: June 15, 2025</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
