import React, { useState } from 'react';

const TransForm = ({ show, onClose, onSubmit, substationName }) => {
  const [trans, setTrans] = useState('');

  const handleInputChange = (e) => {
    setTrans(e.target.value);
  };

  const handleSubmit = () => {
    if (trans && !isNaN(trans)) {
      onSubmit(parseInt(trans, 10));
      onClose();  
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-[#FFFFFF] bg-opacity-60 z-50  mt-19 font-dinPro">
      <div className="relative flex flex-col pb-1 text-white ">
        <main className="flex flex-col items-center mt-10 max-md:mt-10">
          <div className="flex flex-col items-center px-60 py-20 rounded-2xl shadow-2xl bg-navColor bg-opacity-90 max-md:px-5 mt-7">
            <img
              loading="lazy"
              src="images/HyggeLogo.png"
              alt="Hygge Logo"
              className="w-[60px]"
            />
            <h2 className="mt-12 text-2xl  text-[#FFFFFF] tracking-wide text-center max-md:mt-10 ">
              Please add the <br />number of transformers <br />under the {substationName}
            </h2>
            <p className=" mt-10 text-[20px] max-md:mt-10">Enter Number of Transformers</p>
            <input
              type="number"
              value={trans}
              onChange={handleInputChange}
              className="mt-3 bg-white rounded-2xl h-[55px] w-[300px] p-4 text-black"
              placeholder="Enter number of transformers"
            />
            <button
              onClick={handleSubmit}
              className="px-20 py-1 mt-11 text-[20px] h-[55px] w-[300px] font-bold text-center text-navColor bg-amber-400 rounded-2xl max-md:px-5 max-md:mt-10"
            >
              Next
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            >
              Close
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransForm;
