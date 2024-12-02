import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const StackedBar = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length === 0) return;

    // Set up dimensions
    const margin = { top: 40, right: 200, bottom: 70, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Clear existing SVG
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG container
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Extract years and brands
    const years = data.map(d => d.year);
    const brands = Object.keys(data[0]).filter(key => key !== 'year');

    // Stack data
    const stackedData = d3.stack().keys(brands)(data);

    // Set up scales
    const xScale = d3
      .scaleBand()
      .domain(years)
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
      .nice()
      .range([height, 0]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(brands)
      .range(d3.schemeCategory10);

    // Add axes
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g').call(d3.axisLeft(yScale));

    // Add x-axis title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 50)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Year');

    // Add y-axis title
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Distinct Count of Phone Model');

    // Create a tooltip
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

    // Add stacked bars
    svg
      .selectAll('.layer')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', d => colorScale(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.data.year))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth())
      .on('mouseover', (event, d) => {
        const brand = d3.select(event.target.parentNode).datum().key; // Get brand
        tooltip
          .html(
            `<strong>Brand:</strong> ${brand}<br>
            <strong>Year:</strong> ${d.data.year}<br>
            <strong>Count:</strong> ${d[1] - d[0]}`
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

    // Add legend title
    svg
      .append('text')
      .attr('x', width + 30)
      .attr('y', 0)
      .attr('text-anchor', 'start')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Brand');

    // Add legend
    const legend = svg
      .selectAll('.legend')
      .data(brands)
      .enter()
      .append('g')
      .attr('transform', (_, i) => `translate(${width + 30}, ${i * 20 + 20})`);

    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => colorScale(d));

    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 12)
      .text(d => d)
      .attr('text-anchor', 'start')
      .style('alignment-baseline', 'middle');

    // Add title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Phones Produced By Brand');
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default StackedBar;
