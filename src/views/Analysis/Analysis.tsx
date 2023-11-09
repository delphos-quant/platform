import React, {useState} from 'react';

import {TagFilter} from "../../stories/filters/TagFilter/TagFilter";
import {ScatterGraph} from "../../stories/graphs/ScatterGraph";
import {Dropdown} from "../../stories/selectors/Dropdown.tsx";
import {LoadingOverlay} from "../../components/LoadingOverlay/LoadingOverlay.tsx";
import {MultiHeaderTable} from "../../components/MultiHeaderTable/MultiHeaderTable.tsx";

// Define custom stock data type

type StockDataKey = 'Close' | 'Open' | 'High' | 'Low' | 'Volume';


const endpoints = {
    indicators: {
        value: "Value",
        volatility: "Volatility",
        moving_average: "Moving Average",
        bollinger_bands: "Bollinger Bands",
    },
    analysis: {
        returns: "Returns",
        log_change: "Log Change",
        autocorrelation: "Autocorrelation 15-lags",
        diff: "Differentiation",
        detrend: "Detrending"
    }
}

const default_url = "http://localhost:8000";

const formatGraphData = (data: any, index: number[]) => {
    return Object.keys(data).map((ticker) => {
        return {
            x: index,
            y: data[ticker],
            name: ticker,
            mode: 'markers',
            type: 'scatter'
        }
    });
}

const Analysis: React.FC = () => {
    const [selectedColumn,] = useState<StockDataKey>('Close');
    const [selectedIndicator, setSelectedIndicator] = useState<string>("value");
    const [selectedAnalysis, setSelectedAnalysis] = useState<string[]>([]);
    const [tickers, setTickers] = useState<string[]>([]);
    const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
    const [stocks, setStocks] = useState<any>([]);
    const [selectedStocks, setSelectedStocks] = useState<any>([]);

    const [graphData, setGraphData] = useState<any>([]);

    const [loading, setLoading] = useState(true);

    const fetchTickers = async () => {
        try {
            setLoading(true);
            const response = await fetch(default_url + "/tickers");
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch stock tickers:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch stocks given a list of tickers
    const fetchStocks = async (tickers: string[]) => {
        try {
            setLoading(true);
            const body = {
                tickers: tickers,
            }

            const response = await fetch(default_url + "/stocks", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            });

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch stocks:', error);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        fetchTickers().then((data) => {
            setTickers(data);

            fetchStocks(data).then((data) => {
                setStocks(data);
            });
        });
    }, []);

    React.useEffect(() => {
        const filteredStocks = {
            "index": stocks.index,
            "data": {
                "Close": {},
                "Open": {},
                "High": {},
                "Low": {},
                "Volume": {},
                "VWAP": {},
                "NumTrades": {},
            }
        };

        if (selectedTickers.length === 0 || stocks.data === undefined || stocks.index === undefined) {
            setSelectedStocks(filteredStocks);
            return;
        }

        filteredStocks.data.Close = Object.fromEntries(Object.entries(stocks.data.Close).filter(([key,]) => selectedTickers.includes(key)));
        filteredStocks.data.Open = Object.fromEntries(Object.entries(stocks.data.Open).filter(([key,]) => selectedTickers.includes(key)));
        filteredStocks.data.High = Object.fromEntries(Object.entries(stocks.data.High).filter(([key,]) => selectedTickers.includes(key)));
        filteredStocks.data.Low = Object.fromEntries(Object.entries(stocks.data.Low).filter(([key,]) => selectedTickers.includes(key)));
        filteredStocks.data.Volume = Object.fromEntries(Object.entries(stocks.data.Volume).filter(([key,]) => selectedTickers.includes(key)));
        filteredStocks.data.VWAP = Object.fromEntries(Object.entries(stocks.data.VWAP).filter(([key,]) => selectedTickers.includes(key)));
        filteredStocks.data.NumTrades = Object.fromEntries(Object.entries(stocks.data.NumTrades).filter(([key,]) => selectedTickers.includes(key)));

        setSelectedStocks(filteredStocks);
    }, [selectedTickers, stocks]);

    const fetchAnalysis = async () => {
        try {
            setLoading(true);
            console.log(JSON.stringify({
                    "indicator": [selectedIndicator],
                    "fields": selectedColumn,
                    "operations": selectedAnalysis,
                    "tickers": selectedTickers
                }));
            const response = await fetch(default_url + '/analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "indicators": [selectedIndicator],
                    "fields": selectedColumn,
                    "operations": selectedAnalysis,
                    "tickers": selectedTickers
                }),
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch stocks:', error);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        // For each analysis in selectedAnalysis, fetch analysis and add to graphdata dict given analysis name
        // graphData = {analysisName: [analysisData]}
        fetchAnalysis().then((data) => {
            console.log(data);
            setGraphData(data);
        });

    }, [selectedColumn, selectedIndicator, selectedAnalysis, selectedStocks]);

    const onFilterChange = (selectedTickers: string[]) => {
        // filter availableStocks given stocks
        // set selectedStocks to filtered list
        // filter availableStocks: Stock[] given stocks: string[]
        let filteredTickers = tickers.filter((ticker) => selectedTickers.includes(ticker));

        setSelectedTickers(filteredTickers);
    }

    return (
        <div style={{"margin": "auto", "width": "95%", "padding": "22px"}}>
            {loading && <LoadingOverlay/>}
            <h1>Analysis</h1>
            <div>
                <h3>Filter stocks to analyze</h3>
                {
                    tickers.length > 0 &&
                    <TagFilter availableTags={tickers} onTagsChange={onFilterChange}/>
                }
                {
                    selectedTickers.length > 0 &&
                    <div>
                        {
                            selectedStocks.data !== undefined && selectedStocks.index !== undefined &&
                            <MultiHeaderTable secondLevelColumns={selectedTickers}
                                              data={selectedStocks.data}
                                              index={selectedStocks.index}/>
                        }

                        <div>
                            <p>Select an indicator to analyze</p>
                            <Dropdown options={Object.keys(endpoints.indicators)}
                                      onOptionChange={setSelectedIndicator}/>
                            {/*
                            <p>Select a column to analyze</p>
                            <Dropdown options={Object.keys(tickers[0])}
                                      onOptionChange={(option) => setSelectedColumn(strToKey(option))}/>

                            */}
                        </div>
                        <div>
                            <h3>Select series analysis features to perform</h3>
                            <TagFilter availableTags={Object.keys(endpoints.analysis)}
                                       onTagsChange={setSelectedAnalysis}/>
                        </div>
                        {
                            graphData !== undefined && Object.keys(graphData).length > 0 &&
                            <div>
                                <h3>Graphs</h3>
                                {
                                    Object.keys(graphData).map((indicatorName) => {
                                        return (
                                            Object.keys(graphData[indicatorName]).map((analysisName) => {
                                                return (
                                                    <ScatterGraph
                                                        data={formatGraphData(graphData[indicatorName][analysisName].data, graphData[indicatorName][analysisName].index)}></ScatterGraph>
                                                )
                                            })
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}


export default Analysis;
