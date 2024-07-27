// import React from "react";

// const DeleteConfirm = ({ onClose }) => {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="flex flex-col items-center justify-center ">
//         <div>
//           <span className="flex text-center text-navColor items-center text-[24px] font-medium"></span>
//         </div>
//         <div className="flex flex-col items-center w-[50vw] px-10 pt-10 pb-20 font-medium text-center text-navColor border-2 border-[#5A8E9D] bg-white rounded-2xl max-w-[860px] max-md:px-5">
//           <div className="mt-20 text-xl text-[#F8440B] max-md:mt-10">
//             You are deleting the below uploaded file from the Load profile.
//             <span className="font-semibold">
//               {" "}
//               Suresh_Patel_15min_load_profile.csv
//             </span>
//           </div>
//           <span className="mt-8 text-xl text-[#F8440B]"> Please Confirm</span>
//           <div className="flex gap-8 justify-between mt-10 max-w-full text-xl tracking-normal text-white whitespace-nowrap max-md:mt-10">
//             <button
//               className="flex justify-center items-center px-20 py-4 bg-[#FFB600] shadow-sm rounded-[33px] max-md:px-5"
//               onClick={onClose}
//             >
//               NO
//             </button>
//             <button
//               className="flex justify-center items-center px-20 py-4 shadow-sm bg-[#74AA50] rounded-[33px] max-md:px-5"
//               onClick={onClose}
//             >
//               YES
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeleteConfirm;
import React from "react";

const DeleteConfirm = ({ onClose, onConfirm, fileName }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center justify-center ">
        <div>
          <span className="flex text-center text-navColor items-center text-[24px] font-medium"></span>
        </div>
        <div className="flex flex-col items-center w-[50vw] px-10 pt-10 pb-20 font-medium text-center text-navColor border-2 border-[#5A8E9D] bg-white rounded-2xl max-w-[860px] max-md:px-5">
          <div className="mt-20 text-xl text-[#F8440B] max-md:mt-10">
            You are deleting the below uploaded file from the Load profile.
            <span className="font-semibold"> {fileName}</span>
          </div>
          <span className="mt-8 text-xl text-[#F8440B]"> Please Confirm</span>
          <div className="flex gap-8 justify-between mt-10 max-w-full text-xl tracking-normal text-white whitespace-nowrap max-md:mt-10">
            <button
              className="flex justify-center items-center px-20 py-4 bg-[#FFB600] shadow-sm rounded-[33px] max-md:px-5"
              onClick={onClose}
            >
              NO
            </button>
            <button
              className="flex justify-center items-center px-20 py-4 shadow-sm bg-[#74AA50] rounded-[33px] max-md:px-5"
              onClick={onConfirm}
            >
              YES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
