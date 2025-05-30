import React from 'react'
import { useNavigate} from 'react-router-dom'
import Navbar from 'components/Common/Navbar'
import GridSideBar from 'components/Grid/GridSideBar'


export default function AlgorithmSelection() {
  const navigate = useNavigate()

  const handleSelect = (path) => {
    navigate(`${path}`)
  }

  return (
    <div className="flex flex-col h-screen">
          <Navbar />
      <div className='flex flex-1'>
      <GridSideBar />

      <div className="flex flex-col flex-1">
       

        <div className="flex flex-1 flex-col items-center justify-center bg-[#E7FAFF]">
          <div className="text-center text-2xl font-medium mb-6 text-navColor">
            The allocation engine currently uses these algorithms to simulate energy flow
          </div>

          <div className="w-full max-w-5xl p-12 bg-white border border-[#BF6A02] rounded-2xl shadow-lg">
            <h2 className="text-center text-xl font-medium mb-20 text-navColor">
              Please select one of the following algorithms
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Autonomous Bidding */}
              <button
                onClick={() => handleSelect('autonomous')}
                className={`
                  flex flex-row gap-3 items-center justify-center
                  w-full h-24 p-6 rounded-lg shadow transition
                  bg-[#FFB600] bg-opacity-30 text-navColor
                  hover:bg-opacity-100 hover:cursor-pointer
                `}
              >
                <img loading="lazy" src="/images/Autonomous.png" className="w-5 h-5" alt="" />
                <span className="text-center font-semibold">
                  Autonomous <br /> Bidding
                </span>
              </button>

              {/* Special Groups */}
              <button
                onClick={() => handleSelect('specialGroups')}
                className={`
                  flex flex-row gap-3 items-center justify-center
                  w-full h-24 p-6 rounded-lg shadow transition
                  bg-[#FFB600] bg-opacity-30 text-navColor
                  hover:bg-opacity-100 hover:cursor-pointer
                `}
              >
                <img loading="lazy" src="/images/SpecialGroup.png" className="w-5 h-5" alt="" />
                <span className="text-center font-semibold">Special Groups</span>
              </button>

              {/* Net Metering */}
              <button
                onClick={() => handleSelect('netMetering')}
                className={`
                  flex flex-row gap-3 items-center justify-center
                  w-full h-24 p-6 rounded-lg shadow transition
                  bg-[#FFB600] bg-opacity-30 text-navColor
                  hover:bg-opacity-100 hover:cursor-pointer
                `}
              >
                <img loading="lazy" src="/images/NetMeter.png" className="w-5 h-5" alt="" />
                <span className="text-center font-semibold">Net Metering</span>
              </button>

              {/* Option -4 */}
              <button
                onClick={() => handleSelect('option4')}
                className={`
                  flex flex-row gap-3 items-center justify-center
                  w-full h-24 p-6 rounded-lg shadow transition
                  bg-[#FFB600] bg-opacity-30 text-navColor
                  hover:bg-opacity-100 hover:cursor-pointer
                `}
              >
                <img loading="lazy" src="/images/Option.png" className="w-5 h-5" alt="" />
                <span className="text-center font-semibold">Option -4</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
