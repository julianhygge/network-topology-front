import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { deleteLoadProfile, fetchLoadProfileItems, saveLoadProfileItems } from '../services/LoadProfile';
import { fetchAppliances } from '../services/Appliance';
import LoadBuilderForm from './LoadBuilderForm';
import LoadBuilderReset from './LoadBuilderReset';
import ReactRouterPrompt from "react-router-prompt";

const LoadBuilder = ({ onReset }) => {
  const [loads, setLoads] = useState([]);
  const [searchParams] = useSearchParams()
  const [total, setTotal] = useState(0);
  const [appliances, setAppliances] = useState([])
  const [showReset, setShowReset] = useState(false);
  const isUnsaved = useRef(false);

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
      return acc + total;
    }, 0)
    setLoads(items);
    setTotal(sum)
    isUnsaved.current = false;
  }

  const onAdd = ({ electricalDeviceId, ratingWatts, quantity, hours, addedTotal }) => {
    setTotal(addedTotal + total);
    setLoads([...loads, { electrical_device_id: parseInt(electricalDeviceId), rating_watts: ratingWatts, quantity, hours, total: addedTotal }]);
    isUnsaved.current = true;
  };

  const removeLoad = (loadToRemove) => {
    const load = loads.find((load) => load === loadToRemove);
    if (!load) return;
    setTotal(total - load.total);
    setLoads(loads.filter((load) => load !== loadToRemove));
    isUnsaved.current = true;
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
    try {
      const profileId = loads.find((load) => load.profile_id)?.profile_id;
      if (profileId) {
        await deleteLoadProfile(profileId);
        isUnsaved.current = false;
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
        <tr>
          <td>Device Type</td>
          <td>Rating (watts)</td>
          <td>Quantity</td>
          <td>Hours</td>
          <td>Total</td>
          <td>Action</td>
        </tr>
        {loads.map((load) => (
          <tr key={load.id}>
            <td>{electricalIdToName(load.electrical_device_id)}</td>
            <td>{load.rating_watts}</td>
            <td>{load.quantity}</td>
            <td>{load.hours}</td>
            <td>{load.total}</td>
            <td>
              <button onClick={() => removeLoad(load)}>X</button>
            </td>
          </tr>
        ))}
      </table>
      <LoadBuilderForm onAdd={(load) => onAdd(load)} appliances={appliances} />
      {showReset && <LoadBuilderReset onYes={reset} onNo={() => setShowReset(false)} />}
    </div>
  </>
}

export default LoadBuilder;
