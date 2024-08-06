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
    <>
      <ul className='bottom-buttons pt-4 pb-6 text-[15px]'>
        <li className='device-type-column'>
          <select className='bg-transparent place-self-center px-16 py-1 text-left ' value={electricalDeviceId} name='profiles' onChange={(e) => setElectricalDeviceId(e.target.value)}>
            <option value='' className="mr-16">Select </option>
            {appliances.map((appliance) => (<option key={appliance.id} value={appliance.id}>{appliance.name}</option>))}
          </select>
        </li>
        <li className='rating-column'>
          <input className='enter-button text-center' value={ratingWatts} type="text"
            onChange={(e) => { const value = e.target.value; setRatingWatts(value); setTotal(value * quantity * hours) }}
          />
        </li>
        <li className='quantity-column'>
          <div className='flex justify-center gap-1'>
            <button className='px-3'>-</button>
            <input className='text-center w-12' value={quantity} type="text" placeholder="00"
              onChange={(e) => { const value = e.target.value; setQuantity(value); setTotal(ratingWatts * value * hours) }}
            />
            <button className='px-3'>+</button>
          </div>
        </li>
        <li className='hours-column'>
          <div className='flex justify-center gap-1'>
            <button className='px-3'>-</button>
            <input className='text-center w-12' type="number"
              onChange={(e) => { const value = e.target.value; setHours(value); setTotal(ratingWatts * quantity * value) }}
              value={hours}
              min={0} max={24} />
            <button className='px-3'>+</button>
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
      {error && <div>{error}</div>}
    </>)
};

export default LoadBuilderForm;
