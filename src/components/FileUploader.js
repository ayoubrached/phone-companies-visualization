import React from 'react';
import * as d3 from 'd3';

const FileUploader = ({ onDataParsed }) => {
  const handleFileUpload = event => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result;
      const parsedData = d3.csvParse(text);

      const groupedData = d3.rollup(
        parsedData,
        v => new Set(v.map(d => d.phone_model)).size,
        d => d.Year,
        d => d.phone_brand
      );

      const allBrands = Array.from(new Set(parsedData.map(d => d.phone_brand)));
      const years = Array.from(new Set(parsedData.map(d => d.Year)));

      const formattedData = years.map(year => {
        const yearData = { year };
        allBrands.forEach(brand => {
          const count = groupedData.get(year)?.get(brand) || 0;
          yearData[brand] = count;
        });
        return yearData;
      });

      onDataParsed(formattedData);
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="default_size">Default size</label>
      <input class="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="default_size" type="file" onChange={handleFileUpload}/>
    </div>
  );
};

export default FileUploader;
