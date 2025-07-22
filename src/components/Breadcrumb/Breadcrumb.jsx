import React, { useState, useEffect } from "react";
import { fetchBreadcrumbNavigationPath } from "services/Breadcrumb";
import "./Breadcrumb.css";

const Breadcrumb = ({ nodeId, onEditNode, size = "normal" }) => {
  const [breadcrumb, setBreadcrumb] = useState(null);

  // First three gradients, fourth solid gray
  const staticBackgrounds = [
    "linear-gradient(135.13deg, #F6FFFF 0%, #E7FAFF 100%)",
    "linear-gradient(135.13deg, #E7FAFF 0%, #D1E5EB 100%)",
    "linear-gradient(135.13deg, #D1E5EB 0%, #B0CBCD 100%)",
    "#CAC7C7",
  ];

  // Lighten helper
  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16),
      amt = Math.round(2.55 * percent * 0.4),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  };

  // Pick backgrounds 0–3, then lighten beyond
  const generateBackground = (idx) => {
    if (idx < staticBackgrounds.length) {
      return staticBackgrounds[idx];
    }
    const extra = idx - (staticBackgrounds.length - 1);
    return lightenColor(staticBackgrounds[3], extra * 10);
  };

  useEffect(() => {
    if (!nodeId) return;
    (async () => {
      try {
        const data = await fetchBreadcrumbNavigationPath(nodeId);
        setBreadcrumb(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [nodeId]);

  if (!breadcrumb) return null;

  // Build labels array
  const items = [
    breadcrumb.locality,
    breadcrumb.substation_name,
    ...breadcrumb.path.map((n) =>
      n.name !== n.nomenclature && n.name !== "Unknown"
        ? `${n.name} ${n.nomenclature}`
        : n.nomenclature
    ),
  ];

  const getSizeClass = () => {
    if (size === "small-delete-modal") return "breadcrumb-item-small";
    if (size === "small-transformer-configuration")
      return "breadcrumb-item-small-transformer";
    return "breadcrumb-item";
  };

  return (
    <div className="breadcrumb-wrapper">
      <div className="breadcrumb-container">
        {items.map((label, idx) => (
          <div
            key={idx}
            className={`${getSizeClass()} ${idx > 1 ? "cursor-pointer" : ""}`}
            style={{ "--bg": generateBackground(idx) }}
            onClick={() => idx > 1 && onEditNode(breadcrumb.path[idx - 2])}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumb;
