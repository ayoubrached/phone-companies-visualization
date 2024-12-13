import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PixelsVsAvgPriceScatterPlot = ({ data, colorScale }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (data.length === 0) return;

        const margin = {
            top: 20,
            right: 30,
            bottom: 50,
            left: 60
        };

        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3
            .select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.avgPixels) || 1])
            .nice()
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.avgPriceUSD) || 1])
            .nice()
            .range([height, 0]);

        svg
            .append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale).ticks(5))
            .selectAll('text')
            .style('font-size', '10px');

        svg
            .append('g')
            .call(d3.axisLeft(yScale).ticks(5))
            .selectAll('text')
            .style('font-size', '10px');

        const tooltip = d3
            .select('body')
            .append('div')
            .style('position', 'absolute')
            .style('background-color', 'white')
            .style('border', '1px solid #ddd')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('box-shadow', '0px 2px 4px rgba(0, 0, 0, 0.2)')
            .style('pointer-events', 'none')
            .style('visibility', 'hidden');

        svg
            .selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.avgPixels))
            .attr('cy', d => yScale(d.avgPriceUSD))
            .attr('r', 6)
            .attr('fill', d => colorScale(d.phoneBrand))
            .on('mouseover', (event, d) => {
                const avgPixels = d.avgPixels ? d.avgPixels.toFixed(2) : 'N/A';
                const avgPriceUSD = d.avgPriceUSD ? d.avgPriceUSD.toFixed(2) : 'N/A';
                tooltip
                    .html(
                        `<strong>Brand:</strong> ${d.phoneBrand}<br>
                         <strong>Avg. Total Pixels:</strong> ${avgPixels}<br>
                         <strong>Avg. Price (USD):</strong> $${avgPriceUSD}`
                    )
                    .style('visibility', 'visible')
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 30}px`);
            })
            .on('mousemove', event => {
                tooltip
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 30}px`);
            })
            .on('mouseout', () => {
                tooltip.style('visibility', 'hidden');
            });

        svg
            .append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text('Average Total Pixels vs. Average Price (USD)');

        svg
            .append('text')
            .attr('x', width / 2)
            .attr('y', height + 40)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Average Total Pixels');

        svg
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -40)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Average Price (USD)');
    }, [data, colorScale]);

    return <svg ref={svgRef}></svg>;
};

export default PixelsVsAvgPriceScatterPlot;