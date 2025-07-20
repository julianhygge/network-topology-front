import Navbar from "components/Common/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetBill } from "services/House";

export default function HouseBill() {
  const [billData, setBillData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { simulationId } = useParams();

  useEffect(() => {
    const fetchHouseBill = async (simId) => {
      try {
        setIsLoading(true);
        const res = await GetBill(simId);
        if (res && res.length > 0) {
          setBillData(res[0]);
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
  }, [simulationId]);

  const formatNumber = (num) => {
    if (typeof num !== "number") {
      return "0.00";
    }
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className="bg-[#E7FAFF] h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Loading Bill...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#E7FAFF] h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  if (!billData) {
    return (
      <div className="bg-[#E7FAFF] h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">No bill data available.</p>
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
    <div className="bg-[#E7FAFF] h-screen">
      <Navbar />

      <div className="bg-white rounded-2xl border shadow-sm h-[80vh] p-6 mt-10 mr-40 ml-40">
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[#C4C4C4]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                loading="lazy"
                src={`${process.env.PUBLIC_URL}/images/HyggeLogo.png`}
                alt="Hygge Logo"
                className="shrink-0 w-[50px] cursor-pointer"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Utility Bill</h1>
          </div>

          <div className="flex item-center">
            <p className=" text-gray-800 mr-2">Bill ID:</p>
            <p className=" text-gray-800">INV-2025-00123</p>
          </div>
          
        </div>

        <div className="flex gap-6">
          <div className="flex-1 bg-gray-100 rounded-xl p-6 border-2 border-[#C4C4C4] ">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-[#C4C4C4]">
                Account Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-200 ">
                  <span className="text-sm text-gray-600 ">Customer Name</span>
                  <span className="font-medium text-gray-800">
                    Abhinav Monohar
                  </span>
                </div>
                <div className="flex justify-between items-center  border-b border-gray-200">
                  <span className="text-sm text-gray-600">Address</span>
                  <span className="font-medium text-gray-800">
                    Krishna Apartment, Dwaraka, IN 851101
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-gray-600">Customer ID</span>
                  <span className="font-medium text-gray-800">1234567890</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-gray-600">Billing Period</span>
                  <span className="font-medium text-gray-800">
                    {formattedPeriod}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-[#C4C4C4]">
                Energy Usage
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-gray-600">Meter Number</span>
                  <span className="font-medium text-gray-800">
                    MTR-ELE-98762
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    Total Imported Energy
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatNumber(total_energy_imported_kwh)} kWh
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    Total Exported Energy
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatNumber(total_energy_exported_kwh)} kWh{" "}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    Net Energy Consumed
                  </span>
                  <span className="font-medium ">
                    {formatNumber(net_energy_balance_kwh)} kWh
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-gray-100 rounded-xl p-6  border-2 border-[#C4C4C4]">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2  border-b-2 border-[#C4C4C4]">
                Total Bill Summary
              </h2>
              <div className="space-y-3">
                {bill_details.policy_type === "SIMPLE_NET" && (
                  <>
                    <div className="flex justify-between items-center border-b border-gray-200">
                      <span className="text-sm text-gray-600">
                        Retail Charges ({formatNumber(net_energy_balance_kwh)}{" "}
                        kWh @ ₹{formatNumber(bill_details.retail_rate_per_kwh)}
                        /kWh)
                      </span>
                      <span className="font-medium text-gray-800">
                        ₹ {formatNumber(bill_details.energy_charges)}
                      </span>
                    </div>
                  </>
                )}

                {bill_details.policy_type === "GROSS_METERING" && (
                  <>
                    <div className="flex justify-between items-center border-b border-gray-200">
                      <span className="text-sm text-gray-600">
                        Retail Charges (
                        {formatNumber(total_energy_imported_kwh)} kWh @ ₹
                        {formatNumber(bill_details.import_retail_price_per_kwh)}
                        /kWh)
                      </span>
                      <span className="font-medium text-gray-800">
                        ₹ {formatNumber(bill_details.imported_energy_charges)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200">
                      <span className="text-sm text-gray-600">
                        Wholesale Charges (
                        {formatNumber(total_energy_exported_kwh)} kWh @ ₹
                        {formatNumber(bill_details.exp_whole_price_kwh)}/kWh)
                      </span>
                      <span className="font-medium text-gray-800">
                        - ₹ {formatNumber(bill_details.exported_energy_credit)}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-gray-600">Fixed Charge</span>
                  <span className="font-medium text-gray-800">
                    ₹ {formatNumber(bill_details.fixed_charges)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200">
                  <span className="text-sm text-gray-600">Tax on Energy</span>
                  <span className="font-medium text-gray-800">
                    ₹ {formatNumber(bill_details.tax_amount_on_energy)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-1 bg-[#DBDBDB]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-navColor font-semibold">
                  Total Amount Due
                </h2>
                <p className="text-2xl text-navColor font-bold">
                  ₹ {formatNumber(calculated_bill_amount)}
                </p>
              </div>
              <p className="text-sm text-gray-700 ">Due by: June 15, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
