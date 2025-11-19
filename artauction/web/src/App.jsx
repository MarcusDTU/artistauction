import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ArtistPortfolio from "./pages/ArtistPortfolio";
import ArtworkPage from "./pages/ArtworkPage";
import ArtistDashboard from "./pages/ArtistDashboard";
import EditArtwork from "./pages/EditArtwork";
import UploadArtwork from "./pages/UploadArtwork";
import { supabase } from "./backend/services/supabaseClient";

const App = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasCode = params.get('code');
    // If arriving with an OAuth/PKCE code, route to reset page
    if (hasCode && window.location.hash !== '#/reset') {
      window.location.hash = '#/reset';
    }

    // If arriving with access_token/refresh_token in hash, set session then route
    (async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');
      if (access_token && refresh_token) {
        try {
          await supabase.auth.setSession({ access_token, refresh_token });
        } catch (_) { /* ignore */ }
        if (window.location.hash !== '#/reset') {
          window.location.hash = '#/reset';
        }
      }
    })();

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && window.location.hash !== '#/reset') {
        window.location.hash = '#/reset';
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
      <Router>
          <Header />
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/reset" element={<ResetPassword />} />
              <Route path="/artist/:artistId" element={<ArtistPortfolio />} />
              <Route path="/artworks/:artworkId" element={<ArtworkPage />} />
              <Route path="/dashboard" element={<ArtistDashboard />} />
              <Route path="/edit-artwork/:artworkId" element={<EditArtwork />} />
              <Route path="/upload-artwork" element={<UploadArtwork />} />
              <Route path="*" element={<Home />} />
          </Routes>
      </Router>
  );
};

export default App;
