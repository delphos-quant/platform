import Plot from 'react-plotly.js';

const PartialAutoCorrelationGraph = ({pacfValues, range}: { pacfValues: number[], range: number[] }) => {
    const trace = {
        x: range,
        y: pacfValues,
        marker: {
            color: 'rgba(55,128,191,0.7)',
            line: {
                color: 'rgba(55,128,191,1.0)',
                width: 2
            }
        }
    };

    const layout = {
        title: 'Partial Autocorrelation Function',
        xaxis: {
            title: 'Lag',
            dtick: 1
        },
        yaxis: {
            title: 'PACF'
        }
    };

    return (
        <Plot
            data={[trace]}
            layout={layout}
            style={{width: '100%', height: '100%'}}
        />
    );
};

export default PartialAutoCorrelationGraph;
