import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { faculties, navItems } from "../constants";
import { Link } from "react-router-dom";
import Header from "../components/header";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdCheck, MdArrowBack } from "react-icons/md";
import { changeCreateSide } from "../store/slice/ui.slice";
import { getFacultyDataSuccess } from "../store/slice/statistics.slice";
import StatisticsService from "../service/statistics.service";
import { Logo } from "../images";

const Layout = ({ activePage }) => {
  const { currentPage, fullStatisticPage, openCreateSide } = useSelector(
    (state) => state.ui
  );
  const { facultyData } = useSelector((state) => state.statistics);
  const dispatch = useDispatch();
  const [selectFaculty, setSelectFaculty] = useState([]);

  const filterHandler = async () => {
    await StatisticsService.facultyData(dispatch, selectFaculty);
  };

  return (
    <div className="relative">
      {/* Filter Sidebar */}
      <AnimatePresence>
        {openCreateSide && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => dispatch(changeCreateSide(false))}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => dispatch(changeCreateSide(false))}
                      className="p-2 rounded-lg bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all"
                    >
                      <MdArrowBack size={20} />
                    </motion.button>
                    <h2 className="text-xl font-semibold text-white">
                      Statistika filtri
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-3">
                    {faculties.map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() =>
                          selectFaculty.find((c) => c === item)
                            ? setSelectFaculty(
                                selectFaculty.filter((c) => c !== item)
                              )
                            : setSelectFaculty([...selectFaculty, item])
                        }
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                          selectFaculty.find((c) => c === item)
                            ? "border-blue-500 bg-blue-50 shadow-lg"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">
                            {item}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                              selectFaculty.find((c) => c === item)
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectFaculty.find((c) => c === item) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <MdCheck className="text-white text-sm" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={filterHandler}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Saqlash
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Row>
        <Col span={fullStatisticPage ? 0 : 5} className="gutter-row">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="h-[100vh] side-bar p-6 bg-white shadow-xl"
          >
            <div className="flex flex-col h-full justify-between">
              {/* Logo */}
              <div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-8 text-center"
                >
                  <img src={Logo} className="w-[100px] mx-auto" alt="" />
                </motion.div>

                {/* Navigation */}
                <ul className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.path}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-200 ${
                          currentPage === item.title
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <i className={`${item.icon} text-lg`}></i>
                        <span>{item.title}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Bottom Menu */}
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-all"
                >
                  <i className="bi bi-question-circle text-lg"></i>
                  <span className="font-medium">Yordam</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all"
                >
                  <i className="bi bi-box-arrow-right text-lg"></i>
                  <span className="font-medium">Tizimdan chiqish</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </Col>
        <Col span={fullStatisticPage ? 24 : 19} className="gutter-row">
          <div className="p-6 scroll bg-gray-50 min-h-screen">
            <div
              className={`${
                fullStatisticPage ? "absolute w-[100%] top-[-100%]" : ""
              }`}
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-xl shadow-sm p-6 mb-6"
              >
                <Header />
              </motion.div>
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {activePage}
            </motion.div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Layout;
