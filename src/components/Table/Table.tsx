import React, {useState} from 'react';
import {Dropdown} from "../../stories/selectors/Dropdown.tsx";

// Assuming you have a Dropdown component

// Define a specific type for the keys that will be used to index the stock data
type StockDataKey = 'Close' | 'Open' | 'High' | 'Low' | 'Volume';

// Stock interface with specific keys
interface Stock {
    Symbol: string;
    Close: number[];
    Open: number[];
    High: number[];
    Low: number[];
    Volume: number[];
    Format: string;
}

interface TableProps {
    stocks: Stock[];
    indexes: number[]; // Assuming indexes is an array of numbers
    onChange: (option: StockDataKey) => void;
}

export const Table: React.FC<TableProps> = ({stocks, indexes, onChange}) => {
    // Use a union type for the selectedColumn state to restrict it to valid stock data keys
    const [selectedColumn, setSelectedColumn] = useState<StockDataKey>('Close');

    // Function to handle the dropdown option change
    const handleOptionChange = (option: any) => {
        setSelectedColumn(option);
        onChange(option);
    }

    return (
        <div>
            <Dropdown
                options={['Close', 'Open', 'High', 'Low', 'Volume']}
                onOptionChange={handleOptionChange}
            />

            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    {stocks.map((stock, idx) => (
                        <th key={idx}>{stock.Symbol}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {indexes.map((index, rowIdx) => (
                    <tr key={rowIdx}>
                        <td>{index}</td>
                        {stocks.map((stock, colIdx) => (
                            <td key={colIdx}>{stock[selectedColumn][index]}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
