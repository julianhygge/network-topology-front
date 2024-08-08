import { useEffect, useState } from "react";
import { fetchLoadTemplates } from "services/LoadProfile";
import "./LoadBuilder.css"
import PredefinedTemplatesDeleteModal from "./PredefinedTemplatesDeleteModal";

const PredefinedTemplates = () => {
  const [showReset, setShowReset] = useState(false);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await fetchLoadTemplates();
        setTemplates(data.items);
      } catch (error) {
        console.error("Error fetching load templates:", error);
      }
    }
    fetchTemplates();
  }, [])

  const isSaved = true;

  const reset = () => {

  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#E7FAFF]">
      {!isSaved &&
        <div>
          <span className="flex text-center text-navColor items-center text-[24px] font-medium mb-2">
            Load profile generation is in process, <br />
            Please continue to do the configuration from below.
          </span>
        </div>}
      <div className="flex flex-col items-center w-[50vw] px-10 py-10 font-medium text-center text-navColor bg-white rounded-2xl max-w-[860px] shadow-[0px_5px_10px_rgba(169,218,198,1)] max-md:px-5">
        {isSaved ?
          <div className="flex flex-row items-center gap-4">
            <div>
              <div className="text-white  cursor-pointer px-2 py-1">Reset Profile</div>
            </div>
            <div className="mt-10 text-[20px] max-md:mt-10">
              Please select any other <strong> Load Profile Type </strong><br />
              from the Pre Defined Templates below.
            </div>
            <div>
              <button className="reset-profile mt-5 cursor-pointer px-2 py-1">Reset Profile</button>
            </div>
          </div>
          :
          <div className="mt-10 text-xl max-md:mt-10">
            Please select one of the following <strong>Pre Defined Templates</strong><br />
            to generate the Load Profile
          </div>}
        <div className="flex gap-8 justify-between mt-10 max-w-full text-xl tracking-normal text-navColor whitespace-nowrap max-md:mt-10">
          {templates.map((template) => (
            <button key={template.id}
              className="flex justify-center items-center px-10 py-10 bg-white border-[1px] border-navColor shadow-xl rounded-[20px] max-md:px-5"
              onClick={() => console.log(template)}
            >
              {template.name} <br />
              {template.power_kw} KW
            </button>))}
        </div>
        <button
          className={`flex justify-center mt-12 items-center px-16 py-3 shadow-sm rounded-[33px] max-md:px-5  bg-[#74AA50] ${isSaved ? " opacity-50 cursor-not-allowed" : "bg-[#74AA50]"
            }`}
        >Save</button>
      </div>
      {showReset && <PredefinedTemplatesDeleteModal onConfirm={reset} onCancel={() => setShowReset(false)} />}
    </div>
  );
}

export default PredefinedTemplates;
