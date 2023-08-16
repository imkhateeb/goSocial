import React from 'react';
import './index.css';
import { Route, Routes } from 'react-router-dom';
import Home from './container/Home';
import Login from './components/Login';
import Signup from './components/Signup';

export default function App() {
    return (
        <Routes>
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
            <Route path='/*' element={<Home />} />
        </Routes>
    )
}
