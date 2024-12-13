import React from 'react';
import * as d3 from 'd3';

const FileUploader = ({ onDataParsed }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result;
      const parsedData = d3.csvParse(text);

      // Group and calculate distinct phone models per year and brand for Stacked Bar Chart
      const groupedData = d3.rollup(
        parsedData,
        (v) => new Set(v.map((d) => d.phone_model)).size,
        (d) => d.Year,
        (d) => d.phone_brand
      );

      const allBrands = Array.from(new Set(parsedData.map((d) => d.phone_brand)));
      const years = Array.from(new Set(parsedData.map((d) => d.Year)));

      const formattedDataForStackedBar = years.map((year) => {
        const yearData = { year };
        allBrands.forEach((brand) => {
          const count = groupedData.get(year)?.get(brand) || 0;
          yearData[brand] = count;
        });
        return yearData;
      });

      // Group and calculate average price for each phone brand for Bar Chart
      const groupedDataForBarChart = d3.rollup(
        parsedData,
        (v) => d3.mean(v, (d) => +d.price), // Calculate average price for each brand
        (d) => d.phone_brand
      );

      const formattedDataForBarChart = Array.from(
        groupedDataForBarChart,
        ([brand, avgPrice]) => ({
          phone_brand: brand,
          average_price: avgPrice,
        })
      ).sort((a, b) => b.average_price - a.average_price); // Sort in descending order by average price

      // Function to infer OS based on phone brand
      const inferOS = (brand) => {
        const brandToOSMap = {
          apple: 'iOS',
          samsung: 'Android',
          huawei: 'Android',
          google: 'Android',
          oneplus: 'Android',
          xiaomi: 'Android',
          oppo: 'Android',
          vivo: 'Android',
          nokia: 'Android',
          sony: 'Android',
        };

        // Return the mapped OS or "Unknown" if the brand is not in the map
        return brandToOSMap[brand.toLowerCase()] || 'Unknown';
      };

      // Infer OS and calculate foldable vs non-foldable devices
      const groupedDataForFoldable = d3.rollup(
        parsedData.map(d => ({
          ...d,
          os: inferOS(d.phone_brand), // Use the inferOS function to determine the OS
        })),
        (v) => ({
          Yes: v.filter((d) => d.Foldable === '1').length, // Foldable devices
          No: v.filter((d) => d.Foldable === '0').length, // Non-Foldable devices
        }),
        (d) => d.os
      );

      const formattedDataForFoldable = Array.from(
        groupedDataForFoldable,
        ([os, counts]) => ({
          os: os || 'Unknown', // Default to 'Unknown' if `os` is undefined
          Yes: counts.Yes || 0,
          No: counts.No || 0,
        })
      );

      // Group and calculate scatter plot data
      const groupedDataForScatterPlot = d3.rollup(
        parsedData,
        (v) => {
          const avgPixels = d3.mean(v, (d) => {
            const [width, height] = d.Display_Resolution.split('x').map(Number);
            return width * height;
          });
          const avgPriceUSD = d3.mean(v, (d) => +d.price_USD);
          return { avgPixels, avgPriceUSD };
        },
        (d) => d.phone_brand
      );

      const formattedDataForScatterPlot = Array.from(
        groupedDataForScatterPlot,
        ([brand, { avgPixels, avgPriceUSD }]) => ({
          phoneBrand: brand,
          avgPixels,
          avgPriceUSD,
        })
      );

      // Pass all datasets to the parent component
      onDataParsed({
        stackedBarData: formattedDataForStackedBar,
        barChartData: formattedDataForBarChart,
        foldableData: formattedDataForFoldable, // Pass foldable data here
        scatterPlotData: formattedDataForScatterPlot, // Pass scatter plot data here
      });
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="default_size"
        type="file"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default FileUploader;
