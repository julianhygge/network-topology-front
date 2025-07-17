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
          setBillData(res[0]); // Displaying the first bill from the simulation result
        } else {
          setBillData(null); // No data found
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
    return new Intl.NumberFormat("en-IN", {
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
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const formattedPeriod =
    bill_details.billing_cycle_month && bill_details.billing_cycle_year
      ? `${monthNames[bill_details.billing_cycle_month - 1]} ${bill_details.billing_cycle_year}`
      : "N/A";

  return (
    <div className="bg-[#E7FAFF] min-h-screen">
      <Navbar />

      <div className="bg-white rounded-2xl border shadow-sm p-6 mx-auto mt-10 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
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
            <p className=" text-gray-800">{billData.id.slice(0, 13)}</p>
          </div>
        </div>

        {/* Two Sidebars Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar 1 - Account Information & Energy Usage */}
          <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-200">
            {/* Account Information Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Account Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 ">Customer Name</span>
                  <span className="font-medium text-gray-800">
                    {bill_details.house_name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Address</span>
                  <span className="font-medium text-gray-800">
                    Krishna Apartment, Dwaraka, IN 851101
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Customer ID</span>
                  <span className="font-medium text-gray-800">1234567890</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Billing Period</span>
                  <span className="font-medium text-gray-800">
                    {formattedPeriod}
                  </span>
                </div>
              </div>
            </div>

            {/* Energy Usage Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Energy Usage
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Meter Number</span>
                  <span className="font-medium text-gray-800">MTR-ELE-98762</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total Imported Energy</span>
                  <span className="font-medium text-gray-800">
                    {formatNumber(total_energy_imported_kwh)} kWh
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total Exported Energy</span>
                  <span className="font-medium text-gray-800">
                    {formatNumber(total_energy_exported_kwh)} kWh
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Net Energy Consumed</span>
                  <span className="font-medium text-gray-800">
                    {formatNumber(net_energy_balance_kwh)} kWh
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar 2 - Bill Summary & Amount Due */}
          <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-200">
            {/* Bill Summary Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Total Bill Summary
              </h2>
<div className="space-y-3">
  {bill_details.policy_type === "SIMPLE_NET" && (
    <>
      <div className="flex justify-between items-center py-2 border-b border-gray-200">
        <span className="text-sm text-gray-600">Energy Charges</span>
        <span className="font-medium text-gray-800">
          ₹ {formatNumber(bill_details.energy_charges)}
        </span>
      </div>
    </>
  )}

  {bill_details.policy_type === "GROSS_METERING" && (
    <>
      <div className="flex justify-between items-center py-2 border-b border-gray-200">
        <span className="text-sm text-gray-600">Retail Charges</span>
        <span className="font-medium text-gray-800">
          ₹ {formatNumber(bill_details.imported_energy_charges)}
        </span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-200">
        <span className="text-sm text-green-600">Wholesale Credit</span>
        <span className="font-medium text-green-600">
          - ₹ {formatNumber(bill_details.exported_energy_credit)}
        </span>
      </div>
    </>
  )}

  <div className="flex justify-between items-center py-2 border-b border-gray-200">
    <span className="text-sm text-gray-600">Fixed Charge</span>
    <span className="font-medium text-gray-800">
      ₹ {formatNumber(bill_details.fixed_charges)}
    </span>
  </div>
  <div className="flex justify-between items-center py-2 border-b border-gray-200">
    <span className="text-sm text-gray-600">Tax on Energy</span>
    <span className="font-medium text-gray-800">
      ₹ {formatNumber(bill_details.tax_amount_on_energy)}
    </span>
  </div>
</div>
            </div>

            {/* Amount Due Section */}
            <div className="bg-white rounded-lg p-4 mt-12 flex items-center justify-between border border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Total Amount Due</h2>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ₹ {formatNumber(calculated_bill_amount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}