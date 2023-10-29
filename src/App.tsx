import React from 'react';
import { Helmet } from 'react-helmet';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar'; // Make sure to provide the correct path to your Navbar component
import Footer from './components/Footer'; // Make sure to provide the correct path to your Footer component
import Home from './views/Home/Home.tsx'; // Import your Home component
import About from './views/About/About.tsx'; // Import your About component
import Strategies from './views/Strategies/Strategies.tsx'; // Import your Strategies component
import Analysis from './views/Analysis/Analysis.tsx'; // Import your Analysis component
import Dxlib from './views/Dxlib/Dxlib.tsx'; // Import your Dxlib component
import './App.css';
import './markdown.css';
import './highlighting.css';
import 'bootstrap/dist/css/bootstrap.css';

const App: React.FC = () => {
    const navigationItems = [
        {name: 'Home', url: '/'},
        {name: 'About', url: '/about'},
        {name: 'Strategies', url: '/strategies'},
        {name: 'Analysis', url: '/analysis'},
        {name: 'dxlib', url: '/dxlib'}
    ];
    return (
        <div>
            <Helmet>
                <title>Platform - Delphos</title> {/* Set the default title using Helmet */}
            </Helmet>
            <Navbar items={navigationItems}/>
            <Router>
                <main>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/strategies" element={<Strategies/>}/>
                        <Route path="/analysis" element={<Analysis/>}/>
                        <Route path="/dxlib" element={<Dxlib/>}/>
                    </Routes>
                </main>
                <Footer/>
            </Router>
        </div>

    );
};

export default App;
