import React from "react";
import Breadcrumb from "./Breadcrumb";
import "./Breadcrumb.css"

const Delete = ({ onConfirm, onClose, entityId, entityName, entityType }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative flex flex-col justify-center px-1 text-xl font-medium text-orange-600 w-[800px] max-w-[800px] bg-white rounded-3xl border border-sky-400 border-solid shadow-sm z-10">
      <div className="absolute inset-0 top-5 -z-10 text-[14px] text-black font-light">
        <Breadcrumb nodeId={entityId} size='small'/>
      </div>
        <div className="flex flex-col items-center  pb-14 pt-2  max-md:pr-5 max-md:max-w-full">
          <button className="cursor-pointer absolute top-3 right-5 p-2 text-4xl font-thin text-black" onClick={onClose}>X</button>
          <div className="mt-28 text-center w-[540px] max-md:mt-10">
            Are you sure to delete this {entityType.charAt(0).toUpperCase() + entityType.slice(1)} <br />
            <span className="text-2xl">{entityName} ?</span>
          </div>
          <div className="mt-8 text-center max-md:mt-10"> Please Confirm</div>
          <button
           className="px-20 py-1 mt-16 text-[20px] h-[55px] w-[300px] font-bold text-center text-navColor bg-amber-400 rounded-2xl max-md:px-5 max-md:mt-10" onClick={onConfirm}
          >
           YES
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
