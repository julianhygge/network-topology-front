import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import "./LoadBuilder.css"
import React, { useEffect, useState, useRef } from 'react';
import { deleteLoadProfile, fetchLoadProfileItems, saveLoadProfileItems } from 'services/LoadProfile';
import { fetchAppliances } from 'services/Appliance';
import LoadBuilderForm from './LoadBuilderForm';
import LoadProfileDeleteModal from './LoadProfileDeleteModal';
import ReactRouterPrompt from "react-router-prompt";
import LoadProfileQuitModal from './LoadProfileQuitModal';

const LoadBuilder = () => {
  const [loads, setLoads] = useState([]);
  const { houseId } = useParams();
  const [total, setTotal] = useState(0);
  const [appliances, setAppliances] = useState([])
  const [showReset, setShowReset] = useState(false);
  const isUnsaved = useRef(false);
  const [profileId, setProfileId] = useState(null);
  const navigate = useNavigate();

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
        const data = await fetchLoadProfileItems(houseId);
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
  }

  const onAdd = ({ electricalDeviceId, ratingWatts, quantity, hours, addedTotal }) => {
    setTotal(addedTotal + total);
    setLoads([...loads, { electrical_device_id: parseInt(electricalDeviceId), rating_watts: ratingWatts, quantity, hours, total: addedTotal, isNew: true }]);
    isUnsaved.current = true;
  };

  const removeLoad = (loadToRemove) => {
    const load = loads.find((load) => load === loadToRemove);
    if (!load) return;
    setTotal(total - load.total);
    setLoads(loads.filter((load) => load !== loadToRemove));
    isUnsaved.current = !loadToRemove.isNew;
    console.log("Load to remove: ", loadToRemove)
  }

  const saveLoads = () => {
    console.log("Items to save: ", loads);
    const save = async () => {
      try {
        const newLoads = await saveLoadProfileItems(houseId, loads);
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
      }
    } catch (error) {
      console.error("Error deleting load profile:", error);
    }
    setShowReset(false);
    navigate(`/config/${houseId}`);
  }

  return (
    <>
      <div className="flex flex-col box-border max-w-[1920px] h-[100vh] font-dinPro">
        <div className='flex h-full w-full box-border'>
          <div className='flex flex-col flex-1'>
            <div className='absolute top-0 right-0 mt-24 mr-2'>
              <button
                className="cursor-pointer border bg-[#49AC82] px-[50px] py-[5px] rounded-3xl text-white text-md font-medium border-[#49AC82]"
                onClick={saveLoads}
              >
                SAVE
              </button>
            </div>
            <div className='container px-6 mx-auto'>
              <div className='nav pt-4'>
                <ul className='pt-1 pb-3'>
                  <li className='heading font-light'>
                    Please continue to do the configuration from Load Builder below.
                  </li>
                  <li className='watts font-normal'>
                    Total = {total} Watts
                  </li>
                  <li className='reset-profile mr-1 cursor-pointer py-1' onClick={() => setShowReset(true)}>
                    Reset Profile
                  </li>
                </ul>
              </div>
              <div className="table-container">
                <div className="device-table text-[15px]">
                  <ul className=''>
                    <li className='device-type-column font-medium bg-loadBuilderNavColor py-3'>
                      Device Type
                    </li>
                    <li className='rating-column font-medium bg-loadBuilderNavColor py-3'>
                      Rating (watts)
                    </li>
                    <li className='quantity-column font-medium bg-loadBuilderNavColor py-3'>
                      Quantity
                    </li>
                    <li className='hours-column font-medium bg-loadBuilderNavColor py-3'>
                      Hours
                    </li>
                    <li className='total-column font-medium bg-loadBuilderNavColor py-3'>
                      Total (w)
                    </li>
                    <li className='action-column font-medium bg-loadBuilderNavColor py-3'>
                      Action
                    </li>
                  </ul>
                  {loads.map((item, index) => (
                    <React.Fragment key={index}>
                      <ul className='py-4 border-b border-gray-300 bg-[#F9FEFF]'>
                        <li className='device-type-column'>{electricalIdToName(item.electrical_device_id)}</li>
                        <li className='rating-column'>{item.rating_watts}</li>
                        <li className='quantity-column'>{item.quantity}</li>
                        <li className='hours-column'>{item.hours}</li>
                        <li className='total-column'>{item.total}</li>
                        <li className='action-column'>
                          <button className="delete-button" onClick={() => removeLoad(item)}>X</button>
                        </li>
                      </ul>
                    </React.Fragment>))}
                  <LoadBuilderForm onAdd={(load) => onAdd(load)} appliances={appliances} />
                  {showReset && <LoadProfileDeleteModal onConfirm={reset} onCancel={() => setShowReset(false)} />}
                  <ReactRouterPrompt when={isUnsaved.current}>
                    {({ isActive, onConfirm, onCancel }) =>
                      isActive && <LoadProfileQuitModal onConfirm={onConfirm} onCancel={onCancel} />
                    }
                  </ReactRouterPrompt>
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
