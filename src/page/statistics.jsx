import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdBarChart, MdArrowDropDown } from "react-icons/md";

import GenderStatistics from "./gender.statistics";
import { useDispatch, useSelector } from "react-redux";
import { changePage } from "../store/slice/ui.slice";
import LevelStatistics from "./level.statistics";
import BoilerTypestatistics from "./boilerTypes.statistics";
import StatisticsService from "../service/statistics.service";
import SmallDistricts from "./smallDistricts";
import RegionStatistics from "./region";
import FacultyStatistics from "./faculty.statistics";
import { faculties } from "../constants";

const Statistics = () => {
  const dispatch = useDispatch();
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const [selectedStatistic, setSelectedStatistic] = useState("gender");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const statisticsOptions = [
    {
      key: "gender",
      label: "Jins bo'yicha statistika",
      component: <GenderStatistics />,
    },
    {
      key: "level",
      label: "Kurslar bo'yicha statistika",
      component: <LevelStatistics />,
    },
    {
      key: "boiler",
      label: "Isitish uskunalari statistikasi",
      component: <BoilerTypestatistics />,
    },
    {
      key: "districts",
      label: "Kichik tumanlar statistikasi",
      component: <SmallDistricts />,
    },
    {
      key: "regions",
      label: "Viloyatlar bo'yicha statistika",
      component: <RegionStatistics />,
    },
    {
      key: "faculty",
      label: "Fakultetlar bo'yicha statistika",
      component: <FacultyStatistics />,
    },
  ];

  const currentOption = statisticsOptions.find(
    (opt) => opt.key === selectedStatistic
  );

  useEffect(() => {
    dispatch(changePage("Statistika"));
    StatisticsService.getGenderStatistics(dispatch);
    StatisticsService.getLevelStudents(dispatch);
    StatisticsService.getBoilerTypes(dispatch);
    StatisticsService.getSmallDistricts(dispatch);
    StatisticsService.regionStudents(dispatch);
    StatisticsService.facultyData(dispatch, faculties);
  }, []);

  const pageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          {fullStatisticPage ? (
            ""
          ) : (
            <>
              <Link className="text-blue-500 hover:text-blue-600 font-medium">
                Statistika
              </Link>
              <i className="bi bi-chevron-right text-gray-400 mx-2"></i>
            </>
          )}
        </div>

        {/* Statistics Selector */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-2">
              <MdBarChart className="text-blue-500" size={20} />
              <span className="font-medium text-gray-700">
                {currentOption?.label}
              </span>
            </div>
            <motion.div
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <MdArrowDropDown className="text-gray-500" size={20} />
            </motion.div>
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />

                {/* Dropdown Menu */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden"
                >
                  <div className="py-2">
                    {statisticsOptions.map((option, index) => (
                      <motion.button
                        key={option.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          setSelectedStatistic(option.key);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          selectedStatistic === option.key
                            ? "bg-blue-50 text-blue-600 border-r-2 border-blue-500"
                            : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedStatistic === option.key
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span className="font-medium">{option.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Statistics Content */}
      <div className="py-2"></div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStatistic}
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {currentOption?.component}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Statistics;
