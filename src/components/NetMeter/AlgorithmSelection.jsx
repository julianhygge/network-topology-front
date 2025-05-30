import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from 'components/Common/Navbar'
import GridSideBar from 'components/Grid/GridSideBar'
import {
  fetchAlgorithms,
  createSimulationRun
} from 'services/netMeteringService'

export default function AlgorithmSelection() {
  const { houseId } = useParams()
  const navigate = useNavigate()
  const [algs, setAlgs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // map display_name → your local image file
  const logoMap = {
    'Net Metering':     '/images/NetMeter.png',
    'Autonomous Bidding':'/images/Autonomous.png',
    'Special Groups':   '/images/SpecialGroup.png',
    'Option -4':        '/images/Option.png',
  }

  useEffect(() => {
    fetchAlgorithms()
      .then((data) => {
        if (Array.isArray(data.items)) {
          setAlgs(data.items)
        } else {
          throw new Error('Invalid response format: expected data.items[]')
        }
      })
      .catch((err) => setError(err.message || 'Unable to load algorithms'))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = async (alg) => {
    if (alg.display_name !== 'Net Metering') {
      // not yet wired up
      return
    }
    try {
      const res = await createSimulationRun({
        topologyRootNodeId: "6e6e0f2e-8b9e-4f88-a758-401c8281898c",
        algorithmTypeId:   alg.id,
        localityId:"94522a0a-c8f1-40f8-a2e5-9aed2dc55555"
      })
      console.log(res);
      const simulationRunId=res.id
      navigate(`netMetering/${simulationRunId}`)
     
    } catch (e) {
      console.error(e)
      setError('Failed to start simulation')
    }
  }

   if (loading) {
      return (
        <div className="flex flex-col h-screen">
          <Navbar />
          <div className="flex flex-1 items-center justify-center bg-[#E7FAFF]">
            <span className="text-navColor">Loading Algorithms…</span>
          </div>
        </div>
      )
    }
  if (error)   return <div className="p-8 text-red-500">{error}</div>

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        {/* <GridSideBar /> */}
        <div className="flex flex-1 flex-col items-center justify-center bg-[#E7FAFF] p-8">
          <div className="text-center text-2xl font-medium mb-6 text-navColor">
            The allocation engine currently uses these algorithms to simulate energy flow
          </div>
          <div className="w-full max-w-5xl p-12 bg-white border border-[#BF6A02] rounded-2xl shadow-lg">
            <h2 className="text-center text-xl font-medium mb-20 text-navColor">
              Please select one of the following algorithms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {algs.map((alg) => {
                const logoSrc = logoMap[alg.display_name] || '/images/default-logo.png'
                return (
                  <button
                    key={alg.id}
                    onClick={() => handleSelect(alg)}
                    className="
                      flex flex-row gap-3 items-center justify-center
                      w-full h-24 p-6 rounded-lg shadow transition
                      bg-[#FFB600] bg-opacity-30 text-navColor
                      hover:bg-opacity-100 hover:cursor-pointer
                    "
                  >
                    <img
                      loading="lazy"
                      src={logoSrc}
                      alt={alg.display_name}
                      className="w-5 h-5"
                    />
                    <span className="text-center font-semibold">
                      {alg.display_name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
