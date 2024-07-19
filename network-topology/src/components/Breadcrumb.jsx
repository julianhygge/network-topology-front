import React, { useState, useEffect } from 'react';
import { fetchBreadcrumbNavigationPath } from '../services/Breadcrumb';
import './Breadcrumb.css';

const Breadcrumb = ({ nodeId }) => {
    const [breadcrumb, setBreadcrumb] = useState(null);
    const backgroundClasses = ['#98BEC9', '#A5CFDB', '#BCDCE5', '#CDEEF7'];

    useEffect(() => {
        if (nodeId) {
            fetchBreadcrumbNavigationPathByNodeId(nodeId);
        }
    }, [nodeId]);

    const fetchBreadcrumbNavigationPathByNodeId = async (nodeId) => {
        try {
            const data = await fetchBreadcrumbNavigationPath(nodeId);
            console.log(data);
            setBreadcrumb(data);
        } catch (error) {
            console.error('Failed to fetch breadcrumbs:', error);
        }
    };

    return (
        <div className="breadcrumb-container flex items-center mb-4">
            {breadcrumb && (
                <React.Fragment>
                    <div className={`breadcrumb-item`} style={{ backgroundColor: backgroundClasses[0] }}>
                        {breadcrumb.locality}
                    </div>
                    <div className="breadcrumb-triangle" style={{ borderLeftColor: backgroundClasses[0] }}></div>
                    <div className={`breadcrumb-item`} style={{ backgroundColor: backgroundClasses[1], marginLeft: "-22px" }}>
                        {breadcrumb.substation_name}
                    </div>
                    <div className="breadcrumb-triangle" style={{ borderLeftColor: backgroundClasses[1] }}></div>
                    {breadcrumb.path.map((node, index) => (
                        <React.Fragment key={node.id}>
                            <div className={`breadcrumb-item`} style={{ backgroundColor: backgroundClasses[index + 2], marginLeft: "-22px"}}>
                                {node.name !== node.nomenclature && node.name !== "Unknown" ? `${node.name} ${node.nomenclature}` : node.nomenclature}
                            </div>
                            <div className="breadcrumb-triangle" style={{ borderLeftColor: backgroundClasses[index + 2] }}></div>
                        </React.Fragment>
                    ))}
                </React.Fragment>
            )}
        </div>
    );
};

export default Breadcrumb;
