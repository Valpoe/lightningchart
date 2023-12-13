import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import './App.css';
import Home from './components/content/Home';
import Charts from './components/content/Charts';


function App() {


  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Home  />}
          />
          <Route
            path="/charts"
            element={<Charts />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

