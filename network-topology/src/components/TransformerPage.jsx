import React from "react";
import Navbar from "./Navbar";

const TransformerPage = () => {
  return (
    <div className="bg-backPage min-h-screen">
        <Navbar />
        <div className="p-4 text-2xl text-gray-600 text-left ml-16">
            <button>Back</button>
        </div>
        <div className="text-2xl text-left ml-24 text-gray-600 mb-8">
            Grid - 1
        </div>
        <div className="flex gap-8 px-4 mt-4 ml-16 items-center">
        <div className="flex flex-col items-center">
                <div className="text-xl mb-2">Transformer - 1</div>
                <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 w-60 border border-black">
                    <div className="w-16 h-16 mb-4">
                    <img src="/images/Star.png" alt="Star" className="w-full h-full" />
                    </div>
                    <button className="mb-4 w-full py-4 bg-customYellow text-gray-800 rounded-2xl shadow">
                        Add Properties
                    </button>
                    <button className="w-full py-2 bg-customGreen text-white rounded-2xl shadow flex items-center justify-center">
                        Add Houses <span className="ml-6 text-3xl mb-1">+</span>
                    </button>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="text-xl mb-2">Transformer - 2</div>
                <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 w-60 border border-black">
                    <div className="w-16 h-16 mb-4">
                    <img src="/images/Star.png" alt="Star" className="w-full h-full" />
                    </div>
                    <button className="mb-4 w-full py-4 bg-customYellow text-gray-800 rounded-2xl shadow">
                        Add Properties
                    </button>
                    <button className="w-full py-2 bg-customGreen text-white rounded-2xl shadow flex items-center justify-center">
                        Add Houses <span className="ml-6 text-3xl mb-1">+</span>
                    </button>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="text-xl mb-2">Transformer - 3</div>
                <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 w-60 border border-black">
                    <div className="w-16 h-16 mb-4">
                    <img src="/images/Star.png" alt="Star" className="w-full h-full" />
                    </div>
                    <button className="mb-4 w-full py-4 bg-customYellow text-gray-800 rounded-2xl shadow">
                        Add Properties
                    </button>
                    <button className="w-full py-2 bg-customGreen text-white rounded-2xl shadow flex items-center justify-center">
                        Add Houses <span className="ml-6 text-3xl mb-1">+</span>
                    </button>
                </div>
            </div>
            <button className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-4 w-24 h-24 border border-black">
                <div className="text-4xl">+</div>
                <div className="text-base text-black-400">Add</div>
            </button>
        </div>
    </div>
  );
};

export default TransformerPage;
