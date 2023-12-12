import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import './App.css';
import Content from './components/Content/Content';
import Home from './components/Content/Home';

function App() {
  return (
    <Router>
      <Layout>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/content" element={<Content/>} />
      </Routes>
      </Layout>
    </Router>
  );
}

export default App;

