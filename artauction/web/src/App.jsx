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
import { supabase } from "./lib/supabaseClient";

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
      // Robust regex extraction to handle any URL structure (nested hashes, etc.)
      const fullUrl = window.location.href;
      const atMatch = fullUrl.match(/access_token=([^&]+)/);
      const rtMatch = fullUrl.match(/refresh_token=([^&]+)/);

      const access_token = atMatch ? decodeURIComponent(atMatch[1]) : null;
      const refresh_token = rtMatch ? decodeURIComponent(rtMatch[1]) : null;

      if (access_token && refresh_token) {
        console.log('[App] Found tokens via regex, attempting to set session...');
        try {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) throw error;

          console.log('[App] Session set successfully');
          if (window.location.hash !== '#/reset') {
            window.location.hash = '#/reset';
          }
        } catch (err) {
          console.error('[App] Failed to set session from URL tokens:', err);
          // Redirect to reset page but PRESERVE tokens so ResetPassword can see them
          // and show the specific error (or try again)
          if (!window.location.hash.includes('/reset')) {
            const newHash = `#/reset?access_token=${access_token}&refresh_token=${refresh_token}&error=${encodeURIComponent(err.message)}`;
            window.location.hash = newHash;
          }
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
