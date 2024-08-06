import React from "react";

const LoadProfileQuitModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex flex-col justify-center text-lg font-medium w-[800px] max-w-[800px] bg-white rounded-3xl border border-sky-400 border-solid shadow-sm z-10">
                <div className="flex flex-col items-center pb-14 pt-2 max-md:pr-5 max-md:max-w-full">
                    <div className="flex flex-col">
                        <div className="mt-28 text-center max-md:mt-10">
                            You are quitting the Load Profile page
                        </div>
                        <div className="mt-6 text-center max-md:mt-10">
                            Do you want to save the unsaved Data before proceeding ?
                        </div>
                    </div>
                        <div className="flex gap-8 justify-between mt-12 max-w-full text-lg text-white whitespace-nowrap max-md:mt-10">
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

export default LoadProfileQuitModal;
