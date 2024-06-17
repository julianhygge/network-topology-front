
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { fetchTransformerDetails } from '../services/Tranformer';
import { fetchHouseDetails } from '../services/House';

const NetworkGraph = ({ data, onTransformerEdit, onHouseEdit, addHouse, deleteNode,addTransformer }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        renderGraph();
    }, [data]);

    const handleDoubleClick = async (event, d) => {
        if (!d || !d.id) {
            console.error('Node data is undefined or missing id:', d);
            return;
        }

        try {
            if (d.id.includes('Transformer')) {
                const transformerDetails = await fetchTransformerDetails(d.ids);
                onTransformerEdit(transformerDetails);
            } else if (d.id.includes('House')) {
                const houseDetails = await fetchHouseDetails(d.ids);
                onHouseEdit(houseDetails);
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    const renderGraph = () => {
        const svg = d3.select(svgRef.current);

        const width = 1400;
        const height = 1000;

        svg.attr('width', width).attr('height', height);

        const nodes = data.nodes;
        const links = data.links;

        const transformerScale = d3.scalePoint()
            .domain(nodes.filter(node => node.id.includes('Transformer')).map(node => node.id))
            .range([100, width - 100]);

        nodes.forEach(node => {
            if (node.id.includes('Transformer')) {
                node.x = transformerScale(node.id);
                node.y = 100;
            }
        });

        nodes.filter(node => node.id.includes('House')).forEach(house => {
            const transformerId = house.id.split('-')[1];
            const transformer = nodes.find(node => node.id === `Transformer-${transformerId}`);
            if (transformer) {
                const houseIndex = nodes.filter(node => node.id.includes(`House-${transformerId}`)).findIndex(h => h.id === house.id);
                house.x = transformer.x;
                house.y = 200 + houseIndex * 50;
            } else {
                console.warn(`Transformer ${transformerId} not found for house ${house.id}`);
            }
        });

        svg.selectAll('*').remove(); 
        const link = svg.selectAll('.link')
            .data(links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('stroke', '#999')
            .attr('stroke-width', 2)
            .attr('x1', d => nodes.find(node => node.id === d.source).x)
            .attr('y1', d => nodes.find(node => node.id === d.source).y)
            .attr('x2', d => nodes.find(node => node.id === d.target).x)
            .attr('y2', d => nodes.find(node => node.id === d.target).y);

        const node = svg.selectAll('.node')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('class', 'node')
            .attr('r', d => d.id.includes('Transformer') ? 20 : 10)
            .attr('fill', d => d.color)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .on('dblclick', handleDoubleClick)
            

        const label = svg.selectAll('.label')
            .data(nodes)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('dy', -3)
            .attr('text-anchor', 'middle')
            .attr('x', d => d.x)
            .attr('y', d => d.y - 25)
            .text(d => d.label);

    const addHouseButtons = svg.selectAll('.add-house-button')
    .data(nodes.filter(node => node.id.includes('Transformer')))
    .enter()
    .append('text')
    .attr('class', 'add-house-button')
    .attr('x', d => d.x)
    .attr('y', d => d.y + 30)
    .attr('text-anchor', 'middle')
    .attr('fill', 'blue')
    .style('cursor', 'pointer')
    .text('+ House')
    .on('click', (event, d) => {

        const clickedTransformerId = d.id; 
        addHouse(clickedTransformerId);
    });
    const deleteNodeButtons = svg.selectAll('.delete-node-button')
    .data(nodes)
    .enter()
    .filter(node => node.id.includes('Transformer') || node.id.includes('House'))
    .append('text')
    .attr('class', 'delete-node-button')
    .attr('x', d => d.x + 20)
    .attr('y', d => d.y - 20)
    .attr('text-anchor', 'middle')
    .attr('fill', 'red')
    .style('cursor', 'pointer')
    .text('x')
    .on('click', (event, d) => {
        deleteNode(d.id);
    });
     };


    return (
        <div>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default NetworkGraph;
