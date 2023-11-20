import React, {useState} from 'react';

import {TagFilter} from "../../stories/filters/TagFilter/TagFilter";
// import {ScatterGraph} from "../../stories/graphs/ScatterGraph";
import {Dropdown} from "../../stories/selectors/Dropdown.tsx";
import {LoadingOverlay} from "../../components/LoadingOverlay/LoadingOverlay.tsx";
import {Table} from "../../components/Table/Table.tsx";
import {Card, Button, Collapse} from 'react-bootstrap';
import {ScatterGraph} from "../../stories/graphs/ScatterGraph.tsx";


const available_analysis = {
    indicators: {
        value: "Value",
        volatility: "Volatility",
        moving_average: "Moving Average",
        bollinger_bands: "Bollinger Bands",
    },
    operations: {
        value: "Value",
        returns: "Returns",
        log_change: "Log Change",
        autocorrelation: "Autocorrelation 15-lags",
        diff: "Differentiation",
        detrend: "Detrending"
    }
}

/*
    Interface for stocks
    Stocks is a dictionary of
    {
        ticker: string: {
            "bars": number[],
            "dates": string[]
        }
    }
 */
interface Stocks {
    [key: string]: {
        [key: string]: any[];
    };
}

/*
    Interface for analysis
    Analysis is a dictionary of
    {
        indicator_name: {
            operation_name: {
                ticker: string: {
                "bars": number[],
                "dates": string[]
            }
        }
    }
 */
interface Analysis {
    [key: string]: {
        [key: string]: {
            [key: string]: {
                [key: string]: number[];
            };
        };
    };
}

const available_fields = [
    "open",
    "high",
    "low",
    "close",
    "volume",
    "vwap",
    "num_trades",
];

const default_url = "http://localhost:8000";

/*
    Create a list of objects for the ScatterGraph component
    return {
            x: index,
            y: data[ticker],
            name: ticker,
            mode: 'markers',
            type: 'scatter'
        }
 */
const formatGraphData = (data: Stocks, index: string[]) => {
    let graphData: { x: string[]; y: number[]; name: string; mode: string; type: string; }[] = [];
    Object.keys(data).forEach((ticker) => {
        graphData.push({
            x: index,
            y: data[ticker]["bars"],
            name: ticker,
            mode: 'markers',
            type: 'scatter'
        })
    });
    return graphData;
}

const Analysis: React.FC = () => {
    const [selectedFields, setSelectedFields] = useState<string[]>(['close']);
    const [selectedIndicator, setSelectedIndicator] = useState<string>("value");
    const [selectedOperations, setSelectedOperations] = useState<string[]>(["value"]);
    const [loading, setLoading] = useState(true);

    const [tickers, setTickers] = useState<string[]>([]);
    const [selectedTickers, setSelectedTickers] = useState<string[]>([]);

    const [stocks, setStocks] = useState<Stocks>({});
    const [selectedStocks, setSelectedStocks] = useState<Stocks>({});

    const [analysis, setAnalysis] = useState<Analysis>({});

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

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const response = await fetch(default_url + "/get", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
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

    const fetchAnalysis = async () => {
        try {
            setLoading(true);
            const response = await fetch(default_url + '/analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "tickers": selectedTickers,
                    "fields": selectedFields,
                    "indicators": [selectedIndicator],
                    "operations": selectedOperations,
                    "params": {}
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
        fetchTickers().then((data) => {
            setTickers(data);

            fetchStocks().then((data) => {
                setStocks(data);
            });
        });
    }, []);

    React.useEffect(() => {
        fetchAnalysis().then((data) => {
            setAnalysis(data);
        });
    }, [selectedTickers, selectedFields, selectedIndicator, selectedOperations]);

    const onFilterChange = (selectedTickers: string[]) => {
        let filteredTickers = tickers.filter((ticker) => selectedTickers.includes(ticker));

        let filteredStocks: Stocks = {};
        filteredTickers.forEach((ticker) => {
            filteredStocks[ticker] = stocks[ticker];
        });

        setSelectedTickers(filteredTickers);
        setSelectedStocks(filteredStocks);
    }

    const [openStocks, setOpenStocks] = useState<{ [key: string]: boolean }>({});

    const toggleOpen = (ticker: string) => {
        setOpenStocks(prevOpenStocks => ({
            ...prevOpenStocks,
            [ticker]: !prevOpenStocks[ticker]
        }));
    };

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
                            selectedStocks !== undefined &&
                            <div>
                                {Object.keys(selectedStocks).map((ticker) => (
                                    <Card key={ticker}>
                                        <Card.Header>
                                            <Button
                                                variant="link"
                                                className="p-0 align-baseline"
                                                onClick={() => toggleOpen(ticker)}
                                                aria-controls={`collapse-${ticker}`}
                                                aria-expanded={openStocks[ticker]}
                                                style={{
                                                    textDecoration: 'none',
                                                    boxShadow: 'none',
                                                    color: 'black'
                                                }}
                                            >
                                                {ticker}
                                            </Button>
                                        </Card.Header>
                                        {
                                            selectedStocks[ticker] !== undefined &&
                                            selectedStocks[ticker]["dates"] !== undefined &&
                                            selectedStocks[ticker]["bars"] !== undefined &&
                                            <Collapse in={openStocks[ticker]}>
                                                <div id={`collapse-${ticker}`}>
                                                    <Card.Body>
                                                        <Table data={selectedStocks[ticker]['bars']}
                                                               columns={available_fields.map((field) =>
                                                                   field.charAt(0).toUpperCase() +
                                                                   field.slice(1).replace("_", " "))}
                                                               index={selectedStocks[ticker]["dates"]}
                                                               index_name={"Date"}/>
                                                    </Card.Body>
                                                </div>
                                            </Collapse>
                                        }
                                    </Card>
                                ))}
                            </div>
                        }
                        <div className={"row"}>
                            <div className={"col-12"}>
                                <h3>Analysis - Select an Indicator to use</h3>
                                <Dropdown options={Object.keys(available_analysis.indicators)}
                                          onOptionChange={setSelectedIndicator}/>
                            </div>
                            <div className={"col-6"}>
                                <h3>Select operations to perform</h3>
                                <TagFilter availableTags={Object.keys(available_analysis.operations)}
                                           onTagsChange={setSelectedOperations}/>
                            </div>
                            <div className={"col-6"}>
                                <h3>Select fields to analyze</h3>
                                <TagFilter availableTags={available_fields}
                                           onTagsChange={setSelectedFields}/>
                            </div>
                        </div>
                        <div>
                            <h3>
                                Results
                            </h3>
                            {
                                analysis !== undefined &&
                                Object.keys(analysis).map((indicator) => (
                                    <div>
                                        <h4>{indicator}</h4>
                                        {
                                            Object.keys(analysis[indicator]).map((operation: string) => (
                                                <div>
                                                    <h5>{operation}</h5>
                                                    {
                                                        <ScatterGraph data={formatGraphData(analysis[indicator][operation], selectedStocks[Object.keys(selectedStocks)[0]]["dates"])} />
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}


export default Analysis;
