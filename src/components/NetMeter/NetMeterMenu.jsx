import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from 'components/Common/Navbar'
import GridSideBar from 'components/Grid/GridSideBar'
import LoadingPopup from './LoadingPopup'

export default function NetMeterMenu() {
  const navigate = useNavigate()
  const [popupInfo, setPopupInfo] = useState(null)

  const handleSelect = (path) => {
    navigate(path)
  }

  const handleIconClick = (policy) => {
    const messages = {
      NetMetering:    'According to this policy, billing of each house will be done as per the retail rate.',
      GrossMetering:  'With gross metering, all generation is exported at a fixed feed-in tariff.',
      TOURateMetering: 'Time-of-use rate means billing varies depending on the hour of day.',
    }

    setPopupInfo({
      title: policy,
      message: messages[policy] || 'No details available.',
    })
  }

  const closePopup = () => setPopupInfo(null)

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <GridSideBar />

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          <div className="flex flex-1 flex-col items-center justify-center bg-[#E7FAFF]">
            <div className="text-center text-2xl font-medium mb-6 text-navColor">
              Net metering algorithm has three types of policies
            </div>

            <div className="flex flex-col justify-center items-center w-full max-w-3xl p-12 bg-white border border-[#BF6A02] rounded-2xl shadow-lg">
              <h2 className="text-center text-xl font-medium mb-20 text-navColor">
                Please select one of the desired policies
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {['NetMetering', 'GrossMetering', 'TOURateMetering'].map((policy) => (
                  <button
                    key={policy}
                    onClick={() => handleSelect(policy)}
                    className="
                      relative
                      group
                      flex flex-row gap-3 items-center justify-center
                      w-full h-24 p-6 rounded-lg shadow transition
                      bg-[#FFB600] bg-opacity-30 text-navColor
                      hover:bg-opacity-100 hover:cursor-pointer
                    "
                  >
                    {/* Info Icon (visible on hover) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleIconClick(policy)
                      }}
                      className="
                        absolute top-2 right-2
                        hidden group-hover:flex
                        items-center justify-center
                        w-6 h-6 rounded-full shadow
                        hover:bg-gray-100
                      "
                    >
                      <img
                        src="/images/Info.png"
                        alt="Info"
                        className="w-4 h-4"
                      />
                    </button>

                    {/* Policy Label */}
                    <span className="text-center font-semibold">
                      {policy === 'TOURateMetering' ? 'TOU Rate Metering' : policy}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Loading Popup */}
      {popupInfo && (
        <LoadingPopup
          title={`${popupInfo.title} Info`}
          duration={4000}
          onClose={closePopup}
        >
          <p>{popupInfo.message}</p>
        </LoadingPopup>
      )}
    </div>
  )
}
