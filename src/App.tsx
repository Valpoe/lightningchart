import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import "./App.css";
import Home from "./components/Content/Home";
import Charts from "./components/Content/Barchart";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/barchart" element={<Charts />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
