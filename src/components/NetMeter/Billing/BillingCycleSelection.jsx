//For NetMetring
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "components/Common/Navbar";

import { ChevronDown } from "lucide-react";
import { updateBillingCycle } from "services/netMeteringService";

export default function BillingCycleSelection() {
  const { meteringType, simulationRunId } = useParams();
  const navigate = useNavigate();
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Month");
  const [selectedYear, setSelectedYear] = useState("Year");
  const [loading, setLoading] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = [
    "1999",
    "2000",
    "2001",
    "2002",
    "2003",
    "2004",
    "2005",
    "2006",
    "2007",
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
  ];

  const handleContinue = async () => {
    setLoading(true);
    try {
      console.log(simulationRunId);

      await updateBillingCycle({
        simulationRunId,
        month: months.indexOf(selectedMonth) + 1,
        year: +selectedYear,
      });
      const monthIndex = months.indexOf(selectedMonth); // 0-based
      const yearNum = +selectedYear;
      const startDate = new Date(yearNum, monthIndex, 1, 0, 0);
      const nextMonth = new Date(yearNum, monthIndex + 1, 0, 23, 59);

      const startISO =
        [
          startDate.getFullYear(),
          String(startDate.getMonth() + 1).padStart(2, "0"),
          String(startDate.getDate()).padStart(2, "0"),
        ].join("-") +
        " " +
        String(startDate.getHours()).padStart(2, "0") +
        ":00";

      const endISO =
        [
          nextMonth.getFullYear(),
          String(nextMonth.getMonth() + 1).padStart(2, "0"),
          String(nextMonth.getDate()).padStart(2, "0"),
        ].join("-") +
        " " +
        String(nextMonth.getHours()).padStart(2, "0") +
        ":00";
      if (meteringType === "netMetering") {
        // navigate(`/netmeter/netMetering/bill/${simulationRunId}`)
        navigate(
          `/netmeter/netMetering/bill/${simulationRunId}` +
            `?start=${encodeURIComponent(startISO)}` +
            `&end=${encodeURIComponent(endISO)}`
        );
      }
      if (meteringType === "grossMetering") {
        //       navigate(`/netmeter/grossMetering/bill/${simulationRunId}`)
        navigate(
          `/netmeter/grossMetering/bill/${simulationRunId}` +
            `?start=${encodeURIComponent(startISO)}` +
            `&end=${encodeURIComponent(endISO)}`
        );
      }
      if (meteringType === "touMetering") {
        //         navigate(`/netmeter/touMetering/bill/${simulationRunId}`)
        navigate(
          `/netmeter/touMetering/bill/${simulationRunId}` +
            `?start=${encodeURIComponent(startISO)}` +
            `&end=${encodeURIComponent(endISO)}`
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex flex-col h-screen  bg-gradient-to-br from-[#6CCECD] to-[#356770]">
        <Navbar />
        <div className="flex flex-1 items-center justify-center ">
          <span className="text-navColor">Updating Bill</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen  bg-gradient-to-br from-[#6CCECD] to-[#356770]">
      <Navbar />
       <button
        onClick={() => navigate(-1)}
        className="absolute top-24 left-4 w-20 h-12 rounded-full border border-[#D59805] bg-[#FFF8E6] hover:bg-[#FFF3D7] flex items-center justify-center transition-colors  shadow-[0px_5px_10px_0px_#00000040]"
      >
        <img src="/images/Arrow 3.png" alt="Back" className="w-6 h-6" />
      </button>
      <div className="flex flex-1">
        {/* <GridSideBar /> */}
        <div className="flex flex-col flex-1">
          <div className="flex flex-1 flex-col items-center justify-center ">
            {meteringType === "netMetering" && (
              <div className="text-center text-2xl font-medium mb-6 text-black max-w-4xl">
                You have selected Net Metering Policy, according to that policy
                billing of each house will be done as per the retail rate
              </div>
            )}

            {meteringType === "grossMetering" && (
              <div className="text-center text-2xl font-medium mb-6 text-black max-w-6xl">
                You have selected Gross Metering Policy, according to this
                policy billing of imported energy will be as per the retail rate
                and energy exported will billed as per the wholesale rate
              </div>
            )}

            {meteringType === "touMetering" && (
              <div className="text-center text-2xl font-medium mb-6 text-black max-w-6xl">
                You have selected Time of Use Metering Policy, according to this
                policy billing of imported energy will be as per the time
                distributed section of usages.
              </div>
            )}

            <div className="w-full max-w-3xl p-10  bg-[linear-gradient(135.13deg,rgba(246,255,255,0.5)_100%,rgba(141,144,144,0.5)_100%)] rounded-2xl shadow-[0px_-2px_8px_0px_#00000040]">
              <h2 className="text-center text-xl font-medium mb-12 text-black">
                Please select the billing cycle to continue bill generation
              </h2>

              <div className="flex justify-center gap-10 mb-12">
                {/* Month dropdown */}
                <div className="relative w-[220px]">
                  <button
                    onClick={() => {
                      setMonthOpen(!monthOpen);
                      setYearOpen(false);
                    }}
                    className={`w-full h-12 px-6 flex items-center justify-between border rounded-3xl transition 
                       ${
                         selectedMonth !== "Month"
                           ? "bg-[linear-gradient(135.13deg,rgba(246,255,255,0.5)_100%,rgba(141,144,144,0.5)_100%)] border-[#000000] rounded-3xl"
                           : "bg-[linear-gradient(135.13deg,rgba(246,255,255,0.5)_100%,rgba(141,144,144,0.5)_100%)] border-black "
                       }
                      `}
                  >
                    <span className="text-black">{selectedMonth}</span>
                    <ChevronDown className="h-5 w-5 text-black" />
                  </button>

                  {monthOpen && (
                    <div className="absolute top-full left-8 w-40 bg-white border border-navColor rounded-xl mt-1 max-h-60 overflow-y-auto z-20 shadow-lg">
                      {months.map((month) => (
                        <div
                          key={month}
                          className="px-4 py-3 cursor-pointer hover:bg-[#6AD1CE]/30 text-navColor"
                          onClick={() => {
                            setSelectedMonth(month);
                            setMonthOpen(false);
                          }}
                        >
                          {month}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Year dropdown */}
                <div className="relative w-[220px]">
                  <button
                    onClick={() => {
                      setYearOpen(!yearOpen);
                      setMonthOpen(false);
                    }}
                    className={`w-full h-12 px-4 flex items-center justify-between border rounded-3xl transition
                       ${
                         selectedYear !== "Year"
                           ? "bg-[linear-gradient(135.13deg,rgba(246,255,255,0.5)_100%,rgba(141,144,144,0.5)_100%)] border-[#000000] rounded-3xl"
                           : "bg-[linear-gradient(135.13deg,rgba(246,255,255,0.5)_100%,rgba(141,144,144,0.5)_100%)] border-navColor"
                       }
                      `}
                  >
                    <span className="text-navColor">{selectedYear}</span>
                    <ChevronDown className="h-5 w-5 text-navColor" />
                  </button>

                  {yearOpen && (
                    <div className="absolute top-full left-8 w-40 bg-white border border-navColor rounded-xl mt-1 max-h-60 overflow-y-auto z-20 shadow-lg">
                      {years.map((year) => (
                        <div
                          key={year}
                          className="px-4 py-3 cursor-pointer hover:bg-[#6AD1CE]/30 text-navColor"
                          onClick={() => {
                            setSelectedYear(year);
                            setYearOpen(false);
                          }}
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Continue button */}
              <div className="flex justify-center">
                <button
                  onClick={handleContinue}
                  disabled={
                    selectedMonth === "Month" || selectedYear === "Year"
                  }
                  className={`px-14 py-3 rounded-full font-medium transition
                     ${
                       selectedMonth !== "Month" && selectedYear !== "Year"
                         ? "bg-[#FFB600] text-black hover:bg-[#FFB600]/90 cursor-pointer"
                         : "bg-[#FFB600] text-black cursor-not-allowed"
                     }
                    `}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
