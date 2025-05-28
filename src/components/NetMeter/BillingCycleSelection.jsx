//For NetMetring
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "components/Common/Navbar"
import GridSideBar from "components/Grid/GridSideBar"
import { ChevronDown } from "lucide-react"

export default function BillingCycleSelection() {
  const navigate = useNavigate()
  const [monthOpen, setMonthOpen] = useState(false)
  const [yearOpen, setYearOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("Month")
  const [selectedYear, setSelectedYear] = useState("Year")

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ]

  const years = [
    "1999","2000","2001","2002","2003","2004",
    "2005","2006","2007","2008","2009","2010","2011",
    "2012","2013","2014","2015","2016","2017","2018",
    "2019","2020","2021","2022","2023","2024","2025"
  ]

  const handleContinue = () => {
    if (selectedMonth !== "Month" && selectedYear !== "Year") {
      navigate("/bill")
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <GridSideBar />
        <div className="flex flex-col flex-1">
          <div className="flex flex-1 flex-col items-center justify-center bg-[#E7FAFF]">
            <div className="text-center text-2xl font-medium mb-6 text-navColor max-w-4xl">
              You have selected Net Metering Policy, according to that policy billing of each house will be done as per
              the retail rate
            </div>

            <div className="w-full max-w-3xl p-10 bg-white border border-[#BF6A02] rounded-2xl shadow-lg">
              <h2 className="text-center text-xl font-medium mb-12 text-navColor">
                Please select the billing cycle to continue bill generation
              </h2>

              <div className="flex justify-center gap-10 mb-12">
                {/* Month dropdown */}
                <div className="relative w-[220px]">
                  <button
                    onClick={() => {
                      setMonthOpen(!monthOpen)
                      setYearOpen(false)
                    }}
                    className={
                      `w-full h-12 px-4 flex items-center justify-between border rounded-xl transition 
                       ${selectedMonth !== "Month" 
                         ? 'bg-[#6AD1CE]/50 border-[#000000] rounded-xl' 
                         : 'bg-white border-navColor hover:bg-gray-50'}
                      `
                    }
                  >
                    <span className="text-navColor">{selectedMonth}</span>
                    <ChevronDown className="h-5 w-5 text-navColor" />
                  </button>

                  {monthOpen && (
                    <div className="absolute top-full left-8 w-40 bg-white border border-navColor rounded-xl mt-1 max-h-60 overflow-y-auto z-20 shadow-lg">
                      {months.map((month) => (
                        <div
                          key={month}
                          className="px-4 py-3 cursor-pointer hover:bg-[#6AD1CE]/30 text-navColor"
                          onClick={() => {
                            setSelectedMonth(month)
                            setMonthOpen(false)
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
                      setYearOpen(!yearOpen)
                      setMonthOpen(false)
                    }}
                    className={
                      `w-full h-12 px-4 flex items-center justify-between border rounded-xl transition
                       ${selectedYear !== "Year"
                         ? 'bg-[#6AD1CE]/50  border-[#000000] rounded-xl'
                         : 'bg-white border-navColor hover:bg-gray-50'}
                      `
                    }
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
                            setSelectedYear(year)
                            setYearOpen(false)
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
                  disabled={selectedMonth === "Month" || selectedYear === "Year"}
                  className={
                    `px-8 py-3 rounded-full font-medium transition
                     ${selectedMonth !== "Month" && selectedYear !== "Year"
                       ? 'bg-[#FFB600] text-navColor hover:bg-[#FFB600]/90 cursor-pointer'
                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                    `
                  }
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
