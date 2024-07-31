import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchLoadProfileItems } from '../services/LoadProfile';
import { fetchAppliances } from '../services/Appliance';

const LoadBuilder = ({ onReset }) => {
  const [loads, setLoads] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams()
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
        console.log(data)

        items.push({
          profile_id: "Fridge",
          rating_watts: 100,
          quantity: 3,
          hours: 2,
          total: 100
        })
        const total = items.reduce((acc, item) => {
          const total = item.quantity * item.rating_watts * item.hours;
          item.total = total;
          return acc + total;
        }, 0)
        setLoads(items);
        setTotal(total)
      } catch (error) {
        console.error("Error fetching load profile items:", error);
      }
    };
    fetchApplianceItems();
    fetchItems();
  }, []);

  return <div>Load Builde
    <h2>Total: {total}</h2>
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
          <td>{load.profile_id}</td>
          <td>{load.rating_watts}</td>
          <td>{load.quantity}</td>
          <td>{load.hours}</td>
          <td>{load.total}</td>
          <td>
            <button>X</button>
          </td>
        </tr>
      ))}
    </table>

  </div>
}

export default LoadBuilder;
