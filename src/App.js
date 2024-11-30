import React, { useEffect, useState } from 'react';
import StackedBar from './StackedBar';
import * as d3 from 'd3';
import "./App.css"

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv('/processed_data_news.csv').then(parsedData => {

      const cleanedData = parsedData.map(d =>
        Object.fromEntries(
          Object.entries(d).map(([key, value]) => [key.trim(), value?.trim()])
        )
      );

      const groupedData = d3.rollup(
        cleanedData,
        v => new Set(v.map(d => d.phone_model)).size,
        d => d.Year,
        d => d.phone_brand
      );

      const allBrands = Array.from(
        new Set(cleanedData.map(d => d.phone_brand))
      );

      const years = Array.from(new Set(cleanedData.map(d => d.Year)));

      const formattedData = years.map(year => {
        const yearData = { year };
        allBrands.forEach(brand => {
          const count = groupedData.get(year)?.get(brand) || 0;
          yearData[brand] = count;
        });
        return yearData;
      });

      setData(formattedData);
    });
  }, []);

  return (
    <div className='graphs'>
      {data.length > 0 ? (
        <StackedBar data={data} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default App;
