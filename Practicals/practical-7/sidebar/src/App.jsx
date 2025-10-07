import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Home from "./pages/Home";
import Charusat from "./pages/Charusat";
import Depstar from "./pages/Depstar";
import CSE from "./pages/CSE";
import CE from "./pages/CE";
import IT from "./pages/IT";
import About from "./pages/About";
import Contact from "./pages/Contact";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/charusat" element={<Charusat />} />
            <Route path="/charusat/depstar" element={<Depstar />} />
            <Route path="/charusat/depstar/cse" element={<CSE />} />
            <Route path="/charusat/depstar/ce" element={<CE />} />
            <Route path="/charusat/depstar/it" element={<IT />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
