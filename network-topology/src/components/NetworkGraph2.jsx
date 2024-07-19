import React, { useEffect, useState } from 'react';
import './NetworkGraph.css';
import { fetchTransformerDetails } from "../services/Tranformer";
import { fetchHouseDetails } from "../services/House";

const Transformer = ({ color, name }) => (
  <div className="transformer-wrapper">
    <img 
      src={`/images/${color}Transformer.png`} 
      alt="Transformer" 
      className="icon transformer"
    />
    <span className="transformer-label">{name}</span>
  </div>
);

const House = ({ color }) => (
  <img 
    src={`/images/${color}House.png`} 
    alt="House" 
    className="icon house"
  />
);

const SubConnectionLine = ({ transformer, params = {} }) => {
  const [subLineStyle, setSubLineStyle] = useState({});
  const [showLine, setShowLine] = useState(false);

  const {
    topOffset = 0,
    startOffset = 0,
    endOffset = 0,
    lineHeight = 4,
    minWidth = 10,
  } = params;

  useEffect(() => {
    const updateSubLineStyle = () => {
      const transformerNode = document.querySelector(
        `[data-transformer-id="${transformer.id}"] > .transformer-node`
      );
      if (transformerNode) {
        const childNodes = transformerNode.querySelectorAll(
          ":scope > .transformer-column, :scope > .houses-column"
        );
        if (childNodes.length > 1) {
          const firstNode = childNodes[0];
          const lastNode = childNodes[childNodes.length - 1];
          const firstRect = firstNode.getBoundingClientRect();
          const lastRect = lastNode.getBoundingClientRect();
          const parentRect = transformerNode.getBoundingClientRect();

          const width = Math.max(
            lastRect.right - firstRect.left,
            minWidth
          );
          const left =
            firstRect.left -
            parentRect.left +
            firstRect.width / 2 +
            startOffset;
          const right =
            lastRect.right -
            parentRect.left -
            lastRect.width / 2 +
            endOffset;

          setSubLineStyle({
            width: `${right - left}px`,
            left: `${left}px`,
            top: `${topOffset}px`,
            height: `${lineHeight}px`,
          });
          setShowLine(true);
        } else {
          setShowLine(false);
        }
      }
    };

    updateSubLineStyle();
    window.addEventListener("resize", updateSubLineStyle);

    const observer = new MutationObserver(updateSubLineStyle);
    const transformerNode = document.querySelector(
      `[data-transformer-id="${transformer.id}"] > .transformer-node`
    );
    if (transformerNode) {
      observer.observe(transformerNode, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      window.removeEventListener("resize", updateSubLineStyle);
      observer.disconnect();
    };
  }, [transformer.id, topOffset, startOffset, endOffset, lineHeight, minWidth]);

  if (!showLine) return null;

  return <div className="sub-connection-line" style={subLineStyle}></div>;
};

const NetworkGraph2 = ({
  data,
  onAddTransformer,
  onAddHouse,
  onDeleteTransformer,
  onAddSubTransformer,
  onDeleteHouse,
  onTransformerEdit,
  onHouseEdit
}) => {
  const [lineStyle, setLineStyle] = useState({});
  const [showLine, setShowLine] = useState(false);
  const [contextMenu, setContextMenu] = useState({visible: false, x: 0, y: 0, node: null});
  
  const lineTopOffset = 40;
  const verticalLineHeight = 10;
  const nodeVerticalLineTop = -20;
  const nodeVerticalLineHeight = 20;

  useEffect(() => {
    console.log("data: ", data);
    const updateLineStyle = () => {
      const transformersRow = document.querySelector(".transformers-row");
      if (transformersRow) {
        const transformers = transformersRow.querySelectorAll(
          ".transformer-column"
        );
        const addButton = transformersRow.querySelector(".add-transformer");

        if (transformers.length > 0 && addButton) {
          const firstRect = transformers[0].getBoundingClientRect();
          const addButtonRect = addButton.getBoundingClientRect();
          const rowRect = transformersRow.getBoundingClientRect();

          const lineStart = firstRect.left - rowRect.left + firstRect.width / 2;
          const lineEnd = addButtonRect.left - rowRect.left + addButtonRect.width / 2;

          setLineStyle({
            width: `${lineEnd - lineStart}px`,
            left: `${lineStart}px`,
            top: `${lineTopOffset}px`,
          });
          setShowLine(true);
        } else {
          setShowLine(false);
        }
      }
    };

    updateLineStyle();
    window.addEventListener("resize", updateLineStyle);
    return () => window.removeEventListener("resize", updateLineStyle);
  }, [data.nodes]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .transformer-header::before,
      .add-transformer::before {
        top: ${nodeVerticalLineTop}px;
        height: ${nodeVerticalLineHeight}px;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const getColor = (isComplete, isNew) => {
    if (isNew) return "Grey";
    return isComplete ? "Green" : "Black";
  };

  const onConfigure = async (d) => {
    if (!d || !d.id) {
      console.error("Node data is undefined or missing id:", d);
      return;
    }

    try {
      if (d.type === "transformer") {
        const transformerDetails = await fetchTransformerDetails(d.id);
        onTransformerEdit(transformerDetails);
      } else if (d.type === "house") {
        const houseDetails = await fetchHouseDetails(d.id);
        onHouseEdit(houseDetails);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleContextMenu = (event, node) => {
    event.preventDefault();
    console.log(node);
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      node,
    });
  };

  const handleClick = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      node: null,
    });
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const renderContextMenu = () => {
    const { x, y, node } = contextMenu;

    if (!node) return null;

    return (
      <div className="context-menu" style={{ top: y-170, left: x-155 }}>
        <button onClick={() => onConfigure(node)}>Configure</button>
        {node.type === 'transformer' && (
          <button onClick={() => onAddSubTransformer(node.id)}>Add T</button>
        )}
        <button className='text-[#F21818]' onClick={() => node.type === 'transformer' ? onDeleteTransformer(node.id) : onDeleteHouse(node.id)}>
          Delete
        </button>
      </div>
    );
  };

  const renderNode = (node, level = 0) => {
    if (node.type === "house") {
      return (
        <div key={node.id} className="house-item"onContextMenu={(e) => handleContextMenu(e, node)} >
          <House color={getColor(node.is_complete, node.new)} />
          <span>{node.nomenclature}</span>
        </div>
      );
    }

    return (
      <div
        key={node.id}
        className="transformer-column"
        data-transformer-id={node.id}
      
      >
        <div className="transformer-header"   onContextMenu={(e) => handleContextMenu(e, node)}>
          <Transformer color={getColor(node.is_complete, node.new)} />
          <span>{node.nomenclature}</span>
        </div>
        <div className="transformer-node">
          <SubConnectionLine transformer={node} />
          <div className="houses-column">
            {node.children && node.children.filter(child => child.type === "house").map(renderNode)}
            <button className="add-house" onClick={() => onAddHouse(node.id)}>+</button>
          </div>
          {node.children && node.children.filter(child => child.type === "transformer").map(child => renderNode(child, level + 1))}
        </div>
      </div>
    );
  };

  return (
    <div className="network-graph">
      {showLine && (
        <div
          className="connection-line"
          style={{
            ...lineStyle,
            "::before": {
              height: `${verticalLineHeight}px`,
              left: "0",
              top: "0",
            },
            "::after": {
              height: `${verticalLineHeight}px`,
              right: "0",
              top: "0",
            },
          }}
        ></div>
      )}
      <div className="transformers-row">
        {data.nodes.map((node) => renderNode(node))}
        <button className="add-transformer" onClick={onAddTransformer}>+</button>
      </div>
      {contextMenu.visible && renderContextMenu()}
    </div>
  );
};

export default NetworkGraph2;
