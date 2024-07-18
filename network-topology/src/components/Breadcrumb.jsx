import React from 'react';
import './Breadcrumb.css';
import { color } from 'd3';

const Breadcrumb = () => {
  const path = [
    { id: '1', name: 'Shanti Niketan-1', bgColor: 'bg-item1', color: '#98BEC9'},
    { id: '2', name: 'Shanti Niketan-1', bgColor: 'bg-item2', color: '#A5CFDB' },
    { id: '3', name: 'Shanti Niketan-1', bgColor: 'bg-item3', color: '#BCDCE5' }
  ];

  return (
    <div className="breadcrumb-container flex items-center mb-4">
      {path.map((item, index) => (
        <div key={item.id} className="breadcrumb-item flex items-center">
            <div className={`${item.bgColor} text-sm px-6 py-3 flex items-center`}>
            {item.name}
            </div>
            <div className="breadcrumb-triangle" style={{ borderLeftColor: path[index].color }}></div>
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
