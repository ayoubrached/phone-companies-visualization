import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Foldable = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 20, right: 120, bottom: 50, left: 60 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear existing SVG
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG container
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Extract OS and Foldable/Non-Foldable categories
    const os = data.map(d => d.os);
    const categories = ['Yes', 'No'];

    // Stack data
    const stackedData = d3.stack().keys(categories)(data);

    // scales
    const xScale = d3
      .scaleBand()
      .domain(os)
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
      .nice()
      .range([height, 0]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(categories)
      .range(['#ff9800', '#2196f3']); // Orange for foldable, blue for non-foldable

    // axes
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .selectAll('text')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-30)')
      .style('text-anchor', 'end');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text('Foldable vs Non-Foldable');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Number of Phones');

    svg.append('g').call(d3.axisLeft(yScale));

    // Tooltip
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

    // Draw bars
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
      .attr('x', d => xScale(d.data.os))
      .attr('y', height)
      .attr('height', 0)
      .attr('width', xScale.bandwidth())
      .on('mouseover', (event, d) => {
        const category = d3.select(event.target.parentNode).datum().key;
        const displayCategory = category === 'Yes' ? 'Foldable' : 'Non-Foldable';
        tooltip
          .html(
            `<strong>Category:</strong> ${displayCategory}<br>
            <strong>OS:</strong> ${d.data.os}<br>
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
      })
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]));

    // legend
    const legend = svg
      .selectAll('.legend')
      .data(categories)
      .enter()
      .append('g')
      .attr('transform', (_, i) => `translate(${width + 10}, ${i * 20})`);

    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', d => colorScale(d));

    legend
      .append('text')
      .attr('x', 15)
      .attr('y', 10)
      .style('font-size', '12px')
      .text(d => (d === 'Yes' ? 'Foldable' : 'Non-Foldable'))
      .attr('text-anchor', 'start');
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default Foldable;
