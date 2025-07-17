import Navbar from "components/Common/Navbar";
import { useEffect, useState } from "react";
import { GetHouseBill } from "services/House";

export default function HouseBill(){
    const [houseBillData, setHouseBillData] = useState("")
    const house_id = 'd85a241a-d468-4278-b147-c01be1d756bd'

    const billingMonth = houseBillData?.bill_details?.billing_cycle_month;
    const billingYear = houseBillData?.bill_details?.billing_cycle_year;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedPeriod = billingMonth && billingYear
  ? `${monthNames[billingMonth - 1]} ${billingYear}`
  : "";

    const fetchHouseBill = async(house_id)=> {
        try{
            const res = await GetHouseBill(house_id);
            console.log("House Bill", res);
            setHouseBillData(res)

            
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
       
        fetchHouseBill(house_id)
    },[house_id])
    return (
        <div className="bg-[#E7FAFF] h-screen">
            <Navbar />

    <div className="bg-white rounded-2xl border shadow-sm h-[80vh] p-6 mt-10 mr-40 ml-40">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 flex items-center justify-center">
            <img
          loading="lazy"
          src={`${process.env.PUBLIC_URL}/images/HyggeLogo.png`} 
          alt="Hygge Logo"
          className="shrink-0 w-[50px] cursor-pointer"
        />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Utility Bill</h1>
        </div>

        <div className="flex item-center">
          <p className=" text-gray-800 mr-2">Bill ID</p>
          <p className=" text-gray-800">{houseBillData.id}</p>
        </div>
      </div>


      {/* Two Sidebars Layout */}
      <div className="flex gap-6">
        {/* Sidebar 1 - Account Information & Energy Usage */}
        <div className="flex-1 bg-gray-100 rounded-xl p-6 border border-gray-100">
          {/* Account Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Account Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-600 ">Customer Name</span>
                <span className="font-medium text-gray-800">{houseBillData?.bill_details?.house_name} </span>
              </div>
              <div className="flex justify-between items-center  border-b border-gray-200">
                <span className="text-sm text-gray-600">Address</span>
                <span className="font-medium text-gray-800">Krishna Apartment</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-600">Customer ID</span>
                <span className="font-medium text-gray-800">1234455</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-600">Billing Period</span>
                <span className="font-medium text-gray-800">{formattedPeriod}</span>
              </div>
            </div>
          </div>

          {/* Energy Usage Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Energy Usage
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-600">Meter Number</span>
                <span className="font-medium text-gray-800">MTR</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-600">Total Imported Energy</span>
                <span className="font-medium text-gray-800">{houseBillData.total_energy_imported_kwh}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-600">Total Exported Energy</span>
                <span className="font-medium text-gray-800">{houseBillData.total_energy_exported_kwh}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-600">Net Energy Consumed</span>
                <span className="font-medium ">{houseBillData.net_energy_balance_kwh}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar 2 - Bill Summary & Amount Due */}
        <div className="flex-1 bg-gray-100 rounded-xl p-6 border border-gray-100">
          {/* Bill Summary Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Total Bill Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-600">Retail Charges</span>
                <span className="font-medium text-gray-800">{houseBillData?.bill_details?.imported_energy_charges}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-600">Wholesale Charges</span>
                <span className="font-medium text-gray-800">{houseBillData?.bill_details?.exported_energy_credit}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-600">Fixed Charge</span>
                <span className="font-medium text-gray-800">{houseBillData?.bill_details?.fixed_charges}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-600">State Tax</span>
                <span className="font-medium text-gray-800">112.50</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-600">Center Tax</span>
                <span className="font-medium text-gray-800">112.50</span>
              </div>
            </div>
          </div>

          {/* Amount Due Section */}
          <div className="rounded-lg p-4 flex items-center justify-between">
            <div>
                <h2 className="text-lg font-semibold">
                    Total Amount Due
            </h2>
             <p className="text-sm ">Due by June</p>
            </div>
            
           
            <div>
                <p className="text-2xl font-bold">{houseBillData.calculated_bill_amount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
        </div>
    )
}