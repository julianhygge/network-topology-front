import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchLoadProfileItems, saveLoadProfileItems } from '../services/LoadProfile';
import { fetchAppliances } from '../services/Appliance';

const LoadBuilderForm = ({ onAdd, appliances }) => {
  const [error, setError] = useState('');
  const [electricalDeviceId, setElectricalDeviceId] = useState("");
  const [ratingWatts, setRatingWatts] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [hours, setHours] = useState(0);
  const [total, setTotal] = useState(0);

  const handleAdd = () => {
    if (!electricalDeviceId) {
      setError("Please select a profile");
      return;
    }
    if (!ratingWatts) {
      setError("Please enter a rating in watts");
      return;
    }
    if (!quantity) {
      setError("Please enter a quantity");
      return;
    }
    if (!hours) {
      setError("Please enter hours");
      return;
    }
    onAdd({ electricalDeviceId, ratingWatts, quantity, hours, addedTotal: total });
    setElectricalDeviceId("");
    setRatingWatts(0);
    setQuantity(0);
    setHours(0);
    setTotal(0);
  };

  return (
    <div className=''>
      <div className='border-2'>
        <select value={electricalDeviceId} name='profiles' onChange={(e) => setElectricalDeviceId(e.target.value)}>
          <option value=''>Select a profile</option>
          {appliances.map((appliance) => (<option key={appliance.id} value={appliance.id}>{appliance.name}</option>))}
        </select>
      </div>
      <div className='border-2'>
        <input
          type="number"
          value={ratingWatts}
          onChange={(e) => { const value = e.target.value; setRatingWatts(value); setTotal(value * quantity * hours) }}
          min={0}
        />
      </div>
      <div className='border-2'>
        <input
          type="number"
          value={quantity}
          onChange={(e) => { const value = e.target.value; setQuantity(value); setTotal(ratingWatts * value * hours) }}
          min={0}
        />
      </div>
      <div className='border-2'>
        <input
          type="number"
          value={hours}
          onChange={(e) => { const value = e.target.value; setHours(value); setTotal(ratingWatts * quantity * value) }}
          min={0}
        />
      </div>
      <div>{total}</div>
      <button onClick={handleAdd}>Add</button>
      {error && <div>{error}</div>}
    </div>)
};

const LoadBuilder = ({ onReset }) => {
  const [loads, setLoads] = useState([]);
  const [searchParams] = useSearchParams()
  const [total, setTotal] = useState(0);
  const [appliances, setAppliances] = useState([])

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

        items.push({
          id: 1,
          electrical_device_id: 2,
          rating_watts: 100,
          quantity: 3,
          hours: 2,
          total: 100
        })
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
  }

  const onAdd = ({ electricalDeviceId, ratingWatts, quantity, hours, addedTotal }) => {
    setTotal(addedTotal + total);
    setLoads([...loads, { electrical_device_id: parseInt(electricalDeviceId), rating_watts: ratingWatts, quantity, hours, total: addedTotal }]);
  };

  const removeLoad = (loadToRemove) => {
    const load = loads.find((load) => load === loadToRemove);
    if (!load) return;
    setTotal(total - load.total);
    setLoads(loads.filter((load) => load !== loadToRemove));
  }

  const saveLoads = () => {
    console.log("Items to save: ", loads);
    const saveLoads = async () => {
      try {
        const newLoads = await saveLoadProfileItems(searchParams.get("house_id"), loads);
        const items = newLoads.items;
        console.log("Items from save response: ", items)
        calculateTotalAndSetLoads(items);
      } catch (error) {
        console.error("Error saving load profile items:", error);
      }
    }
    saveLoads()
  }

  const electricalIdToName = (profileId) => {
    return appliances.find((appliance) => appliance.id === profileId)?.name;
  }

  return <div>Load Builder
    <h2>Total: {total}</h2>
    <button>Reset</button>
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
  </div>
}

export default LoadBuilder;
