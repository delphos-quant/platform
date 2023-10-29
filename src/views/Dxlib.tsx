import React from 'react';


class Dxlib extends React.Component {
    render() {
        return <div>
            <div>
                <h1 id="quantitative-analysis-library">Quantitative Analysis library</h1>
                <p>This library contains basic methods, interfaces, and integration calls for statistical tools, as well
                    as data gathering functions.</p>

                <h2 id="installation">Installation</h2>
                <p>Use the package manager <a href="https://pip.pypa.io/en/stable/">pip</a> to install dxlib.</p>
                <pre><code className="lang-bash">pip install dxlib</code></pre>

                <h2 id="quickstart">Quickstart</h2>

                <h3 id="research-module">Research Module</h3>
                <pre><code className="lang-python">{`from dxlib import finite_differences

import numpy as np
import matplotlib.pyplot as plt

x = np.arange(-3, 3, 0.1)
y = np.tanh(x)

dy = finite_differences(x, y)
plt.plot(x, dy)
plt.show();
`}</code></pre>

                <h3 id="simulation-module">Simulation Module</h3>
                <p>[Note: The Simulation Module's example needs to be provided]</p>

                <h3 id="trading-module">Trading Module</h3>
                <pre><code className="lang-python">{`from dxlib.models import trading

features, labels = trading.prepare_data(data)
train, test = trading.train_test_split(features, labels, 0.5)
clf = trading.train_model(train["x"], train["y"])
y_pred = trading.predict_model(clf, features)
pred_changes, returns = trading.simulate_trade_allocation(y_pred, basis);
console.log(\`Predicted changes: \${pred_changes}, \\nReturns: \${returns}\`);
`}</code></pre>

                <h3 id="api-module">API Module</h3>
                <pre><code className="lang-python">{`from dxlib.api import AlphaVantageAPI as av

console.log("Realtime exchange rates from the last 5 minutes:");

const alpha_vantage = new av("<api_key>");

for (let i = 0; i < 5; i++) {
  const currencies_to_query = ['JPY', 'EUR', 'GBP', 'CAD', 'AUD'];
  const exchange_rates_df = alpha_vantage.fetch_currency_exchange_rates(currencies_to_query);
  console.log(exchange_rates_df);
  await new Promise((resolve) => setTimeout(resolve, 60000));
}
`}</code></pre>

                <h3 id="data-module">Data Module</h3>
                <p>...</p>

                <h2 id="contribution">Contribution</h2>
                <p>Contributions are welcome! If you're interested in contributing, feel free to fork the repository and
                    submit a pull request. Please make sure to test the changes thoroughly. We're looking forward to
                    your enhancements!</p>
            </div>
        </div>;
    }
}

export default Dxlib;
