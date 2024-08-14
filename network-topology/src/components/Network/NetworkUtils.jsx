import { useState, useEffect } from "react";

export const NODE_STATUS = {
  COMPLETE: "complete",
  EMPTY: "empty",
  IN_PROGRESS: "in_progress",
}

// Transformer component displays a transformer icon and name
export const Transformer = ({ color, name, onTransformerClick }) => (
  <div
    className="transformer-wrapper cursor-pointer"
    onClick={onTransformerClick}
  >
    <img
      src={`/images/${color}Transformer.png`}
      alt="Transformer"
      className={`icon transformer ${color === "Green" ? "green-transformer-icon" : ""
        }`}
    />
    <span className="transformer-label">{name}</span>
  </div>
);
// House component displays a house icon
export const House = ({ color, onHouseClick, nomenclature }) => (
  <div onClick={onHouseClick} className="house-item">
    <div className="cursor-pointer" >
      <img src={`/images/${color}House.png`} alt="House" className="icon house" />
    </div>
    <span className="font-dinPro font-medium house-name text-navColor">
      {nomenclature}
    </span>
  </div>
);

// SubConnectionLine is a component for rendering a connection line between transformers and houses
export const SubConnectionLine = ({ transformer, params = {} }) => {
  const [subLineStyle, setSubLineStyle] = useState({});
  const [showLine, setShowLine] = useState(false);

  const {
    topOffset = 0,
    startOffset = 0,
    endOffset = 0,
    lineHeight = 4,
    minWidth = 10,
  } = params;

  // Effect to calculate the position and size of the sub-connection line
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

          const width = Math.max(lastRect.right - firstRect.left, minWidth);
          const left =
            firstRect.left -
            parentRect.left +
            firstRect.width / 2 +
            startOffset;
          const right =
            lastRect.right - parentRect.left - lastRect.width / 2 + endOffset;

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

// Function to determine node color based on completion and new status
export const getColor = (status, isNew) => {
  if (isNew) return "Grey";
  if (status === NODE_STATUS.COMPLETE) return "Green";
  if (status === NODE_STATUS.IN_PROGRESS) return "Orange";
  return "Black";
};

