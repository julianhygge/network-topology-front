import React, { useState } from 'react'
import { useNavigate, useParams,useSearchParams } from 'react-router-dom'
import Navbar from './Navbar'
import { createVersion } from 'services/netMeteringService'

export default function CreateVersion() {
  const navigate = useNavigate()
  const { simulationId } = useParams()
    const [search]       = useSearchParams()
    const simulationName = search.get("name") || ""

  const [version, setVersion] = useState({ title: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setVersion(v => ({ ...v, [name]: value }))
  }

  const handleCancel = () => navigate(-1)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await createVersion({
        simulation_container_id: simulationId,
        run_name: version.title,
        description: version.description
      })
      navigate(`/dash/sim/${simulationId}`)
    } catch (err) {
      console.error(err)
      setError('Failed to create version')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6CCECD] to-[#356770]">
      <Navbar />
      <main className="flex flex-col h-[calc(100vh-4rem)] pt-20">
        <div className="flex flex-row gap-16 px-6 pt-6">
          {/* back + header */}
          <button
            onClick={() => navigate(-1)}
            className="w-20 h-12 rounded-full border-[1px] border-[#D59805] bg-[#FFF8E6] hover:bg-[#FFF3D7] flex items-center justify-center transition-colors shadow"
          >
            <img src="/images/Arrow 3.png" alt="Back" className="w-6 h-6" />
          </button>
          <div>
            <p className="text-[#000505] text-2xl mb-1">Versions</p>
            <h1 className="text-[#000505] text-4xl font-bold">
              {simulationName}
            </h1>
          </div>
        </div>

        {/* central form card */}
        <div className="flex flex-1 items-center justify-center px-16">
          <div className="bg-[#F6FFFF]/50 border-2 border-[#9A9A9A] rounded-lg shadow-lg p-10 px-12 max-w-xl w-full">
            <h2 className="text-3xl font-semibold text-black mb-6">
              Version Details
            </h2>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-black text-xl font-medium mb-2">
                Title
              </label>
              <textarea
                name="title"
                rows={1}
                value={version.title}
                onChange={handleChange}
                placeholder="Enter version title"
                className="w-full bg-white border border-yellow-400 rounded-xl px-4 py-2 outline-none  resize-none"
              />
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-black text-xl font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                value={version.description}
                onChange={handleChange}
                placeholder="Enter version description"
                className="w-full bg-white border border-yellow-400 rounded-xl px-4 py-2 outline-none resize-none"
              />
            </div>

            {error && (
              <p className="text-red-500 text-center mb-4">{error}</p>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-6">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="bg-[#C0C0C0] hover:bg-gray-400 text-navbar text-xl font-medium px-14 py-3 rounded-lg shadow disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#1BA13D] hover:bg-green-700 text-white font-medium text-xl px-16 py-3 rounded-lg shadow disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
