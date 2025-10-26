import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () => {
  const getRoute = () => (window.location.hash || '#/home');
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div>
      <Header />
      {route === '#/login' ? <Login /> : <Home />}
    </div>
  );
};

export default App;
