import React from "react";

const LoadProfileDeleteModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex flex-col justify-center text-xl font-medium text-orange-600 font-semibold w-[800px] max-w-[800px] bg-white rounded-3xl border border-sky-400 border-solid shadow-sm z-10">
                <div className="flex flex-col items-center pb-14 pt-2 max-md:pr-5 max-md:max-w-full">
                    <div className="flex flex-col">
                        <div className="mt-28 text-center max-md:mt-10">
                            You are deleting the Load Profile Data,
                            <br />
                            All the Load Profile data will be reset.
                        </div>
                        <div className="mt-4 text-center max-md:mt-10">
                           Please Confirm
                        </div>
                    </div>
                        <div className="flex gap-8 justify-between mt-10 max-w-full font-medium text-lg text-white whitespace-nowrap max-md:mt-10">
                            <button
                            className="flex justify-center items-center px-[70px] py-4 bg-[#FFB600] text-black shadow-sm rounded-[33px] max-md:px-5"
                            onClick={onCancel}
                            >
                            NO
                            </button>
                            <button
                            className="flex justify-center items-center px-[70px] py-4 shadow-sm bg-[#74AA50] rounded-[33px] max-md:px-5"
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

export default LoadProfileDeleteModal;
