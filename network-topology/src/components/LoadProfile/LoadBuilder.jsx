/*
<<<<<<< HEAD:network-topology/src/LoadProfile/LoadBuilder.jsx
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { deleteLoadProfile, fetchLoadProfileItems, saveLoadProfileItems } from '../services/LoadProfile';
import { fetchAppliances } from '../services/Appliance';
import LoadBuilderForm from './LoadBuilderForm';
import LoadBuilderReset from './LoadBuilderReset';
import ReactRouterPrompt from "react-router-prompt";

const LoadBuilder = ({ onReset, setUnsaved }) => {
  const [loads, setLoads] = useState([]);
  const [searchParams] = useSearchParams()
  const [total, setTotal] = useState(0);
  const [appliances, setAppliances] = useState([])
  const [showReset, setShowReset] = useState(false);
  const isUnsaved = useRef(false);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const fetchApplianceItems = async () => {
      try {
        const data = await fetchAppliances();
        setAppliances(data.items);
      } catch (error) {
        console.error("Error fetching appliances:", error);
      }

    }
    const fetchItems = async () => {
      try {
        const data = await fetchLoadProfileItems(searchParams.get("house_id"));
        const items = data.items;
        setProfileId(data.profile_id);
        console.log("Items from useEffect", items)
        calculateTotalAndSetLoads(items)
      } catch (error) {
        console.error("Error fetching load profile items:", error);
      }
    };
    fetchApplianceItems();
    fetchItems();
  }, []);

  const calculateTotalAndSetLoads = (items) => {
    const sum = items.reduce((acc, item) => {
      const total = item.quantity * item.rating_watts * item.hours;
      item.total = total;
      item.isNew = false;
      return acc + total;
    }, 0)
    setLoads(items);
    setTotal(sum)
    isUnsaved.current = false;
    setUnsaved(isUnsaved.current);
  }

  const onAdd = ({ electricalDeviceId, ratingWatts, quantity, hours, addedTotal }) => {
    setTotal(addedTotal + total);
    setLoads([...loads, { electrical_device_id: parseInt(electricalDeviceId), rating_watts: ratingWatts, quantity, hours, total: addedTotal, isNew: true }]);
    isUnsaved.current = true;
    setUnsaved(isUnsaved.current);
  };

  const removeLoad = (loadToRemove) => {
    const load = loads.find((load) => load === loadToRemove);
    if (!load) return;
    setTotal(total - load.total);
    setLoads(loads.filter((load) => load !== loadToRemove));
    isUnsaved.current = !loadToRemove.isNew;
    console.log("Load to remove: ", loadToRemove)
    setUnsaved(isUnsaved.current);
  }

  const saveLoads = () => {
    console.log("Items to save: ", loads);
    const save = async () => {
      try {
        const newLoads = await saveLoadProfileItems(searchParams.get("house_id"), loads);
        const items = newLoads.items;
        console.log("Items from save response: ", items)
        calculateTotalAndSetLoads(items);
      } catch (error) {
        console.error("Error saving load profile items:", error);
      }
    }
    save()
  }

  const electricalIdToName = (profileId) => {
    return appliances.find((appliance) => appliance.id === profileId)?.name;
  }

  const reset = async () => {
    console.log("Reset in LoadBuilder")
    try {
      if (profileId) {
        await deleteLoadProfile(profileId);
        isUnsaved.current = false;
        setUnsaved(isUnsaved.current);
      }
    } catch (error) {
      console.error("Error deleting load profile:", error);
    }
    setShowReset(false);
    onReset();
  }

  return <>
    <ReactRouterPrompt when={isUnsaved.current}>
      {({ isActive, onConfirm, onCancel }) =>
        isActive && (
          <div>
            <div>
              <p>Do you really want to leave?</p>
              <button type="button" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" onClick={onConfirm}>
                Ok
              </button>
            </div>
          </div>
        )
      }
    </ReactRouterPrompt>
    <div>Load Builder
      <h2>Total: {total}</h2>
      <button onClick={() => setShowReset(true)}>Reset</button>
      <button onClick={saveLoads}>Save</button>
      <table>
        <thead>
          <td>Device Type</td>
          <td>Rating (watts)</td>
          <td>Quantity</td>
          <td>Hours</td>
          <td>Total</td>
          <td>Action</td>
        </thead>
        {loads.map((load, index) => (
          <thead key={index}>
            <td>{electricalIdToName(load.electrical_device_id)}</td>
            <td>{load.rating_watts}</td>
            <td>{load.quantity}</td>
            <td>{load.hours}</td>
            <td>{load.total}</td>
            <td>
              <button onClick={() => removeLoad(load)}>X</button>
            </td>
          </thead>
        ))}
      </table>
      <LoadBuilderForm onAdd={(load) => onAdd(load)} appliances={appliances} />
      {showReset && <LoadBuilderReset onYes={reset} onNo={() => setShowReset(false)} />}
    </div>
  </>
}
=======
*/
import React from 'react'
import Navbar from 'components/Common/Navbar';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
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
                  <Breadcrumb nodeId={houseId.houseId} onEditNode={() => { }} />
                )}
              </div>
              <div className='mt-2 mr-2'>
                <button
                  className="cursor-pointer border bg-[#49AC82] px-[50px] py-[5px] rounded-3xl text-white text-md font-medium border-[#49AC82]"
                  onClick={() => { }}
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
                              <input className='text-center w-10' type="text" value={"00"} />
                              <button>+</button>
                            </div>
                          </li>
                          <li className='hours-column'>
                            <div className='flex justify-center gap-2'>
                              <button>-</button>
                              <input className='text-center w-10' type="text" value={"10"} />
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
// >>>>>>> 5567caa0d577feccf813eefe78faea5ccca3d71f:network-topology/src/components/LoadProfile/LoadBuilder.jsx

export default LoadBuilder;
