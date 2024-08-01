import { React, useEffect, useState } from 'react'
import LoadBuilder from '../components/LoadBuilder'

const DISPLAY_TYPES = {
  NONE: "none",
  PREDEFINED_TEMPLATES: "predefined_templates",
  GENERATION_ENGINE: "generation_engine",
  LOAD_BUILDER: "load_builder",
}

const PageLoad = () => {
  const [displayType, setDisplayType] = useState(DISPLAY_TYPES.NONE);

  if (displayType === DISPLAY_TYPES.LOAD_BUILDER) {
    return <LoadBuilder onReset={() => { setDisplayType(DISPLAY_TYPES.NONE) }} />
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#E7FAFF]">
      <div>
        <span className="flex text-center text-navColor items-center text-[24px] font-medium mb-2">
          Load profile generation is in process, <br />
          Please continue to do the configuration from below.
        </span>
      </div>
      <div className="flex flex-col items-center w-[50vw] px-10 pt-10 pb-20 font-medium text-center text-navColor bg-white rounded-2xl max-w-[860px] shadow-[0px_5px_10px_rgba(169,218,198,1)] max-md:px-5">
        <div className="mt-10 text-xl max-md:mt-10">
          Please select one of the following Methods <br />
          to Generate the Load Profile
        </div>
        <div className="flex gap-8 justify-between mt-10 max-w-full text-xl tracking-normal text-navColor whitespace-nowrap max-md:mt-10">
          <button
            className="  flex justify-center items-center px-10 py-10 bg-white  border-[1px] border-navColor shadow-xl rounded-[20px] max-md:px-5"
            onClick={() => { setDisplayType(DISPLAY_TYPES.PREDEFINED_TEMPLATES) }}
          >
            Predefined <br />
            Templates
          </button>
          <button
            className="flex justify-center items-center px-10 py-10  bg-white  border-[1px] border-navColor  shadow-xl  rounded-[20px] max-md:px-5"
            onClick={() => { setDisplayType(DISPLAY_TYPES.GENERATION_ENGINE) }}
          >
            Generation <br />
            Engine
          </button>
          <button
            className="flex justify-center items-center px-14 py-10 shadow-xl bg-white  border-[1px] border-navColor  rounded-[20px] max-md:px-5"
            onClick={() => { setDisplayType(DISPLAY_TYPES.LOAD_BUILDER) }}
          >
            Load  <br />
            Builder
          </button>
        </div>
      </div>
    </div >
  )
}
export default PageLoad;
