import React, { useState, useMemo } from 'react';
import StackedBar from './components/StackedBar';
import BarChart from './components/BarChart';
import Foldable from './components/Foldable'; // Import the Foldable component
import FileUploader from './components/FileUploader';
import PixelsVsAvgPriceScatterPlot from './components/PixelsVsAvgPriceScatterPlot';
import './App.css';
import * as d3 from 'd3';

const App = () => {
    const [stackedBarData, setStackedBarData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [scatterPlotData, setScatterPlotData] = useState([]);
    const [foldableData, setFoldableData] = useState([]);
    const [brands, setBrands] = useState([]);

    const colorScale = useMemo(() => {
        return d3
            .scaleOrdinal()
            .domain(brands.length > 0 ? brands : ['Default'])
            .range(d3.schemeCategory10);
    }, [brands]);

    // Handle parsed data from file upload
    const handleDataParsed = ({ stackedBarData, barChartData, scatterPlotData, foldableData, uniqueBrands }) => {
        setStackedBarData(stackedBarData || []);
        setBarChartData(barChartData || []);
        setScatterPlotData(scatterPlotData || []);
        setFoldableData(foldableData || []);
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

            {stackedBarData.length > 0 && barChartData.length > 0 && scatterPlotData.length > 0 && foldableData.length > 0 && (
                <div className="visualization-section">
                    <div className="flex flex-row w-full flex-wrap">
                        <div className="stacked-bar-chart flex-1 mb-10">
                            <StackedBar data={stackedBarData} colorScale={colorScale} />
                        </div>
                        <div className="bar-chart flex-1">
                            <BarChart data={barChartData} colorScale={colorScale} />
                        </div>
                        <div className="scatter-plot flex-1">
                            <PixelsVsAvgPriceScatterPlot data={scatterPlotData} colorScale={colorScale} />
                        </div>
                        <div className="foldable-chart flex-1">
                            <Foldable data={foldableData} colorScale={colorScale} />
                        </div>
                    </div>
                    
                </div>
            )}
        </div>
    );
};

export default App;
