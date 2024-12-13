import React, { useState, useMemo } from 'react';
import StackedBar from './components/StackedBar';
import BarChart from './components/BarChart';
import FileUploader from './components/FileUploader';
import PixelsVsAvgPriceScatterPlot from './components/PixelsVsAvgPriceScatterPlot';
import './App.css';
import * as d3 from 'd3';

const App = () => {
    const [stackedBarData, setStackedBarData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [scatterPlotData, setScatterPlotData] = useState([]);
    const [brands, setBrands] = useState([]);

    const colorScale = useMemo(() => {
        return d3
            .scaleOrdinal()
            .domain(brands.length > 0 ? brands : ['Default'])
            .range(d3.schemeCategory10);
    }, [brands]);

    const handleDataParsed = ({ stackedBarData, barChartData, scatterPlotData, uniqueBrands }) => {
        setStackedBarData(stackedBarData || []);
        setBarChartData(barChartData || []);
        setScatterPlotData(scatterPlotData || []);
        setBrands([...new Set(uniqueBrands)]); // Ensure unique and sorted
    };
    console.log('Brands:', brands);
    console.log('Color Scale Domain:', colorScale.domain());

    return (
        <div className="graphs">
            <h1 className="header mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                    Phone Company Visualization
                </span>
            </h1>
            <FileUploader onDataParsed={handleDataParsed} />

            {stackedBarData.length > 0 && barChartData.length > 0 && scatterPlotData.length > 0 && (
                <div className="visualization-section">
                    <div className="flex flex-row w-full">
                        <div className="stacked-bar-chart flex-1">
                            <StackedBar data={stackedBarData} colorScale={colorScale} />
                        </div>
                        <div className="bar-chart flex-1">
                            <BarChart data={barChartData} colorScale={colorScale} />
                        </div>
                    </div>

                    <div className="scatter-plot mt-5">
                        <PixelsVsAvgPriceScatterPlot data={scatterPlotData} colorScale={colorScale} />
                    </div>
                </div>
            )}
        </div>
    );
    
};

export default App;
