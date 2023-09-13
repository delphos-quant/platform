import React from 'react';


interface Portfolio {
    name: string;
    current_cash: number;
    current_assets: {
        [asset: string]: number;
    };
    transaction_history: Transaction[];
}

interface Transaction {
    security: string;
    trade_type: string;
    quantity: number;
    price: number;
    timestamp: string | null;
}

interface PortfolioComponentProps {
    portfolio: Portfolio;
}

const PortfolioComponent: React.FC<PortfolioComponentProps> = ({ portfolio }) => {
    return (
        <div className="portfolio">
            <h2>Portfolio: {portfolio.name}</h2>
            <div>
                <strong>Current Cash:</strong> ${portfolio.current_cash.toFixed(2)}
            </div>

            <h3>Current Assets</h3>
            <ul>
                {Object.keys(portfolio.current_assets).map((asset) => (
                    <li key={asset}>
                        {asset}: {portfolio.current_assets[asset]} shares owned;
                    </li>
                ))}
            </ul>

            <h3>Transaction History</h3>
            <table>
                <thead>
                <tr>
                    <th>Security</th>
                    <th>Trade Type</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Timestamp</th>
                </tr>
                </thead>
                <tbody>
                {portfolio.transaction_history.slice(-5).map((transaction: Transaction, index: number | null) => (
                    <tr key={index}>
                        <td>{transaction.security}</td>
                        <td>{transaction.trade_type}</td>
                        <td>{transaction.quantity}</td>
                        <td>${transaction.price.toFixed(2)}</td>
                        <td>{transaction.timestamp || 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PortfolioComponent;
export type { Portfolio };
