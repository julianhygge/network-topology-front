import React from "react";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import { X } from 'lucide-react';

const Delete = ({ onConfirm, onClose, entity, entityId, entityName, entityType }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative flex flex-col justify-center  font-medium text-[#000000] w-[600px] max-w-[650px] bg-gradient-to-br from-[#F6FFFF] from-[100%] to-[#8D9090] to-[100%] rounded-3xl border-2 border-solid border-[#9A9A9A] shadow-sm z-10">
        <div className="absolute top-5 z-1 text-[14px] text-black font-light">
          {entity && entity.new !== true && <Breadcrumb nodeId={entityId} onEditNode={() => { }} />}
        </div>
        <div className="flex flex-col items-center p-8  max-md:pr-5 max-md:max-w-full">
          <button className="cursor-pointer absolute top-3 right-5 p-2 text-4xl font-thin text-black" onClick={onClose}><X></X></button>
          <div className="mt-20 text-center text-2xl w-[540px] max-md:mt-10">
            Are you sure to delete this {entityType.charAt(0).toUpperCase() + entityType.slice(1)} <br />
            <span className="text-2xl">{entityName} ?</span>
          </div>
          <div className="mt-4 text-center max-md:mt-10">This action is permanent and cannot be undone.</div>
          {/* <button
            className="px-20 py-1 mt-10 text-[20px] h-[55px] w-[300px] font-bold text-center text-navColor bg-amber-400 rounded-2xl max-md:px-5 max-md:mt-10" onClick={onConfirm}
          >
            YES
          </button> */}
        <div className="mt-8 flex justify-center gap-4">
          <button
           onClick={onClose}
            
            className=" bg-[#C0C0C0] hover:bg-gray-300 text-navColor font-bold px-14 py-3.5 rounded-lg transition shadow-[0px_4px_4px_0px_#00000040] "
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#E63C3C] hover:bg-red-600  disabled:opacity-50 text-white font-bold px-16 py-3.5 rounded-lg transition shadow-[0px_4px_4px_0px_#00000040] "
          >
            Delete
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Delete;
