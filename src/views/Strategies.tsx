import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";

import axios from 'axios';

import config from '../config';
import styles from './Strategies.module.css';
import SecurityGraph from "../components/SecurityGraph";
import PortfolioComponent, {Portfolio} from "../components/Portfolio";


interface Strategy {
    route: string,
    name: string,
}

interface StrategyEndpoint {
    route: string,
    description: string,
}



interface History {
    df : {
        columns: [string[], string[]];
        index: string[];
        data: number[][];
    }
}

const Strategies: React.FC = () => {
    const [availableStrategies, setAvailableStrategies] = useState<Strategy[]>([]);
    const [selectedStrategy, setSelectedStrategies] = useState<Strategy | null>(null);

    const [availableEndpoints, setAvailableEndpoints] = useState<{
        [endpoint: string]: {
            [method: string]: StrategyEndpoint
        }
    }>({});

    const [portfolios, setPortfolios] = useState<{[key: string]: Portfolio}>({});
    const [history, setHistory] = useState<History | null>(null);

    const [amountInput, setAmountInput] = useState<number | string>("");

    const strategyRoute = `${config.apiBaseUrl}/strategy/`

    useEffect(() => {
        fetchStrategies();
    }, []);

    const endpointMethodCombinations = availableEndpoints
        ? Object.entries(availableEndpoints).flatMap(([endpointName, methods]) =>
            Object.keys(methods).map(method => ({ endpointName, method }))
        )
        : [];

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmountInput(event.target.value);
    };

    const handleAddCash = async () => {
        if (selectedStrategy === null) {
            return
        }
        await axios.post(
            strategyRoute + selectedStrategy.name + "/add_cash/",
            { amount: parseFloat(amountInput.toString()) }
        ).then(response => {
            if (response.status === 200) {
                console.log(parseFloat(amountInput.toString()))
                fetchPortfolio();

            }
        }).catch(error => {
            parseFloat(amountInput.toString());
            if (error.response && error.response.data && error.response.data.detail) {
                alert(error.response.data.detail);
            } else {
                console.error("An error occurred:", error);
            }
        });
    };

    const handleStrategySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const strategy_name = event.target.value;

        if (availableStrategies === null || strategy_name === "") {
            return;
        }

        setSelectedStrategies(availableStrategies.find(strategy => strategy.name === strategy_name) || null);
    };

    const fetchStrategies = async () => {
        try {
            axios.get(strategyRoute).then(response => {
                if (response.status === 200) {
                    const strategies: Strategy[] = response.data['available'];
                    setAvailableStrategies(strategies);
                }
            })
        } catch (error) {
            console.error('Error fetching model options:', error);
        }
    };

    const fetchPortfolio = async (strategy_route: string | null = null) => {
        if (strategy_route === null) {
            if (selectedStrategy === null)
                return;
            strategy_route = selectedStrategy.route;
        }

        axios.get(strategyRoute + strategy_route + "/portfolios/")
            .then(response => {
                console.log(response.data);
                if (response.status === 200) {
                    if (response.data) {
                        const portfolios: {[key: string]: Portfolio} = response.data;
                        setPortfolios(portfolios);
                    }
                }
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.detail) {
                    alert(error.response.data.detail);
                } else {
                    console.error("An error occurred:", error);
                }
            });
    };

    useEffect(() => {
        if (selectedStrategy !== null) {
            const intervalId = setInterval(fetchPortfolio, 5000); // Poll every 5 seconds (adjust as needed)

            return () => {
                clearInterval(intervalId); // Cleanup on component unmount
            };
        } else {
            setPortfolios({});
        }
    }, [selectedStrategy]);

    const fetchHistory = async (strategy_route: string | null = null) => {
        if (strategy_route === null) {
            if (selectedStrategy === null)
                return;
            strategy_route = selectedStrategy.route;
        }

        axios.get(strategyRoute + strategy_route + "/history/")
            .then(response => {
                if (response.status === 200) {
                    if (response.data)
                        setHistory(response.data);
                }
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.detail) {
                    alert(error.response.data.detail);
                } else {
                    console.error("An error occurred:", error);
                }
            });
    };

    useEffect(() => {
        if (selectedStrategy !== null) {
            const intervalId = setInterval(fetchHistory, 5000); // Poll every 5 seconds (adjust as needed)

            return () => {
                clearInterval(intervalId); // Cleanup on component unmount
            };
        } else {
            setHistory(null);
        }
    }, [selectedStrategy]);

    const fetchEndpoints = async (strategy_route: string | null = null) => {
        if (strategy_route === null) {
            if (selectedStrategy === null)
                return;
            strategy_route = selectedStrategy.route;
        }

        axios.get(strategyRoute + strategy_route)
            .then(response => {
                if (response.status === 200) {
                    const available_endpoints = response.data;

                    if (available_endpoints)
                        setAvailableEndpoints(available_endpoints);
                }
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.detail) {
                    alert(error.response.data.detail);
                } else {
                    console.error("An error occurred:", error);
                }
            });
    };

    useEffect(() => {
        if (selectedStrategy !== null) {
            fetchEndpoints();
        } else {
            setAvailableEndpoints({});
        }
    }, [selectedStrategy]);

    return (
        <div className={styles.containerStrategies}>
            <Helmet>
                <title>Strategies - Delphos</title>
            </Helmet>
            <header className={styles.strategyHeader}>
                <h1>Strategies Explorer</h1>
                <p>Deep dive into the quantitative models, adjust parameters, and visualize results on-the-fly.</p>
            </header>

            <div className={styles.managerDropdownContainer}>
                <select id="managerDropdown" className={styles.managerDropdown} onChange={handleStrategySelect}>
                    <option value="">Select a model...</option>
                    {Object.entries(availableStrategies).map(([_, strategy]) => (
                        <option key={strategy.name} value={strategy.name}>
                            {strategy.name}
                        </option>
                    ))}
                </select>

                <p className={styles.selectedManagerDisplay}>
                    Selected
                    Strategy: {selectedStrategy !== null ? selectedStrategy.name + " " + selectedStrategy.route : 'None'}
                </p>
            </div>

            <section className={styles.availableMethods}>
                <h2 className={styles.sectionHeading}>Available Methods</h2>
                <div className={styles.methodContainer}>
                    {endpointMethodCombinations.map(({ endpointName, method }) => (
                        <p key={`${endpointName}-${method}`} className={styles.methodText}>
                            {`${endpointName} ${method}`}
                        </p>
                    ))}
                </div>
            </section>

            <section className={styles.addCash}>
                <h2 className={styles.sectionHeading}>Add Cash</h2>
                <div className={styles.addCashInput}>
                    <input
                        type="number"
                        value={amountInput}
                        onChange={handleAmountChange}
                        placeholder="Enter amount"
                        className={styles.amountInput}
                    />
                    <button onClick={handleAddCash} className={styles.addCashButton}>Add Cash</button>
                </div>
            </section>

            <section className={styles.portfolioSection}>
                <h2 className={styles.sectionHeading}>Portfolios</h2>
                <div className={styles.portfolioList}>
                    {Object.entries(portfolios).map(([_, portfolio]) => (
                        <PortfolioComponent key={portfolio.name} portfolio={portfolio} />
                    ))}
                </div>
            </section>

            {/* Interactive Plot Section */}
            <section >
                <h2>Visualizations</h2>
                {history && (
                    <div className={styles.interactivePlots}>
                        <SecurityGraph
                            data={history.df}
                            title="Historical Asset Values"
                            xTitle="Timestamp"
                            yTitle="Asset Value"
                            width={window.innerWidth - 40}
                            selectedColumns={["Close"]}
                        />
                    </div>
                )}
            </section>

            {/* Model Insights/Logs Section */}
            <section className="model-insights">
                <h2>Model Insights</h2>
                <textarea readOnly id="modelLogs" rows={10}>
                    {/* Model insights content */}
                </textarea>
            </section>

            {/* Footer or Additional Info */}
            <footer className="strategy-footer">
                <p>For further assistance or inquiries, contact our team <a href="/contact">here</a>.</p>
            </footer>
        </div>
    );
};

export default Strategies;
