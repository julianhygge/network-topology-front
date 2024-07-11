import React, {useState, useEffect}  from "react";
import Navbar from "./Navbar";
import { getSubstationById, updateSubstationTransformers} from "../services/Substation";
import AddHousesForm from "./AddHousesForm";

const TransformerPage = () => {
    const [substation, setSubstation] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedTransformer, setSelectedTransformer] = useState(null);
    const [selectedTransformerIndex, setSelectedTransformerIndex] = useState(null);
    const substationId = "3d5265f7-7b08-4bab-9746-925ef1bb6ab0";

    useEffect(() => {
        fetchSubstationsById();
    },[])

    const fetchSubstationsById = async() => {
        try {
            const data = await getSubstationById(substationId);
            setSubstation(data);
        } catch (error) {
            console.error('Failed to fetch substations:', error);
            setError('Failed to fetch substation. Please try again later.');
        }
    }

    const handleAddTransformer = async() => {
      try {
          const payload = {
            "nodes": [
              {
                "action": "add",
                "type": "transformer"
              }
            ]
          }
          const updatedSubstation = await updateSubstationTransformers(substationId, payload)
          setSubstation(updatedSubstation);
      }catch (error) {
          console.error('Failed to add transformer:', error);
          setError('Failed to add transformer. Please try again later.');
        }
    }

    const handleShowHouseAddForm = (transformerId, transformerIndex) => {
      setSelectedTransformer(transformerId);
      setSelectedTransformerIndex(transformerIndex);
      setShowForm(true);
    }

    const handleCloseHouseAddForm = () => {
      setSelectedTransformer(null);
      setSelectedTransformerIndex(null);
      setShowForm(false);
    };

    const handleSubmitAddHouseForm = async(numberOfHouses) => {
      try {
        const houses = Array.from({ length: numberOfHouses }, () => ({
          type: "house",
          action: "add"
        }));

        const payload = {
          "nodes": [
              {
                  "id": selectedTransformer,
                  "type": "transformer",
                  "action": "update",
                  "children": houses
              }
          ]
        }
        const updatedSubstation = await updateSubstationTransformers(substationId, payload)
        setSubstation(updatedSubstation);
      } catch (error) {
        console.error('Failed to add houses:', error);
        setError('Failed to add houses. Please try again later.');
      }
    };

    return (
        <div className="bg-backPage min-h-screen">
          <Navbar />
          {error && <div className="text-red-600 text-xl flex justify-center mt-2">{error}</div>}
          <div className="p-4 text-2xl text-gray-600 text-left ml-16">
            <button>Back</button>
          </div>
          <div className="text-2xl text-left ml-24 text-gray-600 mb-8">
            Grid - 1
          </div>
          {substation ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4 mt-4 ml-4 items-center">
              {substation.nodes && substation.nodes
                .filter(node => node.type === "transformer")
                .map((node, index) => (
                  <div key={node.id} className="flex flex-col items-center">
                    <div className="text-2xl mb-2 text-gray-600">Transformer - {index + 1}</div>
                    <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-4 w-60 h-80 border border-black">
                      <div className="w-16 h-16 mb-4 mt-4">
                        <img src="/images/Star.png" alt="Star" className="w-full h-full" />
                      </div>
                      <button className="mb-2 w-full py-2 bg-customYellow text-gray-800 rounded-2xl shadow mt-4">
                        Add Properties
                      </button>
                      <button onClick={() => handleShowHouseAddForm(node.id, index + 1)} className="w-full py-2 bg-customGreen text-white rounded-2xl shadow flex items-center justify-center mt-4">
                        Add Houses <span className="ml-2 text-3xl mb-1">+</span>
                      </button>
                    </div>
                  </div>
                ))}
              <button onClick={handleAddTransformer} className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-4 w-24 h-24 border border-black">
                <div className="text-4xl">+</div>
                <div className="text-base text-black-400">Add</div>
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center text-gray-600 text-xl mt-8">
              Loading...
            </div>
          )}
          <AddHousesForm
            show={showForm}
            onClose={handleCloseHouseAddForm}
            onSubmit={handleSubmitAddHouseForm}
            transformerName={selectedTransformerIndex}
          />
        </div>
      );
    };
    
    export default TransformerPage;