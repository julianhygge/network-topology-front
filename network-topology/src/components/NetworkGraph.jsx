import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const NetworkGraph = ({ transformers, onNodeClick }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        renderGraph();
    }, [transformers]);

    const renderGraph = () => {
        const svg = d3.select(svgRef.current);
        const width = 1400;
        const height = 1000;

        svg.attr('width', width).attr('height', height);

        const transformerNodes = transformers.map((transformer, index) => ({
            ...transformer,
            x: (index + 1) * (width / (transformers.length + 1)),
            y: 100,
        }));

        let houseNodes = [];
        let links = [];

        transformerNodes.forEach((transformer, tIndex) => {
            transformer.houses.forEach((house, hIndex) => {
                houseNodes.push({
                    ...house,
                    x: transformer.x,
                    y: 200 + hIndex * 50,
                });
                links.push({
                    source: transformer.id,
                    target: house.id,
                });
            });
        });

        const nodes = [...transformerNodes, ...houseNodes];

        const link = svg.selectAll('.link').data(links, d => `${d.source}-${d.target}`);
        link.exit().remove();
        link.attr('x1', d => nodes.find(node => node.id === d.source).x)
            .attr('y1', d => nodes.find(node => node.id === d.source).y)
            .attr('x2', d => nodes.find(node => node.id === d.target).x)
            .attr('y2', d => nodes.find(node => node.id === d.target).y);

        link.enter()
            .append('line')
            .attr('class', 'link')
            .attr('stroke', '#999')
            .attr('stroke-width', 2)
            .attr('x1', d => nodes.find(node => node.id === d.source).x)
            .attr('y1', d => nodes.find(node => node.id === d.source).y)
            .attr('x2', d => nodes.find(node => node.id === d.target).x)
            .attr('y2', d => nodes.find(node => node.id === d.target).y);

        const node = svg.selectAll('.node').data(nodes, d => d.id);
        node.exit().remove();
        node.attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', d => d.type === 'transformer' ? '#3498db' : d.color);

        node.enter()
            .append('circle')
            .attr('class', 'node')
            .attr('r', d => d.type === 'transformer' ? 20 : 10)
            .attr('fill', d => d.type === 'transformer' ? '#3498db' : d.color)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .on('click', (event, d) => {
                onNodeClick(d);
            });

        const label = svg.selectAll('.label').data(nodes, d => d.id);
        label.exit().remove();
        label.attr('x', d => d.x)
            .attr('y', d => d.y - 25)
            .text(d => d.label);

        label.enter()
            .append('text')
            .attr('class', 'label')
            .attr('dy', -3)
            .attr('text-anchor', 'middle')
            .attr('x', d => d.x)
            .attr('y', d => d.y - 25)
            .text(d => d.label);
    };

    return <svg ref={svgRef}></svg>;
};

export default NetworkGraph;
