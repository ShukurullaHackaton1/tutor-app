import React, { useEffect, useState } from "react";
import MapComponent from "../components/map";
import { useDispatch, useSelector } from "react-redux";
import { changePage } from "../store/slice/ui.slice";
import { Link } from "react-router-dom";
import StatisticsService from "../service/statistics.service";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdClose,
  MdPerson,
  MdLocationOn,
  MdSchool,
  MdAttachMoney,
} from "react-icons/md";
import ShimmerLoading from "../components/loading/loading";

const MapPage = () => {
  const dispatch = useDispatch();
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    dispatch(changePage("Xarita"));
    StatisticsService.getAppartmentsLocation(dispatch);
  }, []);

  const handleStudentSelect = (studentInfo) => {
    console.log("🎯 handleStudentSelect called with:", studentInfo);

    // Debug ma'lumotlarini yangilash
    setDebugInfo(`
      Received data: ${JSON.stringify(studentInfo, null, 2)}
      Type: ${typeof studentInfo}
      Keys: ${studentInfo ? Object.keys(studentInfo) : "null"}
    `);

    if (studentInfo) {
      setSelectedStudent(studentInfo);
      setIsModalOpen(true);
      console.log("✅ Modal should open now");
    } else {
      console.error("❌ No student info provided");
      alert("Ma'lumot topilmadi!");
    }
  };

  const closeModal = () => {
    console.log("🔒 Closing modal");
    setIsModalOpen(false);
    setSelectedStudent(null);
    setDebugInfo("");
  };

  const formatPrice = (price) => {
    if (!price) return "Noma'lum";
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };

  // Test function
  const testModal = () => {
    const testData = {
      student: {
        image:
          "https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small/simple-user-default-icon-free-png.png",
        second_name: "Test",
        first_name: "Student",
        level: { name: "Bakalavr" },
        province: { name: "Qoraqalpog'iston" },
      },
      appartment: {
        status: "green",
        smallDistrict: "20-kichik tuman",
        priceAppartment: 500000,
        numberOfStudents: 2,
        typeOfBoiler: "Ariston kotyol",
        contract: true,
      },
    };

    console.log("🧪 Testing modal with test data");
    handleStudentSelect(testData);
  };

  return (
    <div className="relative">
      {/* Debug Panel */}
      <div className="fixed top-4 right-4 bg-yellow-100 p-4 rounded-lg shadow-lg z-40 max-w-md">
        <h4 className="font-bold mb-2">Debug Info:</h4>
        <p className="text-sm mb-2">Modal Open: {isModalOpen ? "Yes" : "No"}</p>
        <p className="text-sm mb-2">
          Selected Student: {selectedStudent ? "Yes" : "No"}
        </p>
        <button
          onClick={testModal}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm mb-2"
        >
          Test Modal
        </button>
        <pre className="text-xs bg-white p-2 rounded max-h-32 overflow-auto">
          {debugInfo}
        </pre>
      </div>
      {/* Breadcrumb */}
      {fullStatisticPage ? (
        ""
      ) : (
        <>
          <Link className="text-primary">Xarita</Link>
          <i className="bi bi-chevron-right"></i>
        </>
      )}{" "}
      <div className="py-2"></div>
      {/* Map Component */}
      <MapComponent onStudentSelect={handleStudentSelect} />
      {/* Global Student Info Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={closeModal}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <MdPerson className="text-white" size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Talaba ma'lumotlari
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeModal}
                    className="p-2 rounded-lg bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all"
                  >
                    <MdClose size={20} />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {selectedStudent ? (
                    <>
                      {/* Debug Info in Modal */}
                      <div className="bg-gray-100 p-3 rounded mb-4 text-xs">
                        <strong>Debug:</strong> Student data loaded successfully
                        <br />
                        Student name: {
                          selectedStudent.student?.second_name
                        }{" "}
                        {selectedStudent.student?.first_name}
                        <br />
                        Status: {selectedStudent.appartment?.status}
                      </div>

                      {/* Student Info */}
                      <div className="mb-6">
                        <div className="flex items-center justify-center mb-4">
                          <img
                            src={
                              selectedStudent.student?.image ||
                              "https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small/simple-user-default-icon-free-png.png"
                            }
                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                            alt="Student"
                            onError={(e) => {
                              e.target.src =
                                "https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small/simple-user-default-icon-free-png.png";
                            }}
                          />
                        </div>

                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {selectedStudent.student?.second_name || "Noma'lum"}{" "}
                            {selectedStudent.student?.first_name || ""}
                          </h3>
                          <p className="text-gray-600">
                            {selectedStudent.student?.level?.name || "Noma'lum"}
                          </p>
                        </div>

                        {/* Status Cards */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div
                            className={`p-4 rounded-lg text-center ${
                              selectedStudent.appartment?.status === "green"
                                ? "bg-green-100 border-2 border-green-500"
                                : "bg-gray-100 border-2 border-gray-300"
                            }`}
                          >
                            <div className="w-full h-4 rounded-md bg-green-500 mb-2"></div>
                            <p className="text-sm font-medium">Yaxshi holat</p>
                          </div>

                          <div
                            className={`p-4 rounded-lg text-center ${
                              selectedStudent.appartment?.status === "yellow"
                                ? "bg-yellow-100 border-2 border-yellow-500"
                                : "bg-gray-100 border-2 border-gray-300"
                            }`}
                          >
                            <div className="w-full h-4 rounded-md bg-yellow-500 mb-2"></div>
                            <p className="text-sm font-medium">
                              O'rtacha holat
                            </p>
                          </div>

                          <div
                            className={`p-4 rounded-lg text-center ${
                              selectedStudent.appartment?.status === "red"
                                ? "bg-red-100 border-2 border-red-500"
                                : "bg-gray-100 border-2 border-gray-300"
                            }`}
                          >
                            <div className="w-full h-4 rounded-md bg-red-500 mb-2"></div>
                            <p className="text-sm font-medium">Yomon holat</p>
                          </div>
                        </div>

                        {/* Detailed Info Cards */}
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <MdLocationOn
                                  className="text-blue-500"
                                  size={20}
                                />
                                <span className="font-medium text-gray-800">
                                  Viloyat
                                </span>
                              </div>
                              <span className="text-gray-600">
                                {selectedStudent.student?.province?.name ||
                                  "Noma'lum"}
                              </span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <MdLocationOn
                                  className="text-green-500"
                                  size={20}
                                />
                                <span className="font-medium text-gray-800">
                                  Kichik tuman
                                </span>
                              </div>
                              <span className="text-gray-600">
                                {selectedStudent.appartment?.smallDistrict ||
                                  "Noma'lum"}
                              </span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <MdSchool
                                  className="text-purple-500"
                                  size={20}
                                />
                                <span className="font-medium text-gray-800">
                                  Ta'lim bosqichi
                                </span>
                              </div>
                              <span className="text-gray-600">
                                {selectedStudent.student?.level?.name ||
                                  "Noma'lum"}
                              </span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <MdAttachMoney
                                  className="text-green-600"
                                  size={20}
                                />
                                <span className="font-medium text-gray-800">
                                  Ijara narxi
                                </span>
                              </div>
                              <span className="text-gray-600 font-semibold">
                                {formatPrice(
                                  selectedStudent.appartment?.priceAppartment
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <MdPerson
                                  className="text-orange-500"
                                  size={20}
                                />
                                <span className="font-medium text-gray-800">
                                  Talabalar soni
                                </span>
                              </div>
                              <span className="text-gray-600">
                                {selectedStudent.appartment?.numberOfStudents ||
                                  0}{" "}
                                ta talaba
                              </span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-blue-500">🔥</span>
                                <span className="font-medium text-gray-800">
                                  Isitish uskunasi
                                </span>
                              </div>
                              <span className="text-gray-600">
                                {selectedStudent.appartment?.typeOfBoiler ||
                                  "Noma'lum"}
                              </span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-green-500">📄</span>
                                <span className="font-medium text-gray-800">
                                  Ijara shartnomasi
                                </span>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-sm font-medium ${
                                  selectedStudent.appartment?.contract
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {selectedStudent.appartment?.contract
                                  ? "Bor"
                                  : "Yo'q"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-500">
                        Ma'lumotlar yuklanmoqda...
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeModal}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Yopish
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapPage;
