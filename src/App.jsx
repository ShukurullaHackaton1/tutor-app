import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./page/layout";
import Dashboard from "./page/dashboard";
import Sign from "./page/sign";
import Statistics from "./page/statistics";
import MapPage from "./page/map.page";
import Tutors from "./page/tutors";
import FilterPage from "./page/filter.page";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !localStorage.getItem("admin-jwt") ||
      localStorage.getItem("admin-jwt") == "undefined"
    ) {
      return navigate("/sign");
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout activePage={<Dashboard />} />} />
        <Route path="/sign" element={<Sign />} />
        <Route
          path="/statistics"
          element={<Layout activePage={<Statistics />} />}
        />
        <Route path="/map" element={<Layout activePage={<MapPage />} />} />
        <Route path="/tutors" element={<Layout activePage={<Tutors />} />} />
        <Route path="/filter" element={<FilterPage />} />
      </Routes>
    </div>
  );
};

export default App;
