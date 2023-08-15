import React from 'react';
import styles from './styles.module.css'; // Import your CSS module

const Home: React.FC = () => {
    return (
        <>
            <div className="card">
                <h1 className="site-title">Plataforma Interativa para Modelos Quantitativos</h1>
                <p className="subtitle">Explore, develop, and deploy advanced quantitative models with our intuitive
                    platform. Dive into our extensive documentation and real-time dashboards. Check out our open-source
                    repository on <a href="https://github.com/delphos/platform">Github</a>.</p>
                <a href="/strategies" className="dash-link">
                    <span>Go to the Dashboard</span>
                    <i className="fas fa-arrow-right"></i>
                </a>
            </div>

            {/* Featured Analysis */}
            <section className="featured-analysis">
                <h2>Featured Analysis</h2>
                <div className="analysis-content">
                    <p>Recent analysis indicates a bullish trend for stock X, thanks to positive earnings growth and a
                        stable geopolitical environment. See our in-depth report <a href="/analysis">here</a>.</p>
                </div>
            </section>

            {/* Quick Strategy Overview */}
            <section className="strategy-overview">
                <h2>Recent Strategies Deployed</h2>
                <div className="strategy-list">
                    <p>1. Strategy A - Focused on exploiting short-term price discrepancies in tech stocks.</p>
                    <p>2. Strategy B - Targeting undervalued emerging market assets with low volatility.</p>
                </div>
            </section>

            {/* Introduction to dxlib */}
            <section className="dxlib-introduction">
                <h2>Introducing 'dxlib' - Our In-house Quantitative Analysis Library</h2>
                <p>Our proprietary 'dxlib' provides powerful tools and methods for statistical analysis, data gathering,
                    and more. Here's a quick example of how easy it is to compute finite differences:</p>
                <pre><code className="lang-python">{`
from dxlib import finite_differences
import numpy as np
import matplotlib.pyplot as plt

x = np.arange(-3, 3, 0.1);
y = np.tanh(x);
dy = finite_differences(x, y);
plt.plot(x, dy);
plt.show();
                `}</code></pre>
                <p>Explore the full capabilities of 'dxlib' in our comprehensive <a href="/dxlib">documentation</a>.</p>
            </section>

            {/* Latest Financial News */}
            <section className="financial-news">
                <h2>Latest Financial News</h2>
                <ul className="news-list">
                    <li><strong>Aug 10, 2023</strong>: The US Federal Reserve hinted at an interest rate hike in the
                        coming months.
                    </li>
                    <li><strong>Aug 9, 2023</strong>: Tech stocks surge as quarterly earnings surpass expectations.
                        Major indices show a 2% rise.
                    </li>
                </ul>
                <a href="/news">See all news &rarr;</a>
            </section>
        </>
    );
};

export default Home;
