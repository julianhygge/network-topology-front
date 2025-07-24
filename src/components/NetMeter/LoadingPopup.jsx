import React, { useState, useEffect } from 'react'

export default function LoadingPopup({
  title = 'Info',
  children,
  duration = 5000,
  onClose
}) {
  const [filled, setFilled] = useState(false)

  //kick off the animation as soon as we mount
  useEffect(() => {
    const id = window.setTimeout(() => setFilled(true), 50)
    return () => window.clearTimeout(id)
  }, [])

  return (
    // backdrop
    <div className="fixed inset-0 flex items-center justify-center bg-[#BED2D4] bg-opacity-40 z-50">
      {/* popup container */}
      <div className="relative w-full max-w-xl mx-4 bg-white   border border-[#2BC5C0]  overflow-hidden shadow-xl">
        {/* animated fill bar */}
        <div
          className="absolute top-0 left-0 bottom-0 bg-[#2BC5C0] bg-opacity-40"
          style={{
            width: filled ? '100%' : '0%',
            transition: `width ${duration}ms linear`
          }}
          // when the CSS transition finishes, close the popup
          onTransitionEnd={onClose}
        />

        {/* content */}
        <div className=" relative p-4 max-w-lg flex items-start">
            <div className='flex flex-row  justify-centerm items-center gap-3'>
                 <img
            src={`${process.env.PUBLIC_URL}/images/info.png`}
            alt=""
            className="w-6 h-6 items-center flex-shrink-0 text-navColor"
          />
          <div>
            <h3 className="text-lg font-semibold text-navColor ">
              {/* {title} */}
              Info
            </h3>
            <div className="text-navColor">{children}</div>
          </div>

            </div>
          <button
            onClick={onClose}
            className="absolute top-3 -right-10 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200"
          >
            X
          </button>
        </div>
      </div>
    </div>
  )
}
