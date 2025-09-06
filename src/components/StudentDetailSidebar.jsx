import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdClose,
  MdPerson,
  MdHome,
  MdLocationOn,
  MdGroup,
} from "react-icons/md";

const StudentDetailSidebar = ({ isOpen, onClose, studentData, loading }) => {
  if (!isOpen) return null;

  const sidebarVariants = {
    hidden: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "green":
        return "bg-green-100 text-green-800";
      case "yellow":
        return "bg-yellow-100 text-yellow-800";
      case "red":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "green":
        return "Yaxshi";
      case "yellow":
        return "O'rtacha";
      case "red":
        return "Yomon";
      default:
        return "Tekshirilmoqda";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed top-0 right-0 h-full w-[550px] bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <MdPerson size={24} color="#333" />
                  </div>
                  <h2 className="text-xl font-semibold">
                    Student ma'lumotlari
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <MdClose size={24} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="p-6 space-y-6"
            >
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">
                    Ma'lumotlar yuklanmoqda...
                  </span>
                </div>
              ) : studentData ? (
                <>
                  {/* Student rasmi va asosiy ma'lumotlar */}
                  <motion.div variants={itemVariants} className="text-center">
                    {studentData.student?.image && (
                      <div className="relative inline-block">
                        <img
                          src={studentData.student.image}
                          alt="Student"
                          className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-200 shadow-lg"
                        />
                      </div>
                    )}
                    <h3 className="mt-4 text-xl font-bold text-gray-800">
                      {studentData.student?.first_name}{" "}
                      {studentData.student?.second_name}
                    </h3>
                  </motion.div>

                  {/* Student ma'lumotlari */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-gray-50 rounded-xl p-5"
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      <MdPerson className="text-blue-500" size={20} />
                      <h4 className="font-semibold text-gray-800 text-lg">
                        Student ma'lumotlari
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {studentData.student?.first_name && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">
                            Ism:
                          </span>
                          <span className="text-gray-800 font-semibold">
                            {studentData.student.first_name}
                          </span>
                        </div>
                      )}

                      {studentData.student?.second_name && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">
                            Familiya:
                          </span>
                          <span className="text-gray-800 font-semibold">
                            {studentData.student.second_name}
                          </span>
                        </div>
                      )}

                      {/* Student ID Number */}
                      {studentData.student?.student_id_number && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">
                            Student ID:
                          </span>
                          <span className="text-gray-800 font-semibold">
                            {studentData.student.student_id_number}
                          </span>
                        </div>
                      )}

                      {/* Guruh nomi */}
                      {studentData.student?.group?.name && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">
                            Guruh:
                          </span>
                          <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                            {studentData.student.group.name}
                          </span>
                        </div>
                      )}

                      {/* Kurs */}
                      {studentData.student?.level?.name && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">
                            Kurs:
                          </span>
                          <span className="text-gray-800 font-semibold">
                            {studentData.student.level.name}
                          </span>
                        </div>
                      )}

                      {/* Fakultet */}
                      {studentData.student?.department?.name && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">
                            Fakultet:
                          </span>
                          <span className="text-gray-800 font-semibold">
                            {studentData.student.department.name}
                          </span>
                        </div>
                      )}

                      {/* Viloyat */}
                      {studentData.student?.province?.name && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">
                            Viloyat:
                          </span>
                          <span className="text-gray-800 font-semibold">
                            {studentData.student.province.name}
                          </span>
                        </div>
                      )}

                      {/* Jins */}
                      {studentData.student?.gender?.name && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">
                            Jins:
                          </span>
                          <span className="text-gray-800 font-semibold">
                            {studentData.student.gender.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Ijara ma'lumotlari */}
                  {studentData.appartment && (
                    <motion.div
                      variants={itemVariants}
                      className="bg-blue-50 rounded-xl p-5"
                    >
                      <div className="flex items-center space-x-2 mb-4">
                        <MdHome className="text-blue-500" size={20} />
                        <h4 className="font-semibold text-gray-800 text-lg">
                          Ijara ma'lumotlari
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {/* Status */}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">
                            Status:
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                              studentData.appartment.status
                            )}`}
                          >
                            {getStatusText(studentData.appartment.status)}
                          </span>
                        </div>

                        {/* To'liq manzil */}
                        {studentData.appartment.fullAddress && (
                          <div className="flex flex-col space-y-1">
                            <span className="text-gray-600 font-medium">
                              To'liq manzil:
                            </span>
                            <span className="text-gray-800 bg-white p-2 rounded border-l-4 border-blue-400">
                              {studentData.appartment.fullAddress}
                            </span>
                          </div>
                        )}

                        {/* Kichik tuman */}
                        {studentData.appartment.smallDistrict && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              Kichik tuman:
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {studentData.appartment.smallDistrict}
                            </span>
                          </div>
                        )}

                        {/* Tuman */}
                        {studentData.appartment.district && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              Tuman:
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {studentData.appartment.district}
                            </span>
                          </div>
                        )}

                        {/* Kvartira turi */}
                        {studentData.appartment.typeOfAppartment && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              Kvartira turi:
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {studentData.appartment.typeOfAppartment}
                            </span>
                          </div>
                        )}

                        {/* Narx */}
                        {studentData.appartment.priceAppartment && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              Narx:
                            </span>
                            <span className="text-green-600 font-bold text-lg">
                              {studentData.appartment.priceAppartment.toLocaleString()}{" "}
                              so'm
                            </span>
                          </div>
                        )}

                        {/* Xonadoshlar soni */}
                        {studentData.appartment.numberOfStudents && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              Xonadoshlar soni:
                            </span>
                            <span className="text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded">
                              {studentData.appartment.numberOfStudents} kishi
                            </span>
                          </div>
                        )}

                        {/* Isitish uskunasi */}
                        {studentData.appartment.typeOfBoiler && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              Isitish uskunasi:
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {studentData.appartment.typeOfBoiler}
                            </span>
                          </div>
                        )}

                        {/* Shartnoma */}
                        {studentData.appartment.contract !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              Shartnoma:
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-sm font-semibold ${
                                studentData.appartment.contract
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {studentData.appartment.contract ? "Bor" : "Yo'q"}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Uy egasi ma'lumotlari */}
                  {studentData.appartment && (
                    <motion.div
                      variants={itemVariants}
                      className="bg-green-50 rounded-xl p-5"
                    >
                      <div className="flex items-center space-x-2 mb-4">
                        <MdGroup className="text-green-500" size={20} />
                        <h4 className="font-semibold text-gray-800 text-lg">
                          Uy egasi ma'lumotlari
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {/* Uy egasi ismi */}
                        {studentData.appartment.appartmentOwnerName && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              F.I.O:
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {studentData.appartment.appartmentOwnerName}
                            </span>
                          </div>
                        )}

                        {/* Uy egasi telefoni */}
                        {studentData.appartment.appartmentOwnerPhone && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              Telefon:
                            </span>
                            <a
                              href={`tel:${studentData.appartment.appartmentOwnerPhone}`}
                              className="text-blue-600 font-semibold hover:underline"
                            >
                              {studentData.appartment.appartmentOwnerPhone}
                            </a>
                          </div>
                        )}

                        {/* Kvartira raqami */}
                        {studentData.appartment.appartmentNumber && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              Kvartira raqami:
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {studentData.appartment.appartmentNumber}
                            </span>
                          </div>
                        )}

                        {/* Student telefoni */}
                        {studentData.appartment.studentPhoneNumber && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              Student telefoni:
                            </span>
                            <a
                              href={`tel:${studentData.appartment.studentPhoneNumber}`}
                              className="text-blue-600 font-semibold hover:underline"
                            >
                              {studentData.appartment.studentPhoneNumber}
                            </a>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Joylashuv ma'lumotlari */}
                  {studentData.appartment?.location && (
                    <motion.div
                      variants={itemVariants}
                      className="bg-purple-50 rounded-xl p-5"
                    >
                      <div className="flex items-center space-x-2 mb-4">
                        <MdLocationOn className="text-purple-500" size={20} />
                        <h4 className="font-semibold text-gray-800 text-lg">
                          Joylashuv
                        </h4>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">
                            Kenglik:
                          </span>
                          <span className="text-gray-800 font-mono">
                            {studentData.appartment.location.lat}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">
                            Uzunlik:
                          </span>
                          <span className="text-gray-800 font-mono">
                            {studentData.appartment.location.long}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Qo'shimcha ma'lumot */}
                  {studentData.appartment?.addition && (
                    <motion.div
                      variants={itemVariants}
                      className="bg-yellow-50 rounded-xl p-5"
                    >
                      <h4 className="font-semibold text-gray-800 text-lg mb-3">
                        Qo'shimcha ma'lumot
                      </h4>
                      <div className="bg-white p-3 rounded-lg border-l-4 border-yellow-400">
                        <p className="text-gray-700">
                          {studentData.appartment.addition}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Tarix ma'lumotlari */}
                  {studentData.appartment?.createdAt && (
                    <motion.div
                      variants={itemVariants}
                      className="bg-gray-50 rounded-xl p-5"
                    >
                      <h4 className="font-semibold text-gray-800 text-lg mb-3">
                        Tarix ma'lumotlari
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">
                            Yaratilgan sana:
                          </span>
                          <span className="text-gray-800">
                            {new Date(
                              studentData.appartment.createdAt
                            ).toLocaleDateString("uz-UZ")}
                          </span>
                        </div>
                        {studentData.appartment.updatedAt && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              Oxirgi yangilanish:
                            </span>
                            <span className="text-gray-800">
                              {new Date(
                                studentData.appartment.updatedAt
                              ).toLocaleDateString("uz-UZ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-12"
                >
                  <div className="text-gray-500">
                    <MdPerson className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">Ma'lumot topilmadi</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Student ma'lumotlari yuklanmadi
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StudentDetailSidebar;
