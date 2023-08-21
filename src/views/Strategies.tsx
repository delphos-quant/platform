import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";

import Plot from 'react-plotly.js';
import axios from 'axios';

import config from '../config';
import styles from './Strategies.module.css';


interface Manager {
    route: string,
    status: string,
}

interface ManagerEndpoint {
    route: string,
    description: string,
}

interface Portfolio {
    name: string;
    current_cash: number;
    current_value: number;
    current_assets: {
        [asset: string]: number
    };
}

interface History {
    [asset: string]: {
        [timestamp: string]: number
    };
}

const Strategies: React.FC = () => {
    const [availableManagers, setAvailableManagers] = useState<{
        [key: string]: Manager
    }>({});
    const [selectedManager, setSelectedManagers] = useState<{
        name: string,
        manager: Manager
    } | null>(null);

    const [availableManagerEndpoints, setAvailableManagerEndpoints] = useState<{
        [endpoint: string]: {
            [method: string]: ManagerEndpoint
        }
    }>({});

    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [history, setHistory] = useState<History | null>(null);
    const [showHistory, setShowHistory] = useState(0);

    const [amountInput, setAmountInput] = useState<number | string>("");

    const strategyManagerRoute = `${config.apiBaseUrl}/managers/`

    useEffect(() => {
        fetchAvailableManagers();
    }, []);

    const endpointMethodCombinations = availableManagerEndpoints
        ? Object.entries(availableManagerEndpoints).flatMap(([endpointName, methods]) =>
            Object.keys(methods).map(method => ({ endpointName, method }))
        )
        : [];

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmountInput(event.target.value);
    };

    const handleAddCash = async () => {
        if (selectedManager === null) {
            return
        }
        await axios.post(
            strategyManagerRoute + selectedManager.name + "/add_cash/",
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

    const handleManagerSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const manager_name = event.target.value;

        if (availableManagers === null || manager_name === "") {
            return;
        }

        setSelectedManagers({ name: manager_name, manager: availableManagers[manager_name] });
    };

    const fetchAvailableManagers = async () => {
        try {
            axios.get(strategyManagerRoute).then(response => {
                if (response.status === 200) {
                    const available_managers: {
                        [key: string]: Manager
                    } = response.data['available'];
                    setAvailableManagers(available_managers);
                }
            })
        } catch (error) {
            console.error('Error fetching model options:', error);
        }
    };

    const fetchPortfolio = async (manager_name: string | null = null) => {
        if (manager_name === null && selectedManager !== null) {
            manager_name = selectedManager.name;
        }

        axios.get(strategyManagerRoute + manager_name + "/portfolio/")
            .then(response => {
                if (response.status === 200) {
                    setPortfolio(response.data);
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
        if (selectedManager !== null && selectedManager.manager.status === "available") {
            fetchPortfolio();
        } else {
            setPortfolio(null);
        }
    }, [selectedManager]);

    const fetchHistory = async (manager_name: string | null = null) => {
        if (manager_name === null && selectedManager !== null) {
            manager_name = selectedManager.name;
        }

        axios.get(strategyManagerRoute + manager_name + "/history/")
            .then(response => {
                if (response.status === 200) {
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
        if (selectedManager !== null && selectedManager.manager.status === "available") {
            fetchHistory();
        } else {
            setHistory(null);
        }
    }, [selectedManager]);

    const fetchAvailableEndpoints = async (manager_name: string | null = null) => {
        if (manager_name === null && selectedManager !== null) {
            manager_name = selectedManager.name;
        }

        axios.get(strategyManagerRoute + manager_name)
            .then(response => {
                if (response.status === 200) {
                    const available_endpoints = response.data;
                    setAvailableManagerEndpoints(available_endpoints);
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
        if (selectedManager !== null && selectedManager.manager.status === "available") {
            fetchAvailableEndpoints();
        } else {
            setAvailableManagerEndpoints({});
        }
    }, [selectedManager]);

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
                <select id="managerDropdown" className={styles.managerDropdown} onChange={handleManagerSelect}>
                    <option value="">Select a model...</option>
                    {Object.entries(availableManagers).map(([modelName, Model]) => (
                        <option key={modelName} value={modelName}>
                            {modelName}
                        </option>
                    ))}
                </select>

                <p className={styles.selectedManagerDisplay}>
                    Selected
                    Model: {selectedManager !== null ? selectedManager.name + " " + selectedManager.manager.route : 'None'}
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

            <section className={styles.portfolio}>
                <h2 className={styles.sectionHeading}>Portfolio</h2>
                {portfolio && (
                    <div className={styles.portfolioInfo}>
                        <p className={styles.portfolioLabel}>Current Cash: $ {portfolio.current_cash.toFixed(2)}</p>
                        <p className={styles.portfolioLabel}>Current Asset value: $ {portfolio.current_value.toFixed(2)}</p>
                        <p className={styles.portfolioLabel}>Current Assets:</p>
                        <ul className={styles.assetList}>
                            {Object.entries(portfolio.current_assets).map(([asset, value]) => (
                                <li key={asset} className={styles.assetItem}>
                                    {asset}: {value.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            <section className={styles.history}>
                <h2 className={styles.sectionHeading}>History</h2>
                {history && (
                    <div className={styles.historyTableContainer}>
                        <table className={styles.historyTable}>
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    {Object.keys(history).map((asset) => (
                                        <th key={asset}>{asset}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(history[Object.keys(history)[0]]).slice(0, showHistory).map((timestamp) => (
                                    <tr key={timestamp}>
                                        <td>{new Date(parseInt(timestamp)).toLocaleDateString()}</td>
                                        {Object.keys(history).map((asset) => (
                                            <td key={asset}>{history[asset][timestamp].toFixed(2)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {Object.keys(history[Object.keys(history)[0]]).length > showHistory && (
                            <button onClick={() => setShowHistory(showHistory + 10)} className={styles.showMoreButton}>
                                Show More
                            </button>
                        )}
                    </div>
                )}
            </section>

            {/* Interactive Plot Section */}
            <section >
                <h2>Visualizations</h2>
                {history && (
                    <div className={styles.interactivePlots}>
                        <Plot
                            data={Object.keys(history).map((asset) => ({
                                type: 'scatter',
                                mode: 'lines',
                                name: asset,
                                x: Object.keys(history[asset]),
                                y: Object.values(history[asset]),
                            }))}
                            layout={{
                                title: 'Historical Asset Values',
                                xaxis: { title: 'Timestamp' },
                                yaxis: { title: 'Asset Value' },
                                width: window.innerWidth - 40
                            }}

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
