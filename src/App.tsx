import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/siteLayout';
import './App.css';
import LineChart from './pages/line-chart/lineChart';
import RectangleChart from './pages/rectangle-chart/rectangleChart';
import BarChart from './pages/bar-chart/barChart';
import BubbleChart from './pages/bubble-chart/bubbleChart';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path='/line-chart'
            element={<LineChart />}
          />
          <Route
            path='/rectangle-chart'
            element={<RectangleChart />}
          />
          <Route
            path='/bar-chart'
            element={<BarChart />}
          />
          <Route
            path='/bubble-chart'
            element={<BubbleChart />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
