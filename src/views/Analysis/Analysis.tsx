import React, {useState} from 'react';

import {TagFilter} from "../../stories/filters/TagFilter/TagFilter";
import {ScatterGraph} from "../../stories/graphs/ScatterGraph";
import {Dropdown} from "../../stories/selectors/Dropdown.tsx";
import {LoadingOverlay} from "../../components/LoadingOverlay/LoadingOverlay.tsx";
import {MultiHeaderTable} from "../../components/MultiHeaderTable/MultiHeaderTable.tsx";

// Define custom stock data type

type StockDataKey = 'Close' | 'Open' | 'High' | 'Low' | 'Volume';

function strToKey (str: string): StockDataKey {
    return str as StockDataKey;
}

// Make default format be plotly line graph
interface Stock {
    Symbol: string;
    Close: number[];
    Open: number[];
    High: number[];
    Low: number[];
    Volume: number[];
    Format?: 'line' | 'candlestick';
}


const endpoints = {
    indicators: {
        stock: "/stock",
        volatility: "/volatility",
        moving_average: "/moving_average",
        bollinger_bands: "/bollinger_bands",
    },
    analysis: {
        returns: "/returns",
        log_returns: "/log_returns",
        autocorrelation: "/autocorrelation",
        diff: "/diff",
        detrend: "/detrend"
    }
}

const default_url = "http://localhost:3000";

function range(start: number, end: number): number[] {
    return Array.from({length: end - start}, (_, i) => start + i);
}

const stocksToData = (stocks: Stock[]) => {
    // Find the maximum length of the time series data across all stocks
    const maxLength = Math.max(...stocks.map(stock => stock.Close.length));

    // Initialize the table data array with indices and empty stock data
    const data = Array.from({length: maxLength}, (_, idx) => ({
        idx,
        ...stocks.reduce((acc: any, stock) => {
            acc[stock.Symbol] = {
                close: 0,
                open: 0,
                high: 0,
                low: 0,
                volume: 0
            };
            return acc;
        }, {})
    }));

    // Populate the data with actual values from the stocks
    stocks.forEach(stock => {
        stock.Close.forEach((close, idx) => {
            data[idx][stock.Symbol].close = close;
        });
        stock.Open.forEach((open, idx) => {
            data[idx][stock.Symbol].open = open;
        });
        stock.High.forEach((high, idx) => {
            data[idx][stock.Symbol].high = high;
        });
        stock.Low.forEach((low, idx) => {
            data[idx][stock.Symbol].low = low;
        });
        stock.Volume.forEach((volume, idx) => {
            data[idx][stock.Symbol].volume = volume;
        });
    });

    return data;
};

const stocksToColumns = (stocks: Stock[]) => {
    const stockColumns = stocks.map(stock => ({
        Header: stock.Symbol,
        accessor: stock.Symbol,
        columns: [
            {Header: 'Close', accessor: `${stock.Symbol}.close`},
            {Header: 'Open', accessor: `${stock.Symbol}.open`},
            {Header: 'High', accessor: `${stock.Symbol}.high`},
            {Header: 'Low', accessor: `${stock.Symbol}.low`},
            {Header: 'Volume', accessor: `${stock.Symbol}.volume`},
        ],
    }));

    return [
        {Header: 'Index', accessor: 'idx'},
        ...stockColumns
    ];
};

const Analysis: React.FC = () => {
    const [selectedColumn, setSelectedColumn] = useState<StockDataKey>('Close');
    const [_, setSelectedIndicator] = useState<string>("");
    const [selectedAnalysis, setSelectedAnalysis] = useState<string[]>([]);
    const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
    const [availableStocks, setAvailableStocks] = useState<Stock[]>([]);
    const [availableSymbols, setSymbols] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);

    const fetchSymbols = async () => {
        try {
            setLoading(true);
            const response = await fetch(default_url + "/symbols");
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch stock symbols:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch stocks given a list of symbols
    const fetchStock = async (symbol: string) => {
        try {
            setLoading(true);

            const response = await fetch(default_url + endpoints.indicators.stock + `?symbol=${symbol}`);
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch stocks:', error);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        fetchSymbols().then((data) => {
            setSymbols(data);

            let stocks = fetchStock(data[0]);

            stocks.then((data) => {
                setAvailableStocks(data);
                setSelectedStocks(data);
            });
        });
    }, []);

    const onStockChange = (stocks: string[]) => {
        // filter availableStocks given stocks
        // set selectedStocks to filtered list
        // filter availableStocks: Stock[] given stocks: string[]
        let filteredStocks = [];
        for (let i = 0; i < stocks.length; i++) {
            for (let j = 0; j < availableStocks.length; j++) {
                if (stocks[i] === availableStocks[j].Symbol) {
                    filteredStocks.push(availableStocks[j]);
                }
            }
        }
        if (filteredStocks.length === 0) {
            filteredStocks = availableStocks;
        }

        setSelectedStocks(filteredStocks);
    }

    return (
        <div style={{"margin": "auto", "width": "95%", "padding": "22px"}}>
            {loading && <LoadingOverlay/>}
            <h1>Analysis</h1>
            <div>
                <h3>Filter stocks to analyze</h3>
                {
                    availableSymbols.length > 0 &&
                    <TagFilter availableTags={availableSymbols} onTagsChange={onStockChange}/>
                }
                {
                    selectedStocks.length > 0 &&
                    <div>
                        <MultiHeaderTable columns={stocksToColumns(selectedStocks)} data={stocksToData(selectedStocks)}
                                            onSelect={console.log}/>

                        <div>
                            <p>Select an indicator to analyze</p>
                            <Dropdown options={Object.keys(endpoints.indicators)} onOptionChange={setSelectedIndicator}/>
                            <p>Select a column to analyze</p>
                            {/*Cant use setSelectedColumn because has to select one of possible columns, use lambda function*/}
                            <Dropdown options={Object.keys(selectedStocks[0])} onOptionChange={(option) => setSelectedColumn(strToKey(option))}/>
                        </div>
                        <div>
                            <h3>Select series analysis features to perform</h3>
                            <TagFilter availableTags={Object.keys(endpoints.analysis)}
                                       onTagsChange={setSelectedAnalysis}/>
                        </div>
                        {
                            selectedAnalysis.map((analysis) => (
                                <div>
                                    <h3>{analysis}</h3>
                                    {
                                        <ScatterGraph
                                            data={selectedStocks.map(stock => ({
                                                x: range(0, stock[selectedColumn].length),
                                                y: stock[selectedColumn],
                                                name: stock.Symbol
                                            }))}
                                            lines={true}
                                        />
                                    }
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    )
}


export default Analysis;
