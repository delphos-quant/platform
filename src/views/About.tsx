import React from 'react';
import styles from './About.module.css';

class About extends React.Component {
    render() {
        return (
            <div className={styles.aboutpage}>
                <div className={styles.header}>
                    <img src="delphos-logo.png" alt="Delphos Logo" className={styles.logo} />
                    <h1>About Delphos</h1>
                </div>
                <p className={styles.intro}>
                    Welcome to <span className={styles.highlight}>Delphos</span>, your gateway to <span className={styles.highlight}>quantitative analysis</span> in the financial market. Our dedicated team of analysts and researchers is committed to exploring the intricate world of finance.
                </p>
                <p>
                    At Delphos, we believe that <span className={styles.highlight}>data-driven insights</span> are the key to making <span className={styles.highlight}>informed investment decisions</span>. Our mission is to empower individuals with the knowledge and tools needed to navigate the complex financial landscape.
                </p>
                <h2>Our Mission</h2>
                <p>We strive to provide our members with:</p>
                <ul>
                    <li>Data-driven research and analysis</li>
                    <li>Insights into market trends and patterns</li>
                    <li>Trading strategies based on quantitative techniques</li>
                    <li>Educational resources for financial learning</li>
                </ul>
                <h2>Join Us</h2>
                <p>
                    If you're passionate about finance, data analysis, and making informed decisions, <span className={styles.highlight}>Delphos</span> is the place for you. Join our community and embark on a journey of discovery in the world of finance.
                </p>
                <p>
                    Connect with us on social media, attend our workshops and seminars, and gain valuable insights from experienced professionals in the field.
                </p>
                <p>
                    Ready to take the next step? <a href="/contact" className={styles.highlightlink}>Contact us</a> to learn more about membership and how you can get involved.
                </p>
            </div>
        );
    }
}

export default About;
