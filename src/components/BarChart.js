import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length === 0) {
      console.warn('No data available for rendering BarChart'); // Debugging
      return;
    }

    // Check the data structure
    console.log('Data received by BarChart:', data);

    // Set up dimensions
    const margin = { top: 40, right: 40, bottom: 70, left: 80 };
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

    // Extract brands and average prices
    const brands = data.map(d => d.phone_brand);
    const avgPrices = data.map(d => d.average_price);

    // Set up scales
    const xScale = d3
      .scaleBand()
      .domain(brands)
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(avgPrices) || 1]) // Set default value if avgPrices is empty
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
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg.append('g').call(d3.axisLeft(yScale));

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

    // Add bars
    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.phone_brand))
      .attr('y', d => yScale(d.average_price))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.average_price))
      .attr('fill', d => colorScale(d.phone_brand))
      .on('mouseover', (event, d) => {
        tooltip
          .html(
            `<strong>Brand:</strong> ${d.phone_brand}<br><strong>Average Price:</strong> $${d.average_price.toFixed(
              2
            )}`
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

    // Add title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Average Price by Phone Brand');
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default BarChart;