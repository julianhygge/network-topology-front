import React from 'react'
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import { useParams } from 'react-router-dom';
import "./LoadBuilder.css"

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
                                            ? "bg-[#FDFFFF] rounded-lg text-[#794C03] font-bold cursor-pointer"
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
                    <div className='flex flex-col flex-1'>
                        <div className='flex justify-between bg-breadcrumbBackgroundColor max-h-[60px]'>
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
                        <div className='container'>
                            <div className='nav'>
                                <ul>
                                    <li className='heading'>
                                        Please continue to do the configuration from Load Builder below.
                                    </li>
                                    <li className='watts'>
                                        Total = 67,800 Watts
                                    </li>
                                    <li className='reset-profile'>
                                        Reset Profile
                                    </li>
                                </ul>
                            </div>
                            <div className="table-container">
                                <div className="device-table">
                                    <ul>
                                        <li className='device-type-column'>
                                            Device Type
                                        </li>
                                        <li className='rating-column'>
                                            Rating (watts)
                                        </li>
                                        <li className='quantity-column'>
                                           Quantity
                                        </li>
                                        <li className='hours-column'>
                                           Hours
                                        </li>
                                        <li className='total-column'>
                                           Total (w)
                                        </li>
                                        <li className='action-column'>
                                           Action
                                        </li>
                                    </ul>
                                    {[
                                        { type: 'AC', rating: 1800, quantity: 2, hours: 8, total: 28800 },
                                        { type: 'TV', rating: 800, quantity: 2, hours: 10, total: 16000 },
                                        { type: 'Geiser', rating: 2000, quantity: 2, hours: 1, total: 4000 },
                                        { type: 'Fan', rating: 1800, quantity: 2, hours: 8, total: 28800 },
                                        { type: 'Microwave', rating: 1800, quantity: 2, hours: 8, total: 28800 },
                                        { type: 'LED', rating: 1800, quantity: 2, hours: 8, total: 28800 },
                                        { type: 'Fridge', rating: 1800, quantity: 2, hours: 8, total: 28800 },
                                        { type: 'Washing Machine', rating: 1800, quantity: 2, hours: 8, total: 28800 }
                                    ].map((item, index) => (
                                        // TODO: Change the key to something better than index like an id.
                                        <React.Fragment key={index}>
                                            <ul>
                                                <li className='device-type-column'>{item.type}</li>
                                                <li className='rating-column'>{item.rating}</li>
                                                <li className='quantity-column'>{item.quantity}</li>
                                                <li className='hours-column'>{item.hours}</li>
                                                <li className='total-column'>{item.total}</li>
                                                <li className='action-column'>
                                                    <button className="delete-button">X</button>
                                                </li>
                                            </ul>
                                            {index === 7 && (
                                                <ul>
                                                    <li className='device-type-column'>
                                                        <button className='select-button'>Select</button>
                                                    </li>
                                                    <li className='rating-column'>
                                                        <button className='enter-button'>Enter</button>
                                                    </li>
                                                    <li className='quantity-column'>
                                                        <div className='flex justify-center gap-2'>
                                                            <button>-</button>
                                                            <input className='text-center w-10' type="text" value={"00"}/>
                                                            <button>+</button>
                                                        </div>
                                                    </li>
                                                    <li className='hours-column'>
                                                        <div className='flex justify-center gap-2'>
                                                            <button>-</button>
                                                            <input className='text-center w-10' type="text" value={"10"}/>
                                                            <button>+</button>
                                                        </div>
                                                    </li>
                                                    <li className='total-column'>00</li>
                                                    <li className='action-column'>
                                                        <button className="add-button">+</button>
                                                    </li>
                                            </ul>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
      );
};

export default LoadBuilder;