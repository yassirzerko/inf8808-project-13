import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './home/Home';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes,
  Route } from "react-router-dom";
import { Categorical } from './viz1/viz1';
import { Type } from './viz2/viz2';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter>
  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="categorical" element={<Categorical />} />
  <Route path="type" element={<Type />} />
  <Route path="numerical" element={<Categorical />} />
  </Routes>
  
   
  </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
