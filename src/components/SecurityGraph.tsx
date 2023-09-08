// SecurityGraph.tsx
import React from 'react';
import Plot from 'react-plotly.js';

import {Data} from 'plotly.js';

interface StockGraphProps {
    data: {
        columns: [string[], string[]];
        index: string[];
        data: number[][];
    };
    title: string;
    xTitle: string;
    yTitle: string;
    width: number;
    selectedColumns: string[];
}

function filterData(data: number[][], columns: [string[], string[]], selectedColumns: string[]): number[][] {
    if (columns.length > 0) {
        const selectedColumnIndices = selectedColumns.map((col) => columns[0].indexOf(col));
        return data.map((row) =>
            selectedColumnIndices.map((index) => row[index])
        );
    } else {
        return [];
    }
}

const SecurityGraph: React.FC<StockGraphProps> = ({
                                                      data,
                                                      title,
                                                      xTitle,
                                                      yTitle,
                                                      width,
                                                      selectedColumns,
                                                  }) => {
    const filteredData = filterData(data.data, data.columns, selectedColumns);

    const columnNames = selectedColumns;
    const timestamps = data.index;

    const traces: Data[] = columnNames.map((columnName, index) => ({
        type: 'scatter',
        mode: 'lines',
        name: columnName,
        x: timestamps,
        y: filteredData.map((row) => row[index]),
    }));

    const layout = {
        title,
        xaxis: {title: xTitle},
        yaxis: {title: yTitle},
        width,
    };

    return <Plot data={traces} layout={layout}/>;
};

export default SecurityGraph;
