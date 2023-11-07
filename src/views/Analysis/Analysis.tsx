import React, {useState} from 'react';

import {TagFilter} from "../../stories/filters/TagFilter/TagFilter";
import {ScatterGraph} from "../../stories/graphs/ScatterGraph";
import {Dropdown} from "../../stories/selectors/Dropdown.tsx";
import {LoadingOverlay} from "../../components/LoadingOverlay/LoadingOverlay.tsx";
import {Table} from "../../components/Table/Table.tsx";

import {CSVLink} from 'react-csv';
import style from './Analysis.module.scss';
// Define custom stock data type

type StockDataKey = 'Close' | 'Open' | 'High' | 'Low' | 'Volume';

interface Stock {
    Symbol: string;
    Close: number[];
    Open: number[];
    High: number[];
    Low: number[];
    Volume: number[];
    Format: string;
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
        <div>
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
                        <CSVLink className={style["button-export"]} data={selectedStocks}>Export to CSV</CSVLink>
                        <Table stocks={selectedStocks} indexes={range(0, selectedStocks[0].Close.length)}
                               onChange={setSelectedColumn}/>
                        <Dropdown options={Object.keys(endpoints.indicators)} onOptionChange={setSelectedIndicator}/>
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
