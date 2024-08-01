import React from 'react'
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import { useParams } from 'react-router-dom';

const LoadBuilder = () => {
    const selectedButton = "Load Profile";
    const houseId = useParams();
    return (
        <>
            <div className="flex flex-col box-border max-w-[1920px] h-[100vh] font-dinPro">
                <Navbar />
                <div className='flex h-full w-full box-border'>
                    <div className="flex flex-col bg-sideBar w-[120px] h-full relative">
                        <div className="flex-1 overflow-hidden">
                            <div className="h-[calc(100%_-_80px)] mt-24">
                                <div className="grid font-normal">
                                    {[
                                    "Load Profile",
                                    "Solar Profile",
                                    "Battery Profile",
                                    "Flags",
                                    "EV Profile",
                                    "Wind Profile",
                                    ].map((item, index) => (
                                    <React.Fragment key={index}>
                                        <button
                                        className={`grid justify-center items-center text-[15px] ${selectedButton === item
                                            ? "bg-[#FDFFFF] rounded-lg text-[#794C03] font-bold cursor-default"
                                            : "text-gridColor1 cursor-not-allowed"
                                            }`}
                                        style={{ minHeight: item === "Load Profile" ? "100px" : "95px" }}
                                        >
                                        {item.split(" ").map((word, wordIndex) => (
                                            <React.Fragment key={wordIndex}>
                                            {word} <br />
                                            </React.Fragment>
                                        ))}
                                        </button>
                                        {selectedButton !== item && index < 5 && (
                                        <img
                                            className="grid justify-center w-20 ml-5"
                                            loading="lazy"
                                            src={`${process.env.PUBLIC_URL}/images/Line 24.png`}
                                            alt="Line"
                                        />
                                        )}
                                    </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button className="absolute top mt-2 left-0 right-0 mx-auto grid justify-center cursor-pointer hover:opacity-50">
                            <div className="bg-[#FFF8E6] w-[80px] h-[38px] px-6 py-2 rounded-[50px] text-3xl text-gridColor1">
                                <img loading="lazy" src={`${process.env.PUBLIC_URL}/images/Arrow 2.png`} alt="Back" />
                            </div>
                        </button>
                    </div>
                    <div className='flex flex-1 justify-between bg-breadcrumbBackgroundColor max-h-[60px]'>
                        <div className="text-[14px] text-black font-light mt-2">
                            {houseId.houseId && (
                                <Breadcrumb nodeId={houseId.houseId} onEditNode={() => {}} />
                            )}
                        </div>
                        <div className='mt-2 mr-2'>
                            <button
                                className="cursor-pointer border bg-[#49AC82] px-[50px] py-[5px] rounded-3xl text-white text-md font-medium border-[#49AC82]"
                                onClick={() => {}}
                            >
                                SAVE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
      );
};

export default LoadBuilder;