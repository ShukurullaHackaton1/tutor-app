import React, { useEffect } from "react";
import { motion } from "framer-motion";
import MapComponent from "../components/map";
import { useDispatch, useSelector } from "react-redux";
import AppartmentService from "../service/appartment.service";
import ShimmerLoading from "../components/loading/loading";
import { Link, useNavigate } from "react-router-dom";
import BoxComponent from "../components/boxComponent";
import PieActiveArc from "../components/chart";
import StatisticsService from "../service/statistics.service";
import { changePage } from "../store/slice/ui.slice";
import TutorService from "../service/tutor.service";
import { MdTrendingUp, MdPeople, MdMap, MdBarChart } from "react-icons/md";

const Dashboard = () => {
  const dispatch = useDispatch();
  const statistics = useSelector((state) => state.statistics);
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const tutors = useSelector((state) => state.tutor);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(changePage("Bosh sahifa"));
    AppartmentService.getAppartment(dispatch);
    StatisticsService.getGenderStatistics(dispatch);
    StatisticsService.getAppartmentsLocation(dispatch);
    TutorService.getTutors(dispatch);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const statsData = [
    {
      title: "Jami Talabalar",
      value:
        statistics.studentsByGender?.reduce(
          (sum, item) => sum + item.value,
          0
        ) || 0,
      icon: <MdPeople size={24} />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Faol Tutorlar",
      value: tutors.tutors?.length || 0,
      icon: <MdPeople size={24} />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Xaritada Ko'rsatilgan",
      value: statistics.map?.length || 0,
      icon: <MdMap size={24} />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Breadcrumb */}
      <motion.div variants={cardVariants} className="mb-6">
        <Link className="text-blue-500 hover:text-blue-600 font-medium">
          Bosh sahifa
        </Link>{" "}
        <i className="bi bi-chevron-right text-gray-400"></i>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {typeof stat.value === "number"
                    ? stat.value.toLocaleString()
                    : stat.value}
                </p>
                <div className="flex items-center space-x-1">
                  <MdTrendingUp className="text-green-500" size={16} />
                  <span className="text-green-500 text-sm font-medium">
                    +12%
                  </span>
                </div>
              </div>
              <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                <div className={stat.textColor}>{stat.icon}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="row">
        <div className="col-lg-7 col-md-7 h-[80vh] col-sm-12">
          <motion.div variants={cardVariants}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <MdMap className="text-blue-600" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Talabalar Xaritasi
                    </h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/map")}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    To'liq ko'rish
                  </motion.button>
                </div>
              </div>
              <div className="h-[calc(100%-80px)]">
                <MapComponent />
              </div>
            </div>
          </motion.div>
        </div>

        {!fullStatisticPage && (
          <div className="col-lg-5 col-md-5 col-sm-12">
            <div className="space-y-6">
              {/* Statistics */}
              <motion.div variants={cardVariants} className="h-[40vh]">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <MdBarChart className="text-green-600" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Statistika
                        </h3>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate("/statistics")}
                        className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                      >
                        Batafsil →
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-6">
                    {statistics.isLoading ? (
                      <ShimmerLoading height="250px" />
                    ) : (
                      <PieActiveArc
                        height={200}
                        data={statistics.studentsByGender}
                      />
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Tutors */}
              <motion.div variants={cardVariants} className="h-[40vh]">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <MdPeople className="text-purple-600" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Tutorlar
                        </h3>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate("/tutors")}
                        className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                      >
                        Hammasi →
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-6 h-[calc(100%-80px)] overflow-y-auto">
                    {tutors.isLoading ? (
                      <ShimmerLoading height="300px" />
                    ) : (
                      <div className="space-y-4">
                        {tutors.tutors?.slice(0, 4).map((item, index) => (
                          <motion.div
                            key={item._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate("/tutors")}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-200 group"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <img
                                  src={item.image}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                  alt="tutorImage"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {item.group?.length || 0} ta guruh
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                                {item.group?.length || 0}
                              </span>
                              <i className="bi bi-chevron-right text-gray-400 group-hover:text-blue-600 transition-colors"></i>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <motion.div variants={cardVariants}>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tezkor harakatlar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/map")}
              className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <MdMap size={20} />
              <span className="font-medium">Xaritani Ko'rish</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/statistics")}
              className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <MdBarChart size={20} />
              <span className="font-medium">Statistikalar</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/tutors")}
              className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <MdPeople size={20} />
              <span className="font-medium">Tutorlar</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
