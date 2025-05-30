import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useNavigate } from 'react-router-dom'
import Navbar from "components/Common/Navbar";
import GridSideBar from "components/Grid/GridSideBar";
import { generateGrossMeteringPolicyBill } from 'services/netMeteringService'
import { useParams } from "react-router-dom";

const TimeOfUseMeteringBillPage = () => {
    const {simulationRunId} = useParams();
    const navigate = useNavigate()
    const [retailPrice, setRetailPrice] = useState(0);
    const [wholesalePrice, setWholesalePrice] = useState(0);
    const [fixedPrice, setFixedPrice] = useState(0);
    const [loading,setLoading]=useState(false);

    const handleGenerateBill = async () => {
        setLoading(true);
        try {
            console.log(simulationRunId)
        const res=await generateGrossMeteringPolicyBill({
            simulationRunId,
            retailPrice: +retailPrice,
            wholesalePrice: +wholesalePrice, 
            fixedChargeRate: +fixedPrice
        })
        // after successful POST, maybe navigate to a summary or show toast
        console.log(res)
        navigate(`/config-summary/${simulationRunId}`)
        } catch (e) {
        console.error(e)
        }
        finally{
            setLoading(false);
        }
    }
        if (loading) {
            return (
                <div className="flex flex-col h-screen">
                <Navbar />
                <div className="flex flex-1 items-center justify-center bg-[#E7FAFF]">
                    <span className="text-navColor">Generating Bill</span>
                </div>
                </div>
            )
            }

    return (
        <div className="flex flex-col h-screen">
        <Navbar />
            <div className="flex flex-1">
                {/* <GridSideBar /> */}
                <div className="flex flex-1 flex-col items-center justify-center bg-[#E7FAFF]">
                    {<div className="text-center text-2xl font-medium mb-6 text-navColor max-w-6xl">
                    You have selected Time of Use Metering Policy, according to this policy billing of imported energy 
                    will be as per the time distributed section of usages.
                    </div>}

                    <div className="w-full max-w-3xl py-14  px-28 bg-white border-2 border-[#BF6A02] rounded-2xl shadow-lg mx-4">
                        {/* todo: TOU Metering Grid */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TimeOfUseMeteringBillPage;