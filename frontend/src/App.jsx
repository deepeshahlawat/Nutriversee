// File: frontend/src/App.jsx
import React from 'react';
import Dashboard from './Dashboard.jsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Community from "../src/components/Community.jsx";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </Router>
  );
}

export default App;
