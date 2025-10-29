import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ArtistPortfolio from "./pages/ArtistPortfolio";
import ArtworkPage from "./pages/ArtworkPage";

const App = () => {
  return (
      <Router>
          <Header />
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/artist/:artistId" element={<ArtistPortfolio />} />
              <Route path="/artworks/:artworkId" element={<ArtworkPage />} />
              <Route path="*" element={<Home />} />
          </Routes>
      </Router>
  );
};

export default App;
