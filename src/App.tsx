import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import './App.css';
import Home from './components/pages/line-chart/lineChart';
import Charts from './components/pages/rectangle-chart/rectangleChart';
import BarChart from './components/pages/bar-chart/barChart';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path='/line-chart'
            element={<Home />}
          />
          <Route
            path='/rectangle-chart'
            element={<Charts />}
          />
          <Route
            path='/bar-chart'
            element={<BarChart />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
