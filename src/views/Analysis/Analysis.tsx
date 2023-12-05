import React, {useState} from 'react';

import {TagFilter} from "../../stories/filters/TagFilter/TagFilter";
import {Dropdown} from "../../stories/selectors/Dropdown.tsx";
import {LoadingOverlay} from "../../components/LoadingOverlay/LoadingOverlay.tsx";
import {Table} from "../../components/Table/Table.tsx";
import {ScatterGraph} from "../../stories/graphs/ScatterGraph.tsx";

import jsonData from './descriptions.json';

import {Card, Button, Collapse, Accordion} from 'react-bootstrap';
import PacfGraph from "../../PacfGraph/PacfGraph.tsx";

/*
    Interface for stocks
    Stocks is a dictionary of
    {
        ticker: string: {
            "bars": number[] or number[][]
            "dates": string[]
        }
    }
 */
interface Stocks {
    [key: string]: {
        [key: string]: number[]
    } | {
        [key: string]: number[][]
    }
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
const formatGraphData = (data: Stocks, index: string[], i?: number) => {
    let graphData: { x: string[]; y: number[]; name: string; mode: string; type: string; }[] = [];

    // Index data[ticker]["bars"] if i is undefined
    // else  data[ticker]["bars"] and all rows, but only the ith column
    Object.keys(data).forEach((ticker) => {
        graphData.push({
            x: index,
            y: i === undefined ? data[ticker]['bars'] : data[ticker]['bars'].map((row) => row[i]),
            name: ticker,
            mode: 'markers',
            type: 'scatter'
        })
    });

    return graphData;
}

const formatGraph = (data: number[]) => {
    let graph: { x: string[]; y: number[]; name: string; mode: string; type: string; }[] = [];
    let index = [...Array(data.length).keys()].map((i) => String(i));

    graph.push({
        x: index,
        y: data,
        name: "Trend",
        mode: 'markers',
        type: 'scatter'
    })

    return graph;
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
        diff: "Differentiation",
        detrend: "Detrending"
    }
}


const default_url = "http://localhost:8000";

