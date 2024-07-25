import React, { useState, useEffect } from 'react';

const AddHousesForm = ({ show, onClose, onSubmit, transformerName }) => {
  const [numberOfHouses, setNumberOfHouses] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if(!show){
        setNumberOfHouses('');
        setError('');
    }
  },[show])

  const handleInputChange = (e) => {
    setNumberOfHouses(e.target.value);
  };

  const handleSubmit = () => {
    if (numberOfHouses <= 0 || isNaN(numberOfHouses)) {
      setError('Please enter a valid number of houses greater than 0.');
    } else {
      setError('');
      onSubmit(numberOfHouses);
      onClose();
    }
  };

  const handleClose = () => {
    setNumberOfHouses('');
    setError('');
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50 ">
      <div className="relative flex flex-col pb-1 text-white">
        <main className="flex flex-col items-center mt-10 max-md:mt-10">
          <div className="flex flex-col items-center px-60 py-20 rounded-2xl shadow-2xl bg-navColor bg-opacity-90 max-md:px-5 mt-10 mb-20">
            <img
              loading="lazy"
              src={`${process.env.PUBLIC_URL}/images/HyggeLogo.png`} 
              alt="Hygge Logo"
              className="w-[80px]"
            />
            <h2 className="mt-8 text-4xl text-center max-md:mt-10 font-light">
              Please add the <br />number of houses <br />under the Transformer - {transformerName}
            </h2>
            <p className="mt-10 text-[20px] max-md:mt-10">Enter Number of Houses</p>
            <input
              type="number"
              value={numberOfHouses}
              onChange={handleInputChange}
              className="mt-3 bg-white rounded-2xl h-[55px] w-[300px] p-4 text-black text-lg"
              placeholder='0'
            />
            {error && <p className="mt-2 text-red-500 text-lg">{error}</p>}
            <button onClick={handleSubmit} className="px-20 py-1 mt-11 text-[20px] h-[55px] w-[300px] text-center font-medium text-navColor bg-amber-400 rounded-2xl max-md:px-5 max-md:mt-10">
                Next
            </button>
            <button onClick={handleClose} className="px-20 py-1 mt-4 text-[20px] h-[55px] w-[300px] text-center font-light text-white bg-red-500 rounded-2xl max-md:px-5 max-md:mt-10">
                Close
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddHousesForm;
