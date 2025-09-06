import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "./page/layout";
import Dashboard from "./page/dashboard";
import Sign from "./page/sign";
import Statistics from "./page/statistics";
import MapPage from "./page/map.page";
import Tutors from "./page/tutors";
import { Toaster } from "react-hot-toast";

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

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3
  };

  return (
    <div className="app">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <AnimatePresence mode="wait">
        <Routes>
          <Route 
            path="/" 
            element={
              <motion.div
                key="dashboard"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Layout activePage={<Dashboard />} />
              </motion.div>
            } 
          />
          <Route 
            path="/sign" 
            element={
              <motion.div
                key="sign"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Sign />
              </motion.div>
            } 
          />
          <Route
            path="/statistics"
            element={
              <motion.div
                key="statistics"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Layout activePage={<Statistics />} />
              </motion.div>
            }
          />
          <Route 
            path="/map" 
            element={
              <motion.div
                key="map"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Layout activePage={<MapPage />} />
              </motion.div>
            } 
          />
          <Route 
            path="/tutors" 
            element={
              <motion.div
                key="tutors"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Layout activePage={<Tutors />} />
              </motion.div>
            } 
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;