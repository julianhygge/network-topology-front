import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useNavigate } from 'react-router-dom'
import Navbar from "components/Common/Navbar";
import GridSideBar from "components/Grid/GridSideBar";
import { getSimulationRuns } from 'services/simulationRunsService'
import { useParams } from "react-router-dom";

const SimulationRunsPage = () => {
    const [simulationRuns, setSimulationRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const localityId = "94522a0a-c8f1-40f8-a2e5-9aed2dc55555"; // replace with actual localityId
        const fetchSimulationRuns = async () => {
            try {
                const result = await getSimulationRuns(localityId);
                setSimulationRuns(result);
            } catch (err) {
                console.error('Failed to fetch simulation runs:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSimulationRuns();
    }, []);


    const navigate = useNavigate(); 

    return (
        <div className="flex flex-col h-screen">
        <Navbar />
            <div className="flex flex-1">
                {/* if existing simulation from the get request */}
                <div>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error.message}</p>}
                    {!loading && !error && (
                        <ul>
                            {simulationRuns.map((run, index) => (
                                // make the cards from them 
                                <li key={index}>{JSON.stringify(run)}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SimulationRunsPage;