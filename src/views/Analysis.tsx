import React from 'react';

class Analysis extends React.Component {
    render() {
        return (
            <div style={{ width: '100%', height: 'calc(100vh - 193px)' }}>
                <iframe
                    src="series-temporais/output.html"
                    style={{ width: '100%', height: '100%' }}
                    title="Embedded HTML"
                />
            </div>
        );
    }
}

export default Analysis;
