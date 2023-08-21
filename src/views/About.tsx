import React from 'react';
import styles from './About.module.css';
//import delphosLogo from './delphos-logo.png'; // Import your logo image

class About extends React.Component {
    render() {
        return (
            <div className={styles.aboutpage}>
                <div className={styles.header}>
                    
                    <h1>About Delphos</h1>
                </div>
                <p className={styles.intro}>
                    Welcome to <span className={styles.highlight}>Delphos</span>, your gateway to <span className={styles.highlight}>quantitative analysis</span> in the financial market. Our dedicated team of analysts and researchers is committed to exploring the intricate world of finance.
                </p>
                <h2>About Us: Exploring Quantitative Finance</h2>
                <p>
                Welcome to our group of dedicated university students passionate about quantitative finance. 
                We are a vibrant community of learners, explorers, and future financial analysts, 
                united by our shared interest in understanding the intricate world of quantitative analysis within the realm of finance.
                </p>
                <h2>Our Vision</h2>
                <p>Our vision is simple yet profound: to unravel the complexities of the financial market through the lens of data-driven insights. 
                    In a world where informed decisions can make all the difference, 
                    we recognize the power of quantitative techniques in illuminating hidden patterns, trends, and opportunities that might otherwise go unnoticed.</p>
                
                <h2>What We Do</h2>
                <p>
                Through rigorous research, data analysis, and collaborative discussions, we strive to uncover the underlying dynamics of financial markets. From examining historical trends to developing predictive models, our group delves into the heart of quantitative analysis to gain insights that can guide strategic decisions in investments and trading.
                </p>
                <h2>Join Us</h2>
                <p>
                    If you're passionate about finance, data analysis, and making informed decisions, <span className={styles.highlight}>Delphos</span> is the place for you. Join our community and embark on a journey of discovery in the world of finance.
                </p>
                <p>
                    Connect with us on <a href="https://www.instagram.com/delphos.quant/" >Instagram</a>, attend our workshops and seminars, we , and gain valuable insights from experienced professionals in the field.
                </p>
                <p>
                    Ready to take the next step? <a href="/contact" className={styles.highlightlink}>Contact us</a> to learn more about membership and how you can get involved.
                </p>
            </div>
        );
    }
}

export default About;
