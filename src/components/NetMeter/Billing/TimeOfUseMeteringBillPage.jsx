import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "components/Common/Navbar";
import GridSideBar from "components/Grid/GridSideBar";
import {
  fetchTouPolicies,
  generateTouMeteringPolicyBill,
  updateTouPolicy,
} from "services/netMeteringService";
import { useParams } from "react-router-dom";

const TimeOfUseMeteringBillPage = () => {
  const { simulationRunId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([
    { id: 1, startTime: "00:00", endTime: "00:00", retail: 0, wholesale: 0 },
    { id: 2, startTime: "00:00", endTime: "00:00", retail: 0, wholesale: 0 },
    { id: 3, startTime: "00:00", endTime: "00:00", retail: 0, wholesale: 0 },
  ]);

  const [isReadOnly, setIsReadOnly] = useState(false);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        startTime: "00:00",
        endTime: "00:00",
        retail: 0,
        wholesale: 0,
      },
    ]);
  };

  const handleSave = () => {
    setIsReadOnly(true);
  };

  const handleReset = () => {
    setRows(
      rows.map((row, idx) => ({
        id: idx + 1,
        startTime: "00:00",
        endTime: "00:00",
        retail: 0,
        wholesale: 0,
      }))
    );
    setIsReadOnly(false);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleEdit = () => {
    setIsReadOnly(false);
  };

  // const handleGenerateBill = async () => {
  //     setLoading(true);
  //     try {
  //         for (const row of rows) {
  //             const res = await generateTouMeteringPolicyBill({
  //             simulationRunId,
  //             startTime: row.startTime,
  //             endTime: row.endTime,
  //             retailPrice: row.retail,
  //             wholesalePrice: row.wholesale,
  //         });
  //         console.log(res);
  //     }
  //     navigate(`/housebill`)
  //     } catch (e) {
  //         console.error(e)
  //     }
  //     finally{
  //         setLoading(false);
  //     }
  // }
  const handleGenerateBill = async () => {
    setLoading(true);
    try {
      let existing = null;
      try {
        existing = await fetchTouPolicies(simulationRunId);
      } catch (err) {
        if (err.response?.status !== 400) throw err;
      }

      if (existing) {
        await Promise.all(
          rows.map((row) =>
            updateTouPolicy({
              tou_id: row.id, // your TOU‐record ID
              time_period_label: row.label || `Period ${row.id}`,
              start_time: row.startTime,
              end_time: row.endTime,
              import_retail_rate_per_kwh: +row.retail,
              export_wholesale_rate_per_kwh: +row.wholesale,
            })
          )
        );
      } else {
        await generateTouMeteringPolicyBill({
          simulationRunId,
          periods: rows.map((r) => ({
            time_period_label: r.label || `Period ${r.id}`,
            start_time: r.startTime,
            end_time: r.endTime,
            retailPrice: +r.retail,
            wholesalePrice: +r.wholesale,
          })),
        });
      }

      // 3) navigate on success
      navigate("/housebill");
    } catch (e) {
      console.error("Error generating/updating TOU policy:", e);
      // TODO: show user‐facing error state
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 items-center justify-center bg-[#E7FAFF]">
          <span className="text-navColor">Generating Bill</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        {/* <GridSideBar /> */}
        <div className="flex flex-1 flex-col items-center justify-center bg-[#E7FAFF]">
          {
            <div className="text-center text-2xl font-medium mb-6 text-navColor max-w-6xl">
              You have selected Time of Use Metering Policy, according to this
              policy billing of imported energy will be as per the time
              distributed section of usages.
            </div>
          }
          <div className="w-full max-w-[1560px] py-6 px-6 md:px-20 bg-white border-2 border-[#BF6A02] rounded-2xl shadow-lg mx-4 relative">
            {/* Edit button */}
            <div className="absolute top-5 right-16">
              <button onClick={handleEdit} disabled={!isReadOnly}>
                <img
                  src="/images/Icon.svg"
                  alt="Edit"
                  className="w-6 h-6 hover:opacity-70"
                />
              </button>
            </div>
            {/* Close button */}
            <div className="absolute top-4 right-6">
              <button className="text-2xl font-bold text-gray-600 hover:text-red-500">
                <div>X</div>
              </button>
            </div>

            {/* Title */}
            <div className="text-center text-2xl font-semibold mb-10">
              Please select the time period and enter the retail and wholesale
              amount
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 px-4 text-center font-medium text-xl mb-8">
              <div>Time Period</div>
              <div>↓ Import</div>
              <div>↑ Export</div>
              <div>Amt Retail</div>
              <div>Amt Wholesale</div>
            </div>

            {/* Rows*/}
            <div className="w-full max-h-[300px] overflow-y-auto">
              {rows.map((_, index) => (
                <div key={index}>
                  <div className="grid grid-cols-5 gap-10 items-center px-4 mb-6">
                    {/* Time Input */}
                    <div className="flex justify-center items-center gap-1">
                      <input
                        type="time"
                        value={rows[index].startTime}
                        onChange={(e) =>
                          handleChange(index, "startTime", e.target.value)
                        }
                        readOnly={isReadOnly}
                        className="w-[130px] px-2 py-2 text-md border rounded-md text-center bg-[#FFB60033] text-black"
                      />
                      <span className="mx-1 text-gray-500">-</span>
                      <input
                        type="time"
                        value={rows[index].endTime}
                        onChange={(e) =>
                          handleChange(index, "endTime", e.target.value)
                        }
                        readOnly={isReadOnly}
                        className="w-[130px] px-2 py-2 text-md border rounded-md text-center bg-[#FFB60033] text-black"
                      />
                    </div>

                    {/* Import Icon */}
                    <div className="flex justify-center items-center">
                      {/* <img src="/import-icon.svg" alt="Import" className="w-6 h-6" /> */}
                      {/* static for now */}
                      <div className="font-medium text-lg">50</div>
                    </div>

                    {/* Export Icon */}
                    <div className="flex justify-center items-center">
                      {/* <img src="/export-icon.svg" alt="Export" className="w-6 h-6" /> */}
                      {/* static for now */}
                      <div className="font-medium text-lg">100</div>
                    </div>

                    {/* Retail Input */}
                    <div className="flex justify-center items-center">
                      <input
                        type="number"
                        placeholder="Enter"
                        value={rows[index].retail}
                        onChange={(e) =>
                          handleChange(index, "retail", e.target.value)
                        }
                        readOnly={isReadOnly}
                        className="w-[9rem] px-3 py-2 border rounded-xl text-lg placeholder:text-lg font-medium"
                      />
                    </div>

                    {/* Wholesale Input */}
                    <div className="flex justify-center items-center">
                      <input
                        type="number"
                        placeholder="Enter"
                        value={rows[index].wholesale}
                        onChange={(e) =>
                          handleChange(index, "wholesale", e.target.value)
                        }
                        readOnly={isReadOnly}
                        className="w-[9rem] px-3 py-2 border rounded-xl text-lg placeholder:text-lg mr-5 font-medium"
                      />
                    </div>
                  </div>
                  <div className="border-b border-gray-300 mx-4 mb-6 mr-20"></div>{" "}
                  {/* horizontal line */}
                </div>
              ))}
            </div>

            {/* Add Row Button */}
            <div className="flex justify-start mt-4 ml-12">
              <button
                onClick={handleAddRow}
                className="flex items-center justify-center px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100 text-sm"
              >
                Add New Row <span className="ml-4 text-lg font-bold">+</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={handleReset}
                className="bg-[#FF763C] hover:bg-orange-500 px-8 py-2 rounded-full text-[#204A56] font-medium text-lg"
              >
                Reset
              </button>
              <button
                disabled={!isReadOnly}
                onClick={handleGenerateBill}
                className="bg-[#7CB342] hover:bg-[#74AA50] text-white px-9 py-2 rounded-full font-medium text-lg"
              >
                Generate Bill
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-9 py-2 rounded-full font-medium text-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeOfUseMeteringBillPage;
