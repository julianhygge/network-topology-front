import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { fetchTransformerDetails } from "../services/Tranformer";
import { fetchHouseDetails } from "../services/House";
const GreyTransformerImg = "images/GreyTransformer.png";
const GreyHouseImg = "images/GreyHouse.png";
const GreenTransformerImg = "images/GreenTransformer.png";
const GreenHouseImg = "images/GreenHouse.png";
const BlackTransformerImg = "images/BlackTransformer.png";
const BlackHouseImg = "images/BlackHouse.png";

const NetworkGraph = ({
  data,
  onTransformerEdit,
  onHouseEdit,
  addHouse,
  addTransformer,
  deleteNode,
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    renderGraph();
  }, [data]);

  const handleDoubleClick = async (event, d) => {
    if (!d || !d.id) {
      console.error("Node data is undefined or missing id:", d);
      return;
    }

    try {
      if (d.id.includes("Transformer")) {
        const transformerDetails = await fetchTransformerDetails(d.ids);
        onTransformerEdit(transformerDetails);
      } else if (d.id.includes("House")) {
        const houseDetails = await fetchHouseDetails(d.ids);
        onHouseEdit(houseDetails);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const assignPositions = (nodes, links) => {
    const nodeMap = {};
    nodes.forEach((node, index) => {
      node.index = index + 1;
      nodeMap[node.id] = node;
      node.children = [];
    });

    links.forEach((link) => {
      const parent = nodeMap[link.source];
      const child = nodeMap[link.target];
      if (parent && child) {
        parent.children.push(child);
      }
    });

    const positionNodes = (node, level = 0, xOffset = 0) => {
      node.x = xOffset;
      node.y = level * 100;

      if (node.type === "transformer" && node.children.length > 0) {
        let currentXOffset = xOffset - (node.children.length - 1) * 50;
        node.children.forEach((child, index) => {
          positionNodes(child, level + 1, currentXOffset + index * 100);
        });
      } else {
        node.children.forEach((child, index) => {
          positionNodes(child, level + 1, xOffset);
        });
      }
    };

    nodes
      .filter((node) => !links.find((link) => link.target === node.id))
      .forEach((rootNode, index) => {
        positionNodes(rootNode, 0, index * 200);
      });
  };
  const getNodeImage = (d) => {
    if (d.type === "transformer") {
      switch (d.color) {
        case "grey":
          return GreyTransformerImg;
        case "green":
          return GreenTransformerImg;
        case "black":
          return BlackTransformerImg;
        default:
          return GreyTransformerImg;
      }
    } else if (d.type === "house") {
      switch (d.color) {
        case "grey":
          return GreyHouseImg;
        case "green":
          return GreenHouseImg;
        case "black":
          return BlackHouseImg;
        default:
          return GreyHouseImg;
      }
    }
    return null;
  };

  const renderGraph = () => {
    console.log("Rendering graph with data:", data);
    const svg = d3.select(svgRef.current);
    const width = 1250;
    const height = 630;
  
    svg.attr("width", width).attr("height", height);
  
    const nodes = data.nodes;
    const links = data.links;
  
    assignPositions(nodes, links);
  
    svg.selectAll("*").remove();
  
    const graphGroup = svg.append("g");
  
    const link = graphGroup
      .selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
      .attr("x1", (d) => nodes.find((node) => node.id === d.source)?.x)
      .attr("y1", (d) => nodes.find((node) => node.id === d.source)?.y)
      .attr("x2", (d) => nodes.find((node) => node.id === d.target)?.x)
      .attr("y2", (d) => nodes.find((node) => node.id === d.target)?.y);
  
    const node = graphGroup
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("image")
      .attr("class", "node")
      .attr("xlink:href", (d) => getNodeImage(d))
      .attr("x", (d) => d.x - 20) 
      .attr("y", (d) => d.y - 20) 
      .attr("width", 40)
      .attr("height", 40) 
      .on("dblclick", handleDoubleClick);
  
    const label = graphGroup
      .selectAll(".label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("dy", -3)
      .attr("text-anchor", "middle")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y - 25)
      .text((d) => d.index);
  
    const addHouseButtons = graphGroup
      .selectAll(".add-house-button")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "add-house-button")
      .attr("x", (d) => d.x - 30)
      .attr("y", (d) => d.y + 30)
      .attr("text-anchor", "middle")
      .attr("fill", "blue")
      .style("cursor", "pointer")
      .text((d) => (d.type === "transformer" ? "+ H" : ""))
      .on("click", (event, d) => {
        const clickedNodeId = d.id;
        addHouse(clickedNodeId);
      });
  
    const addTransformerButtons = graphGroup
      .selectAll(".add-transformer-button")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "add-transformer-button")
      .attr("x", (d) => d.x + 30)
      .attr("y", (d) => d.y + 30)
      .attr("text-anchor", "middle")
      .attr("fill", "green")
      .style("cursor", "pointer")
      .text((d) => (d.type === "transformer" ? "+ T" : ""))
      .on("click", (event, d) => {
        const clickedNodeId = d.id;
        addTransformer(clickedNodeId);
      });
  
    const deleteNodeButtons = graphGroup
      .selectAll(".delete-node-button")
      .data(nodes)
      .enter()
      .filter((node) => node.type === "house" || node.type === "transformer")
      .append("text")
      .attr("class", "delete-node-button")
      .attr("x", (d) => d.x + 20)
      .attr("y", (d) => d.y - 20)
      .attr("text-anchor", "middle")
      .attr("fill", "red")
      .style("cursor", "pointer")
      .text("x")
      .on("click", (event, d) => {
        deleteNode(d.id);
      });
  
    const xOffset = 100;
    const yOffset = 50;
    graphGroup.attr("transform", `translate(${xOffset}, ${yOffset})`);
  };
 

  return <svg ref={svgRef}></svg>;
};

export default NetworkGraph;