const Analysis: React.FC = () => {
    const [selectedFields, setSelectedFields] = useState<string[]>(['close']);
    const [selectedIndicator, setSelectedIndicator] = useState<string>("value");
    const [selectedOperations, setSelectedOperations] = useState<string[]>(["value"]);
    const [loading, setLoading] = useState(true);

    const [tickers, setTickers] = useState<string[]>([]);
    const [selectedTickers, setSelectedTickers] = useState<string[]>([]);

    const [stocks, setStocks] = useState<Stocks>({});
    const [selectedStocks, setSelectedStocks] = useState<Stocks>({});

    const [openStocks, setOpenStocks] = useState<{ [key: string]: boolean }>({});
    const [openStocks2, setOpenStocks2] = useState<{ [key: string]: boolean }>({});

    const [analysis, setAnalysis] = useState<Analysis>({});
    const [autocorrelation, setAutocorrelation] = useState<any>({});
    const [autocorrelationRange, setAutocorrelationRange] = useState<number>(15);
    const [seasonality, setSeasonality] = useState<any>({});
    const [seasonalityPeriod, setSeasonalityPeriod] = useState<number>(30);

    const [forecast, setForecast] = useState<any>({});
    const [forecastPeriod, setForecastPeriod] = useState<number>(30);
    const [parameters, setParameters] = useState<any>({});

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

    const fetchAutoCorrelation = async () => {
        try {
            setLoading(true);
            const response = await fetch(default_url + '/autocorrelation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "tickers": selectedTickers,
                    "fields": selectedFields,
                    "range": autocorrelationRange + 1
                }),
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch stocks:', error);
        } finally {
            setLoading(false);
        }
    }

    const fetchSeasonality = async () => {
        try {
            setLoading(true);
            const response = await fetch(default_url + '/decompose', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "tickers": selectedTickers,
                    "fields": selectedFields,
                    "period": seasonalityPeriod
                }),
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch stocks:', error);
        } finally {
            setLoading(false);
        }
    }

    const fetchForecast = async () => {
        try {
            setLoading(true);
            const response = await fetch(default_url + '/arima', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "tickers": selectedTickers,
                    "end": forecastPeriod,
                    "p": parameters["p"],
                    "d": parameters["d"],
                    "q": parameters["q"],
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
        fetchAutoCorrelation().then((data) => {
            setAutocorrelation(data);
        });
    }, [autocorrelationRange, selectedFields, selectedStocks]);

    React.useEffect(() => {
        fetchSeasonality().then((data) => {
            setSeasonality(data);
        });
    }, [seasonalityPeriod, selectedFields, selectedStocks]);

    React.useEffect(() => {
        fetchTickers().then((data) => {
            setTickers(data);

            fetchStocks().then((data) => {
                setStocks(data);
            });
        });
    }, []);

    React.useEffect(() => {
        setAnalysis({});
        if (selectedTickers.length > 0 && selectedFields.length > 0 && selectedIndicator !== "" && selectedOperations.length > 0) {
            fetchAnalysis().then((data) => {
                setAnalysis(data);
            });
        }
    }, [selectedTickers, selectedFields, selectedIndicator, selectedOperations]);

    React.useEffect(() => {
        setForecast({});
        if (selectedTickers.length > 0 && selectedFields.length > 0 && selectedOperations.length > 0) {
            fetchForecast().then((data) => {
                setForecast(data);
            });
        }
    }, [selectedTickers, selectedFields, selectedOperations, parameters]);

    const onFilterChange = (selectedTickers: string[]) => {
        let filteredTickers = tickers.filter((ticker) => selectedTickers.includes(ticker));

        let filteredStocks: Stocks = {};
        filteredTickers.forEach((ticker) => {
            filteredStocks[ticker] = stocks[ticker];
        });

        setSelectedTickers(filteredTickers);
        setSelectedStocks(filteredStocks);
    }


    const toggleOpen = (ticker: string) => {
        setOpenStocks(prevOpenStocks => ({
            ...prevOpenStocks,
            [ticker]: !prevOpenStocks[ticker]
        }));
    };

    const toggleOpen2 = (ticker: string) => {
        setOpenStocks2(prevOpenStocks => ({
            ...prevOpenStocks,
            [ticker]: !prevOpenStocks[ticker]
        }));
    };

    return (
        <div style={{"margin": "auto", "width": "95%", "padding": "22px"}}>
            {loading && <LoadingOverlay/>}
            <h1>Analysis</h1>
            <div>
                <Card style={{margin: "30px"}}>
                    <Card.Header><h3>Filter stocks to analyze</h3></Card.Header>
                    <Card.Body>
                        {
                            tickers.length > 0 &&
                            <TagFilter availableTags={tickers} onTagsChange={onFilterChange}/>
                        }
                    </Card.Body>

                </Card>
                {
                    selectedTickers.length > 0 &&
                    <div>
                        {
                            selectedStocks !== undefined &&
                            <Card style={{margin: "30px"}}>
                                <Card.Header><h3>Fetched Stocks:</h3></Card.Header>
                                <Card.Body><p>Click on a stock to see its data</p></Card.Body>
                                {Object.keys(selectedStocks).map((ticker) => (
                                    <Card key={ticker} style={{"margin": "12px"}}>
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
                                        ><Card.Header>
                                            <p style={{"textAlign": "left"}}>{ticker}</p>
                                        </Card.Header>
                                        </Button>
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
                            </Card>
                        }
                        <Card style={{margin: "30px"}}>
                            <Card.Header><h3>Select an Indicator, the desired operations and fields</h3></Card.Header>
                            <Card.Body className={"row"}>
                                <div className={"col-12"}>
                                    <h3>Indicator</h3>
                                    <Dropdown options={Object.keys(available_analysis.indicators)}
                                              onOptionChange={setSelectedIndicator}/>
                                </div>
                                <div className={"col-6"}>
                                    <h3>Operations</h3>
                                    <TagFilter availableTags={Object.keys(available_analysis.operations)}
                                               onTagsChange={setSelectedOperations}/>
                                </div>
                                <div className={"col-6"}>
                                    <h3>Fields</h3>
                                    <TagFilter availableTags={available_fields}
                                               onTagsChange={setSelectedFields}/>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card style={{margin: "30px"}}>
                            <Card.Header><h3>Results</h3></Card.Header>
                            <Card.Body>
                                {
                                    analysis &&
                                    (selectedFields.length === 1
                                            ? Object.keys(analysis).map((indicator) => (
                                                <div className={"row"}>
                                                    <h4>Indicator: {available_analysis.indicators[indicator]}</h4>
                                                    {
                                                        Object.keys(analysis[indicator]).map((operation: string) => (
                                                            <div className={"col-6"}>
                                                                <h5>Operation: {available_analysis.operations[operation]}</h5>
                                                                <p>Description: {jsonData[indicator][operation]}</p>
                                                                {
                                                                    <ScatterGraph data={formatGraphData(
                                                                        analysis[indicator][operation],
                                                                        selectedStocks[Object.keys(selectedStocks)[0]]["dates"])}/>
                                                                }
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ))
                                            : <Accordion defaultActiveKey="0">
                                                {selectedFields.map((field: string, i: number) => (
                                                    <Accordion.Item eventKey={String(i)} key={i}>
                                                        <Accordion.Header>{field}</Accordion.Header>
                                                        <Accordion.Body>
                                                            <div className={"row"}>
                                                                {Object.keys(analysis).map((indicator) => (
                                                                    <div key={indicator} className={"col-6"}>
                                                                        <h5>{indicator}</h5>
                                                                        {Object.keys(analysis[indicator]).map((operation: string) => (
                                                                            <div key={operation}>
                                                                                <h6>{operation}</h6>
                                                                                <ScatterGraph data={formatGraphData(
                                                                                    analysis[indicator][operation],
                                                                                    selectedStocks[Object.keys(selectedStocks)[0]]["dates"],
                                                                                    i
                                                                                )}/>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                ))}
                                            </Accordion>
                                    )
                                }
                            </Card.Body>
                        </Card>
                        <Card style={{margin: "30px"}}>
                            <Card.Header>
                                <h3>Autocorrelation, Seasonality and Forecast</h3>
                            </Card.Header>
                            <Card.Body>
                                <input type={"number"} placeholder={"Autocorrelation range"} onChange={(e) => {
                                    setAutocorrelationRange(Number(e.target.value));
                                }}/>
                                <input type={"number"} placeholder={"Seasonality decomposition period"}
                                       onChange={(e) => {
                                           setSeasonalityPeriod(Number(e.target.value));
                                       }}/>
                                <input type={"number"} placeholder={"Forecast period"} onChange={(e) => {
                                    setForecastPeriod(Number(e.target.value));
                                }}/>

                                <div>
                                    <h3>Set ARIMA p, q and d</h3>
                                    <input type={"number"} placeholder={"p"} onChange={(e) => {
                                        setParameters({...parameters, "p": Number(e.target.value)});
                                    }}/>
                                    <input type={"number"} placeholder={"d"} onChange={(e) => {
                                        setParameters({...parameters, "d": Number(e.target.value)});
                                    }}/>
                                    <input type={"number"} placeholder={"q"} onChange={(e) => {
                                        setParameters({...parameters, "q": Number(e.target.value)});
                                    }}/>
                                </div>
                                {/* For each stock, make the same as the previous stock show accordion */}
                                {/* But now show the PACF graph + seasonality trend, seasonality and residual */}

                                {Object.keys(selectedStocks).map((ticker) => (
                                    <Card key={ticker + "-corr"} style={{"margin": "12px"}}>
                                        <Button
                                            variant="link"
                                            className="p-0 align-baseline"
                                            onClick={() => toggleOpen2(ticker)}
                                            aria-controls={`collapse-${ticker}`}
                                            aria-expanded={openStocks2[ticker]}
                                            style={{
                                                textDecoration: 'none',
                                                boxShadow: 'none',
                                                color: 'black'
                                            }}
                                        ><Card.Header>
                                            <p style={{"textAlign": "left"}}>{ticker}</p>
                                        </Card.Header>
                                        </Button>
                                        {
                                            selectedStocks[ticker] !== undefined &&
                                            selectedStocks[ticker]["dates"] !== undefined &&
                                            selectedStocks[ticker]["bars"] !== undefined &&
                                            <Collapse in={openStocks2[ticker]}>
                                                <div id={`collapse-${ticker}`}>
                                                    <Card.Body>
                                                        {
                                                            seasonality[ticker] &&
                                                            <div className={"row"}>
                                                                <div className={"col-12"}>
                                                                    Do note that financial series are
                                                                    intrinsically non-sazonal,
                                                                    so use the seasonality decomposition with
                                                                    caution.
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <h5>Trend</h5>
                                                                    {
                                                                        seasonality[ticker]["trend"] &&
                                                                        <ScatterGraph data={formatGraph(
                                                                            seasonality[ticker]["trend"])}/>
                                                                    }
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <h5>Seasonality</h5>
                                                                    {
                                                                        seasonality[ticker]["seasonal"] &&
                                                                        <ScatterGraph data={formatGraph(
                                                                            seasonality[ticker]["seasonal"])}/>
                                                                    }
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <h5>Residual</h5>
                                                                    {
                                                                        seasonality[ticker]["residual"] &&
                                                                        <ScatterGraph data={formatGraph(
                                                                            seasonality[ticker]["residual"])}/>
                                                                    }
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <h5>Autocorrelation</h5>
                                                                    <PacfGraph
                                                                        pacfValues={autocorrelation["pacf"][ticker]}
                                                                        labels={[...Array(autocorrelationRange).keys()]}/>
                                                                </div>
                                                            </div>
                                                        }
                                                        {
                                                            forecast[ticker] &&
                                                            <div className={"row"}>
                                                                <div className={"col-12"}>
                                                                    <h5>Forecast</h5>
                                                                    {/* Plot predictions on top of real values */}
                                                                    <ScatterGraph data={formatGraph(
                                                                        forecast[ticker]["forecast"]["predictions"])}/>
                                                                    <ScatterGraph data={formatGraph(
                                                                        forecast[ticker]["forecast"]["values"])}/>
                                                                </div>
                                                                <div className={"col-12"}>
                                                                    <h5>Forecast Residuals</h5>
                                                                    <ScatterGraph data={formatGraph(
                                                                        forecast[ticker]["residuals"])}/>
                                                                </div>
                                                                <p>Error (MAE): {forecast[ticker]["error"]}</p>
                                                            </div>
                                                        }
                                                    </Card.Body>
                                                </div>
                                            </Collapse>
                                        }
                                    </Card>
                                ))}
                            </Card.Body>
                        </Card>

                    </div>
                }
            </div>
        </div>
    )
}


export default Analysis;
