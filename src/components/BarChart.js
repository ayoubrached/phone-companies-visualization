import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length === 0) {
      console.warn('No data available for rendering BarChart');
      return;
    }

    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const brands = data.map(d => d.phone_brand);
    const avgPrices = data.map(d => d.average_price);

    const xScale = d3
      .scaleBand()
      .domain(brands)
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(avgPrices) || 1])
      .nice()
      .range([height, 0]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(brands)
      .range(d3.schemeCategory10);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '10px');

    svg.append('g').call(d3.axisLeft(yScale).tickSize(-width)).selectAll('text').style('font-size', '10px');

    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '10px')
      .style('box-shadow', '0px 2px 4px rgba(0, 0, 0, 0.2)')
      .style('pointer-events', 'none')
      .style('visibility', 'hidden');

    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.phone_brand))
      .attr('y', height)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
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
      })
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .attr('y', d => yScale(d.average_price))
      .attr('height', d => height - yScale(d.average_price));

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text('Average Price by Phone Brand');
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default BarChart;
