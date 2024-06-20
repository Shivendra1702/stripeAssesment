import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import ProductCart from "./views/ProductCart";
import "./App.css";
import Success from "./views/Success";
import Cancel from "./views/Cancel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/checkout" Component={ProductCart} />
        <Route path="/success" Component={Success} />
        <Route path="/cancel" Component={Cancel} />
      </Routes>
    </Router>
  );
}

export default App;
