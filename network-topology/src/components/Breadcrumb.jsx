import React, { useState, useEffect } from 'react';
import { fetchBreadcrumbNavigationPath } from '../services/Breadcrumb';
import './Breadcrumb.css';

const Breadcrumb = ({ nodeId, onEditNode, size = 'normal' }) => {
    const [breadcrumb, setBreadcrumb] = useState(null);
    const staticBackgroundClasses = ['#98BEC9', '#A5CFDB', '#BCDCE5', '#CDEEF7'];

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

    const lightenColor = (color, percent) => {
        const num = parseInt(color.replace("#", ""), 16),
            amt = Math.round(2.55 * percent * 0.4),
            R = (num >> 16) + amt,
            G = ((num >> 8) & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1).toUpperCase()}`;
    };

    const getSizeClass = () => {
        return size === 'small' ? 'breadcrumb-item-small' : 'breadcrumb-item';
    };

    const generateDynamicBackgroundClasses = (index) => {
        if (index < staticBackgroundClasses.length) {
            return staticBackgroundClasses[index];
        }
        const baseColor = staticBackgroundClasses[staticBackgroundClasses.length - 1];
        const lightenPercent = (index - staticBackgroundClasses.length + 1) * 10;
        return lightenColor(baseColor, lightenPercent);
    };

    return (
        <div className='breadcrumb-wrapper'>
            <div className={`breadcrumb-container flex items-center mb-4`}>
                {breadcrumb && (
                    <React.Fragment>
                        <div className={`${getSizeClass()}`} style={{ backgroundColor: generateDynamicBackgroundClasses(0) }}>
                            {breadcrumb.locality}
                        </div>
                        <div className="breadcrumb-triangle" style={{ borderLeftColor: generateDynamicBackgroundClasses(0) }}></div>
                        <div className={`${getSizeClass()}`} style={{ backgroundColor: generateDynamicBackgroundClasses(1), marginLeft: "-22px" }}>
                            {breadcrumb.substation_name}
                        </div>
                        <div className="breadcrumb-triangle" style={{ borderLeftColor: generateDynamicBackgroundClasses(1) }}></div>
                        {breadcrumb.path.map((node, index) => (
                            <React.Fragment key={node.id}>
                                <div className={`${getSizeClass()} cursor-pointer`}
                                    style={{ backgroundColor: generateDynamicBackgroundClasses(index + 2), marginLeft: "-22px" }}
                                    onClick={() => onEditNode(node)}
                                >
                                    {node.name !== node.nomenclature && node.name !== "Unknown" ? `${node.name} ${node.nomenclature}` : node.nomenclature}
                                </div>
                                <div className="breadcrumb-triangle" style={{ borderLeftColor: generateDynamicBackgroundClasses(index + 2) }}></div>
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default Breadcrumb;
