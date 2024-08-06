import { useState } from "react";
import './LoadBuilderForm.css';
import './LoadBuilder.css';

const LoadBuilderForm = ({ onAdd, appliances }) => {
  const [error, setError] = useState('');
  const [electricalDeviceId, setElectricalDeviceId] = useState("");
  const [ratingWatts, setRatingWatts] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [hours, setHours] = useState(0);
  const [total, setTotal] = useState(0);

  const handleAdd = () => {
    if (!electricalDeviceId) {
      setError("Please select a device profile");
      return;
    }
    const ratingWattsToSubmit = parseInt(ratingWatts, 10);
    if (!ratingWattsToSubmit || ratingWattsToSubmit <= 0) {
      setError("Please enter a valid rating in watts");
      return;
    }
    const quantityToSubmit = parseInt(quantity, 10);
    if (!quantityToSubmit || quantityToSubmit <= 0) {
      setError("Please enter a valid quantity");
      return;
    }
    const hoursToSubmit = parseInt(hours, 10);
    if (!hoursToSubmit || hoursToSubmit <= 0 || hoursToSubmit > 24) {
      setError("Please enter a valid number of hours");
      return;
    }
    onAdd({ electricalDeviceId, ratingWatts, quantity, hours, addedTotal: total });
    setError('');
    setElectricalDeviceId("");
    setRatingWatts(0);
    setQuantity(0);
    setHours(0);
    setTotal(0);
  };

  const decrement = (setter) => {
    setter((prev) => {
      if (prev <= 0) return prev;
      return parseInt(prev, 10) - 1
    });
  }

  const increment = (setter, max = NaN) => {
    setter((prev) => {
      if (!isNaN(max) && prev >= max) return prev;
      return parseInt(prev, 10) + 1
    });
  }

  return (
    <>
      <ul className='bottom-buttons pt-4 pb-6 text-[15px] bg-[#F9FEFF]'>
        <li className='device-type-column'>
          <select className='bg-transparent place-self-center px-16 py-1 text-left ' value={electricalDeviceId} name='profiles' onChange={(e) => setElectricalDeviceId(e.target.value)}>
            <option value='' className="mr-16">Select </option>
            {appliances.map((appliance) => (<option key={appliance.id} value={appliance.id}>{appliance.name}</option>))}
          </select>
        </li>
        <li className='rating-column'>
          <input className='enter-button text-center' value={ratingWatts} type="number"
            onChange={(e) => { const value = e.target.value; setRatingWatts(value); setTotal(value * quantity * hours) }}
          />
        </li>
        <li className='quantity-column'>
          <div className='flex justify-center gap-1'>
            <button onClick={() => decrement(setQuantity)} className='px-3'>-</button>
            <input className='text-center w-12' value={quantity} type="number" placeholder="00"
              onChange={(e) => { const value = e.target.value; setQuantity(value); setTotal(ratingWatts * value * hours) }}
            />
            <button onClick={() => increment(setQuantity)} className='px-3'>+</button>
          </div>
        </li>
        <li className='hours-column'>
          <div className='flex justify-center gap-1'>
            <button onClick={() => decrement(setHours)} className='px-3'>-</button>
            <input className='text-center w-12' type="number"
              onChange={(e) => { const value = e.target.value; setHours(value); setTotal(ratingWatts * quantity * value) }}
              value={hours}
            />
            <button onClick={() => increment(setHours, 24)} className='px-3'>+</button>
          </div>
        </li>
        <li className='total-column pt-[3px] pb-[3px]'>{total}</li>
        <li className='action-column'>
          <button onClick={handleAdd} className="add-button px-8">
            <div className='add-text'>
              +
            </div>
          </button>
        </li>
      </ul>
      {error && <div className="text-red-600 text-lg">{error}</div>}
    </>)
};

export default LoadBuilderForm;
