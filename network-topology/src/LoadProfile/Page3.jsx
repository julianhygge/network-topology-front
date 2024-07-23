import React, { useState } from "react";
import DeleteConfirm from "./DeleteConfirm";
const Page3 = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleClosePopup = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex flex-col items-center text-1xl mt-[150px] font-bold text-center text-navColor">
      <div className="flex justify-center items-center px-16 py-5 w-[1250px] bg-sky-100 rounded-2xl max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 w-full max-w-[1075px] max-md:flex-wrap max-md:max-w-full">
          <div className="w-1/4">Date</div>
          <div className="w-1/4">User</div>
          <div className="w-1/2">Uploaded file</div>
          <div className="w-1/4">Action</div>
        </div>
      </div>
      <div className="flex flex-col gap-5 items-center px-20 py-5 w-[1250px] bg-sky-50 rounded-2xl max-md:flex-wrap max-md:px-5 max-md:max-w-full text-navColor">
        <div className="flex w-full">
          <div className="w-1/4 text-center mt-4">20/July/2024</div>
          <div className="w-1/4 text-center mt-4">Admin</div>
          <div className="w-1/2 text-center flex-auto mt-4">
            Suresh_Patel_15min_load_profile.csv
          </div>
          <div className="flex w-1/4 justify-center gap-2 text-1xl font-medium">
            <button className="px-8 py-4 shadow-sm bg-[#BDD8DB] rounded-[33px] max-md:px-5 text-navColor">
              Download File
            </button>
            <img
              loading="lazy"
              src="images/DeleteButton.png"
              className="w-[36px] h-[41.23px] mt-2 cursor-pointer"
              alt="Icon"
              onClick={handleDeleteClick}
            />
          </div>
        </div>
      </div>
      <button className="self-center px-12 py-4 mt-20 text-1xl text-navColor font-semibold tracking-normal bg-[#6AD1CE] shadow-sm rounded-[33px] max-md:px-5 max-md:mt-10">
        Upload Again
      </button>
      {showDeleteConfirm && <DeleteConfirm onClose={handleClosePopup} />}
    </div>
  );
};
export default Page3;
