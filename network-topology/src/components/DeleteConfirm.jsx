import React from "react";
import Breadcrumb from "./Breadcrumb";

const Delete = ({ onConfirm, onClose, entityName, entityType }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className=" flex flex-col justify-center px-1 text-xl font-medium text-orange-600 max-w-[728px] bg-white rounded-3xl border border-sky-400 border-solid shadow-sm">
        <div className="flex flex-col items-center  pb-14 pt-2  max-md:pr-5 max-md:max-w-full">
          <div className="flex gap-5 self-end mr-3  text-4xl tracking-wide text-cyan-900 whitespace-nowrap font-[275] max-md:flex-wrap max-md:max-w-full">
            <button className="flex" onClick={onClose}>X</button>
          </div>
          <div className="mt-20 text-center w-[540px] max-md:mt-10">
            Are you sure to delete this {entityType.charAt(0).toUpperCase() + entityType.slice(1)} <br />
            <span className="text-2xl">{entityName} ?</span>
          </div>
          <div className="mt-16 text-center max-md:mt-10"> Please Confirm</div>
          <button
           className="px-20 py-1 mt-11 text-[20px] h-[55px] w-[300px] font-bold text-center text-navColor bg-amber-400 rounded-2xl max-md:px-5 max-md:mt-10" onClick={onConfirm}
          >
           YES
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
