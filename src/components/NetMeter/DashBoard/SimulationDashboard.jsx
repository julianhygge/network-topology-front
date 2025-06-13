import React, { useState } from 'react'
import {
  Plus,
  MoreVertical,
  Download,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

const sampleRuns = [

  { id: 'A1B2C', title: 'Net Metering Test', description: 'Analyzing the Grid performance under extreme winter to  identify vulnerability', versions: { completed: 4, draft: 2, error: 1 }, topologyFile: 'Something.json',location:'Shanti Niketan-1,  S00011', created: '10/04/2025', modified: '15/04/2025' },
  { id: 'D3E4F', title: 'Autonomous Bidding Test', description: 'Analyzing the Grid performance under extreme winter to  identify vulnerability', versions: { completed: 3, draft: 1, error: 0 }, topologyFile: 'TopologyA.json',location:'Shanti Niketan-1,  S00011', created: '12/04/2025', modified: '16/04/2025' },
  { id: 'G5H6I', title: 'Special Groups Test', description: 'Analyzing the Grid performance under extreme winter to  identify vulnerability', versions: { completed: 5, draft: 0, error: 0 }, topologyFile: 'Groups.json',location:'Shanti Niketan-1,  S00011', created: '14/04/2025', modified: '18/04/2025' },
  { id: 'G5H6I', title: 'Special Groups Test', description: 'Analyzing the Grid performance under extreme winter to  identify vulnerability', versions: { completed: 5, draft: 0, error: 0 }, topologyFile: 'Groups.json',location:'Shanti Niketan-1,  S00011', created: '14/04/2025', modified: '18/04/2025' },
  { id: 'G5H6I', title: 'Special Groups Test', description: 'Analyzing the Grid performance under extreme winter to  identify vulnerability', versions: { completed: 5, draft: 0, error: 0 }, topologyFile: 'Groups.json',location:'Shanti Niketan-1,  S00011', created: '14/04/2025', modified: '18/04/2025' },
  { id: 'G5H6I', title: 'Special Groups Test', description: 'Analyzing the Grid performance under extreme winter to  identify vulnerability', versions: { completed: 5, draft: 0, error: 0 }, topologyFile: 'Groups.json',location:'Shanti Niketan-1,  S00011', created: '14/04/2025', modified: '18/04/2025' },

]

export default function SimulationDashboard() {
  const navigate = useNavigate()
  const perPage = 3
   const maxPage = sampleRuns.length - perPage 
  const maxOffset = (sampleRuns.length - perPage) * 100 / perPage
  const [offset, setOffset] = useState(0)

  const prev = () => setOffset((o) => Math.max(o - 100 / perPage, 0))
  const next = () => setOffset((o) => Math.min(o + 100 / perPage, maxOffset))


  //When No simulation Present.

  if (sampleRuns.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
        <Navbar />

        <main className="flex items-center justify-center h-[calc(100vh-4rem)] px-14">
          <div className="bg-[#F6FFFF]/50 rounded-lg shadow-lg p-10  max-w-xl w-full text-center mx-auto">
            <img
              src="images/NoSim.png"
              alt="No Simulations"
              className="mx-auto mb-8 "
            />

            <h2 className="text-4xl font-bold mb-6">No Simulations Yet!</h2>
            <p className="mb-10 text-gray-700">
              Click below to start your first simulation
            </p>

            <button
              onClick={() => navigate("/create")}
              className="mx-auto flex items-center justify-center border-1 shadow-lg  border-navColor bg-[#FFB600] hover:bg-[#E0A800] text-black font-medium px-6 py-2 rounded-lg gap-2"
            >
              <Plus size={20} /> Create New Simulation
            </button>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex flex-col mx-auto px-16 pt-28">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold text-black">Simulation Runs</h2>
          <button
            onClick={() => navigate('/create')}
            className="bg-[#FFB600] hover:bg-amber-500 text-black font-medium px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Create New Simulation
          </button>
        </div>

        {/* Carousel wrapper */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${offset}%)` }}
          >
            {sampleRuns.map((run) => (
              <div key={run.id} className="flex-shrink-0 w-1/3 px-2">
                {/* Card design unchanged */}
                <div className="bg-[#F6FFFF]/85 rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{run.title}</h3>
                        <p className="text-gray-600">Run ID : {run.id}</p>
                      </div>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="border-t border-[#9CAAAD] my-4"></div>

                    <p className="text-sm">{run.description}</p>

                    <div className="mt-4">
                      <h4 className="font-semibold">Version Summary:</h4>
                      <p>
                        {run.versions.completed +
                          run.versions.draft +
                          run.versions.error}{' '}
                        Versions
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <span className="flex items-center">
                          <span className="h-3 w-3 rounded-full bg-[#09A326] inline-block mr-1" />
                          {run.versions.completed} Completed
                        </span>
                        <span className="flex items-center">
                          <span className="h-3 w-3 rounded-full bg-[#B3B3B3] inline-block mr-1" />
                          {run.versions.draft} Draft
                        </span>
                        <span className="flex items-center">
                          <span className="h-3 w-3 rounded-full bg-[#BC0E10] inline-block mr-1" />
                          {run.versions.error} Error
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold">Base Topology:</h4>
                      <div className="flex justify-between items-center">
                        <p>{run.topologyFile}</p>
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                     <div className="mt-4">
                      <h4 className="font-semibold">Location:</h4>
                      <div className="flex justify-between items-center">
                        <p>{run.location}</p>
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <MapPin className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 space-y-1">
                      <p>Created : {run.created}</p>
                      <p>Last Modified : {run.modified}</p>
                    </div>

                    <button className="w-full mt-4 bg-[#FFB600] hover:bg-amber-500 text-black font-medium py-2 rounded-md flex items-center justify-center gap-2" 
                      onClick={() => navigate('/dash/sim')}>
                      Open Simulation <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Arrows */}
        <div className="flex justify-center mt-6 gap-4 pb-2">
          <button
            onClick={prev}
            disabled={offset === 0}
            className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            disabled={offset === maxPage * (100 / perPage)}
            className="bg-gray-100 hover:bg-gray-200 rounded-md p-2 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </main>
    </div>
  )
}
