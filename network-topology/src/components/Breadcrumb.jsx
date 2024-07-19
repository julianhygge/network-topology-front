import React, {useState, useEffect} from 'react';
import { fetchBreadcrumbNavigationPath } from '../services/Breadcrumb';
import './Breadcrumb.css';

const Breadcrumb = ({nodeId}) => {
    const [breadcrumb, setBreadcrumb] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(nodeId){
            fetchBreadcrumbNavigationPathByNodeId(nodeId);
        }
    }, [nodeId])

    const fetchBreadcrumbNavigationPathByNodeId = async(nodeId) =>{
        try {
            const data = await fetchBreadcrumbNavigationPath(nodeId);
            console.log(data);
            setBreadcrumb(data);
        } catch (error) {
            console.error('Failed to fetch breadcrumbs:', error);
            setError('Failed to fetch breadcrumbs. Please try again later.');
        }
    }

    // const path = [
    //     { id: '1', name: 'Shanti Niketan-1', bgColor: 'bg-item1', color: '#98BEC9'},
    //     { id: '2', name: 'Shanti Niketan-1', bgColor: 'bg-item2', color: '#A5CFDB' },
    //     { id: '3', name: 'Shanti Niketan-1', bgColor: 'bg-item3', color: '#BCDCE5' }
    // ];

  return (
    <div className="breadcrumb-container flex items-center mb-4">
        {breadcrumb && (<div>
            {breadcrumb.locality}
        </div>)}
        <div>
            &gt;
        </div>
        {breadcrumb && (<div>
            {breadcrumb.substation_name}
        </div>)}
        <div>
            &gt;
        </div>
        {breadcrumb && (<div>
            {breadcrumb.path.name}
        </div>)}
      {/* {breadcrumb.map((item, index) => (
        <div key={item.id} className="breadcrumb-item flex items-center">
            <div className={`${item.bgColor} text-sm px-6 py-3 flex items-center`}>
            {item.name}
            </div>
            <div className="breadcrumb-triangle" style={{ borderLeftColor: path[index].color }}></div>
        </div>
      ))} */}
    </div>
  );
};

export default Breadcrumb;
