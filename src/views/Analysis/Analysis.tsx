import React, {useState} from 'react';

import { TagFilter } from "../../stories/filters/TagFilter/TagFilter";
import { ScatterGraph } from "../../stories/graphs/ScatterGraph";

// Define custom stock data type

interface Stock {
    symbol: string;
    name: string;
    x: number[];
    y: number[];
    format: string;
}

const Analysis: React.FC = () => {
    const [stocks, _] = useState<Stock[]>([
        {
            symbol: 'AAPL',
            name: 'Apple',
            x: [1, 2, 3, 4, 5],
            y: [2, 5, 7, 9, 10],
            format: 'lines+markers'
        },
        {
            symbol: 'MSFT',
            name: 'Microsoft',
            x: [1, 2, 3, 4, 5],
            y: [1, 2, 3, 4, 5],
            format: 'lines+markers'
        }
        ]);

    const [selectedStocks, setSelectedStocks] = useState<string[]>([]);

    const onTagsChange = (selectedStocks: string[]) => {

        if (selectedStocks.length === 0) {
            setSelectedStocks(stocks.map(stock => stock.symbol));
            return;
        }
        setSelectedStocks(selectedStocks);
    }


    return (
        <div>
            <h1>Analysis</h1>
            <div>
                <TagFilter availableTags={stocks.map(stock => stock.symbol)} onTagsChange={onTagsChange} />
            </div>
            <div>
                <ScatterGraph data={stocks.filter(stock => selectedStocks.includes(stock.symbol))} />
            </div>
        </div>
    )
}


export default Analysis;
