import { useState } from "react";


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

export default LoadBuilderForm;
