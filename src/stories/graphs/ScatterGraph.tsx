import React from 'react';
import Plot from 'react-plotly.js';

/**
 * Props for the ScatterGraph component.
 */
interface ScatterGraphProps {
    /**
     * Data for the scatter plot. Should be an array of objects with x and y values.
     */
    data: any[];
    /**
     * Layout options for the scatter plot.
     */
    layout?: object | any;
    /**
     * Configuration options for the scatter plot.
     */
    config?: object;

    /**
     * Control connecting the dots with lines
     * }
     */
    lines?: boolean;
}

/**
 * A React component for rendering a scatter plot using Plotly.
 *
 * @param data - Data for the scatter plot.
 * @param layout - Layout options for the scatter plot.
 * @param config - Configuration options for the scatter plot.
 * @param lines - Control connecting the dots with lines
 */
export const ScatterGraph: React.FC<ScatterGraphProps> = ({ data, layout, config, lines }) => {
    // Set the mode based on the connectDots argument
    const mode = lines ? 'lines+markers' : 'markers';

    // Rest of your component code
    return (
        <Plot
            data={data.map(item => ({ ...item, mode }))}
            layout={layout}
            config={config}
        />
    );
};