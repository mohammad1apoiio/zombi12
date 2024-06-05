import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MedicalForm from './page/login/MedicalForm';
import Home from './page/home/home';
import './App.css';
import LoaderPage from './components/page-loafes/loader-page';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // simulate data fetching
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    return (
        <Router>
            {isLoading ? (
                <LoaderPage />
            ) : (
                <Routes>
                    <Route path="/" element={<MedicalForm/>}/>
                    <Route path="/home" element={<Home/>}/>
                </Routes>
            )}
        </Router>
    );
}

export default App;