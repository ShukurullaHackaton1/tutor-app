import React, { useState } from "react";
import LiveClock from "./liveClock";
import AdminImage from "../images/admin.png";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <div className="flex items-center justify-between">
      {/* Search */}
      <div className="flex items-center space-x-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          <input
            type="text"
            placeholder="Izlash..."
            className="outline-none border-2 border-gray-200 p-3 min-w-[350px] rounded-xl shadow-sm px-4 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="outline-none border-none p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg px-4 text-lg hover:shadow-xl transition-all"
          >
            <i className="bi bi-search"></i>
          </motion.button>
        </motion.div>
      </div>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex gap-4 items-center"
      >
        <div className="date bg-white p-3 px-4 rounded-xl shadow-md border border-gray-200">
          <LiveClock />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} className="user-image">
          <img
            src={AdminImage}
            alt=""
            width={50}
            height={50}
            className="rounded-full border-2 border-blue-500 shadow-md"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Header;
