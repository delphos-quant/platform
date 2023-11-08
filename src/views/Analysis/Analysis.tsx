import React, {useState} from 'react';

import {TagFilter} from "../../stories/filters/TagFilter/TagFilter";
import {ScatterGraph} from "../../stories/graphs/ScatterGraph";
import {Dropdown} from "../../stories/selectors/Dropdown.tsx";
import {LoadingOverlay} from "../../components/LoadingOverlay/LoadingOverlay.tsx";
import {MultiHeaderTable} from "../../components/MultiHeaderTable/MultiHeaderTable.tsx";

// Define custom stock data type

type StockDataKey = 'Close' | 'Open' | 'High' | 'Low' | 'Volume';

function strToKey(str: string): StockDataKey {
    return str as StockDataKey;
}

// Make default format be plotly line graph
interface Stock {
    Ticker: string;
    Close: number[];
    Open: number[];
    High: number[];
    Low: number[];
    Volume: number[];
    Format?: 'line' | 'candlestick';
}


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
            acc[stock.Ticker] = {
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
            data[idx][stock.Ticker].close = close;
        });
        stock.Open.forEach((open, idx) => {
            data[idx][stock.Ticker].open = open;
        });
        stock.High.forEach((high, idx) => {
            data[idx][stock.Ticker].high = high;
        });
        stock.Low.forEach((low, idx) => {
            data[idx][stock.Ticker].low = low;
        });
        stock.Volume.forEach((volume, idx) => {
            data[idx][stock.Ticker].volume = volume;
        });
    });

    return data;
};

const stocksToColumns = (stocks: Stock[]) => {
    const stockColumns = stocks.map(stock => ({
        Header: stock.Ticker,
        accessor: stock.Ticker,
        columns: [
            {Header: 'Close', accessor: `${stock.Ticker}.close`},
            {Header: 'Open', accessor: `${stock.Ticker}.open`},
            {Header: 'High', accessor: `${stock.Ticker}.high`},
            {Header: 'Low', accessor: `${stock.Ticker}.low`},
            {Header: 'Volume', accessor: `${stock.Ticker}.volume`},
        ],
    }));

    return [
        {Header: 'Index', accessor: 'idx'},
        ...stockColumns
    ];
};

const formatStock = (data: any) => {
    const stock: Stock = {
        Ticker: data.df.columns.Close.symbol,
        Close: [],
        Open: [],
        High: [],
        Low: [],
        Volume: [],
    };

    for (let i = 0; i < data.df.data.length; i++) {
        stock.Close.push(data.df.data[i][0]);
        stock.High.push(data.df.data[i][1]);
        stock.Low.push(data.df.data[i][2]);
        stock.Open.push(data.df.data[i][4]);
        stock.Volume.push(data.df.data[i][6]);
    }



    return stock;
}

const Analysis: React.FC = () => {
    const [selectedColumn, setSelectedColumn] = useState<StockDataKey>('Close');
    const [selectedIndicator, setSelectedIndicator] = useState<string>("");
    const [selectedAnalysis, setSelectedAnalysis] = useState<string[]>([]);
    const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
    const [availableStocks, setAvailableStocks] = useState<Stock[]>([]);
    const [availableTickers, setTickers] = useState<string[]>([]);

    const [graphData, setGraphData] = useState<number[]>([]);

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
            console.log(data);

            fetchStocks(data).then((data) => {
                console.log(data);

                const stocks = data.map((stock: any) => formatStock(stock.data));
                setAvailableStocks(stocks);
                setSelectedStocks(stocks);
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
                if (stocks[i] === availableStocks[j].Ticker) {
                    filteredStocks.push(availableStocks[j]);
                }
            }
        }
        if (filteredStocks.length === 0) {
            filteredStocks = availableStocks;
        }

        setSelectedStocks(filteredStocks);
    }

    React.useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const response = await fetch(default_url + `/analysis/?indicator=${selectedIndicator}&field=${selectedColumn}&tickers=${selectedStocks.map(stock => stock.Ticker).join(',')}&operation=${selectedAnalysis.join(',')}`);
                return await response.json();
            } catch (error) {
                console.error('Failed to fetch stocks:', error);
            } finally {
                setLoading(false);
            }
        }

        if (selectedAnalysis.length > 0) {
            fetchAnalysis().then((data) => {
                setGraphData(data);
            });
        }

    }, [selectedColumn, selectedIndicator, selectedAnalysis]);

    return (
        <div style={{"margin": "auto", "width": "95%", "padding": "22px"}}>
            {loading && <LoadingOverlay/>}
            <h1>Analysis</h1>
            <div>
                <h3>Filter stocks to analyze</h3>
                {
                    availableTickers.length > 0 &&
                    <TagFilter availableTags={availableTickers} onTagsChange={onStockChange}/>
                }
                {
                    selectedStocks.length > 0 &&
                    <div>
                        <MultiHeaderTable columns={stocksToColumns(selectedStocks)} data={stocksToData(selectedStocks)}
                                          onSelect={console.log}/>

                        <div>
                            <p>Select an indicator to analyze</p>
                            <Dropdown options={Object.keys(endpoints.indicators)}
                                      onOptionChange={setSelectedIndicator}/>
                            <p>Select a column to analyze</p>
                            {/*Cant use setSelectedColumn because has to select one of possible columns, use lambda function*/}
                            <Dropdown options={Object.keys(selectedStocks[0])}
                                      onOptionChange={(option) => setSelectedColumn(strToKey(option))}/>
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
                                                y: graphData,
                                                name: stock.Ticker
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
