import React, { useEffect, useState } from "react";
import { changePage } from "../store/slice/ui.slice";
import { useDispatch, useSelector } from "react-redux";
import BoxComponent from "../components/boxComponent";
import { Link } from "react-router-dom";
import TutorService from "../service/tutor.service";
import ShimmerLoading from "../components/loading/loading";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdPerson,
  MdPhone,
  MdLock,
  MdEmail,
  MdGroup,
  MdVisibility,
  MdCheck,
} from "react-icons/md";
import OptionComponent from "../components/option.component";
import EditPng from "../icons/Edit.png";
import TrashIcon from "../icons/trash.png";
import toast from "react-hot-toast";

const Tutors = () => {
  const dispatch = useDispatch();
  const tutors = useSelector((state) => state.tutor);
  const [selectTutor, setSelectTutor] = useState("");

  const [openCreateSide, setOpenCreateSide] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddGroupModal, setOpenAddGroupModal] = useState(false);
  const [openStudentsModal, setOpenStudentsModal] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);
  const [addingGroupToTutor, setAddingGroupToTutor] = useState(null);
  const [selectedGroupForStudents, setSelectedGroupForStudents] =
    useState(null);
  const [groupStudents, setGroupStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Create form states
  const [thumbnailImage, setThumbnailImage] = useState(
    "https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small/simple-user-default-icon-free-png.png"
  );
  const [image, setImage] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  // Edit form states
  const [editImage, setEditImage] = useState("");
  const [editThumbnailImage, setEditThumbnailImage] = useState("");
  const [editFirstname, setEditFirstname] = useState("");
  const [editLastname, setEditLastname] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editLogin, setEditLogin] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const [search, setSearch] = useState("");
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [selectGroup, setSelectGroup] = useState({
    tutor: {
      id: "",
      tutorName: "",
    },
    group: "",
  });

  const [error, setError] = useState({
    message: "",
    state: false,
  });

  const [selectGroups, setSelectGroups] = useState([]);
  const [addingGroups, setAddingGroups] = useState([]);

  useEffect(() => {
    dispatch(changePage("Tutorlar"));
    TutorService.getTutors(dispatch);
    TutorService.getGroups(dispatch, search);
  }, []);

  useEffect(() => {
    TutorService.getGroups(dispatch, search);
    if (search == "") TutorService.getGroups(dispatch, search);
  }, [search]);

  const changeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const thumbnail = URL.createObjectURL(file);
      setThumbnailImage(thumbnail);
      setImage(file);
    }
  };

  const changeEditImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const thumbnail = URL.createObjectURL(file);
      setEditThumbnailImage(thumbnail);
      setEditImage(file);
    }
  };

  // Edit modal ni ochish
  const openEditModalHandler = (tutor) => {
    setEditingTutor(tutor);
    setEditFirstname(tutor.name.split(" ")[0] || "");
    setEditLastname(tutor.name.split(" ").slice(1).join(" ") || "");
    setEditPhone(tutor.phone || "");
    setEditLogin(tutor.login || "");
    setEditPassword(tutor.password || ""); // YANGI: Hozirgi parolni ko'rsatish
    setEditThumbnailImage(
      tutor.image ||
        "https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small/simple-user-default-icon-free-png.png"
    );
    setOpenEditModal(true);
  };

  // Guruh studentlarini yuklash
  const loadGroupStudents = async (groupName) => {
    setLoadingStudents(true);
    try {
      const response = await fetch(
        `https://tutorapp.kerek.uz/tutor/students-group/${groupName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-jwt")}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setGroupStudents(data.data);
      }
    } catch (error) {
      toast.error("Studentlarni yuklashda xatolik");
    } finally {
      setLoadingStudents(false);
    }
  };

  // State'larni tozalash funksiyasi
  const clearStates = () => {
    setFirstname("");
    setLastname("");
    setPhone("");
    setLogin("");
    setPassword("");
    setImage("");
    setSelectGroups([]);
    setThumbnailImage(
      "https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small/simple-user-default-icon-free-png.png"
    );
    setError({
      message: "",
      state: false,
    });
  };

  const clearEditStates = () => {
    setEditingTutor(null);
    setEditFirstname("");
    setEditLastname("");
    setEditPhone("");
    setEditLogin("");
    setEditPassword("");
    setEditImage("");
    setEditThumbnailImage("");
  };

  const createHandler = async (e) => {
    e.preventDefault();

    if (!firstname.trim()) {
      return setError({
        state: true,
        message: "Iltimos, ism kiriting",
      });
    }

    if (!lastname.trim()) {
      return setError({
        state: true,
        message: "Iltimos, familiya kiriting",
      });
    }

    if (!phone.trim()) {
      return setError({
        state: true,
        message: "Iltimos, telefon raqam kiriting",
      });
    }

    if (!login.trim()) {
      return setError({
        state: true,
        message: "Iltimos, login kiriting",
      });
    }

    if (!password.trim()) {
      return setError({
        state: true,
        message: "Iltimos, parol kiriting",
      });
    }

    if (selectGroups.length === 0) {
      return setError({
        state: true,
        message: "Iltimos, tutorga guruh biriktiring",
      });
    }

    const formData = new FormData();
    formData.append("login", login);
    formData.append("password", password);
    formData.append("name", `${firstname} ${lastname}`);
    formData.append("phone", phone);
    formData.append("group", JSON.stringify(selectGroups));

    if (image && image instanceof File) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("https://tutorapp.kerek.uz/tutor/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-jwt")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.status == "success") {
        toast.success("Tutor muvaffaqiyatli yaratildi!!");
        setOpenCreateSide(false);
        clearStates();
        TutorService.getTutors(dispatch);
      } else {
        setError({
          state: true,
          message: data.message || "Tutor yaratishda xatolik yuz berdi",
        });
      }
    } catch (error) {
      console.error("Error creating tutor:", error);
      setError({
        state: true,
        message: "Tutor yaratishda xatolik yuz berdi",
      });
    }
  };

  // Tutorni yangilash
  const updateTutorHandler = async (e) => {
    e.preventDefault();

    if (!editFirstname.trim() || !editLastname.trim()) {
      return setError({
        state: true,
        message: "Iltimos, ism va familiyani kiriting",
      });
    }

    const formData = new FormData();
    formData.append("name", `${editFirstname} ${editLastname}`);
    formData.append("phone", editPhone);
    formData.append("login", editLogin);

    // YANGI: Password ham yuborish
    if (editPassword) {
      formData.append("password", editPassword);
    }

    if (editImage && editImage instanceof File) {
      formData.append("image", editImage);
    }

    try {
      const response = await fetch(
        `https://tutorapp.kerek.uz/tutor/profile/${editingTutor._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-jwt")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        toast.success("Tutor ma'lumotlari yangilandi!");
        setOpenEditModal(false);
        clearEditStates();
        TutorService.getTutors(dispatch);
      } else {
        setError({
          state: true,
          message: data.message || "Yangilashda xatolik yuz berdi",
        });
      }
    } catch (error) {
      console.error("Error updating tutor:", error);
      setError({
        state: true,
        message: "Yangilashda xatolik yuz berdi",
      });
    }
  };

  const removeHandler = async () => {
    try {
      await TutorService.tutorsRemoveGroup(dispatch, selectGroup.tutor.id, {
        groupName: selectGroup.group,
      });

      setOpenWarningModal(false);
      setSelectGroup({
        tutor: {
          id: "",
          tutorName: "",
        },
        group: "",
      });
    } catch (error) {
      console.error("Error removing group:", error);
    }
  };

  return (
    <div className="h-[100vh] overflow-y-scroll">
      <div className="mb-3">
        <Link className="text-blue-500 hover:text-blue-600 font-medium">
          Tutorlar
        </Link>{" "}
        <i className="bi bi-chevron-right text-gray-400"></i>
      </div>

      {/* Warning Modal */}
      <AnimatePresence>
        {openWarningModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
              onClick={() => setOpenWarningModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Guruhni o'chirish
                </h3>
                <p className="text-gray-600 mb-6">
                  <strong>{selectGroup.tutor.tutorName}</strong> nomli tutordan{" "}
                  <strong>{selectGroup.group}</strong> nomli guruhni olib
                  tashlamoqchimisiz?
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={removeHandler}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Ha, o'chirish
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setOpenWarningModal(false);
                      setSelectGroup({ tutor: {}, group: "" });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Bekor qilish
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {openEditModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => {
                setOpenEditModal(false);
                clearEditStates();
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <MdEdit className="text-blue-500" />
                    <span>Tutorni tahrirlash</span>
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setOpenEditModal(false);
                      clearEditStates();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MdClose className="text-gray-500" size={20} />
                  </motion.button>
                </div>

                {error.state && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4"
                  >
                    {error.message}
                    <button
                      onClick={() => setError({ message: "", state: false })}
                      className="float-right font-bold text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </motion.div>
                )}

                <form onSubmit={updateTutorHandler} className="space-y-6">
                  {/* Image Upload */}
                  <div className="flex justify-center">
                    <label htmlFor="edit-image" className="cursor-pointer">
                      <div className="relative">
                        <img
                          src={editThumbnailImage}
                          className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 hover:border-blue-300 transition-colors"
                          alt="Tutor"
                        />
                        <div className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full">
                          <MdEdit className="text-white" size={16} />
                        </div>
                      </div>
                    </label>
                    <input
                      type="file"
                      id="edit-image"
                      onChange={changeEditImage}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ism
                      </label>
                      <div className="relative">
                        <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={editFirstname}
                          onChange={(e) => setEditFirstname(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Ism"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Familiya
                      </label>
                      <div className="relative">
                        <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={editLastname}
                          onChange={(e) => setEditLastname(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Familiya"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon raqam
                    </label>
                    <div className="relative">
                      <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Telefon raqam"
                      />
                    </div>
                  </div>

                  {/* Login and Password */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Login
                      </label>
                      <div className="relative">
                        <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={editLogin}
                          onChange={(e) => setEditLogin(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Login"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parol
                      </label>
                      <div className="relative">
                        <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Parol"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Yangilash
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setOpenEditModal(false);
                        clearEditStates();
                      }}
                      className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Bekor qilish
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Students Modal */}
      <AnimatePresence>
        {openStudentsModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => {
                setOpenStudentsModal(false);
                setSelectedGroupForStudents(null);
                setGroupStudents([]);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <MdGroup className="text-purple-500" />
                    <span>{selectedGroupForStudents?.name} - Studentlar</span>
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setOpenStudentsModal(false);
                      setSelectedGroupForStudents(null);
                      setGroupStudents([]);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MdClose className="text-gray-500" size={20} />
                  </motion.button>
                </div>

                {loadingStudents ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : groupStudents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupStudents.map((student, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={student.image}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            alt="Student"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {student.full_name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {student.faculty?.name}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                student.status === "green"
                                  ? "bg-green-100 text-green-800"
                                  : student.status === "yellow"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : student.status === "red"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {student.status === "green"
                                ? "Yaxshi"
                                : student.status === "yellow"
                                ? "O'rtacha"
                                : student.status === "red"
                                ? "Yomon"
                                : "Tekshirilmoqda"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {student.hasFormFilled === "true"
                                ? "Forma to'ldirilgan"
                                : "Forma to'ldirilmagan"}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MdGroup className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">
                      Bu guruhda studentlar topilmadi
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BoxComponent>
        {/* Create Side Panel */}
        {openCreateSide && (
          <OptionComponent state={openCreateSide}>
            <div className="config">
              <div className="flex gap-3 items-center">
                <div
                  onClick={() => {
                    setOpenCreateSide(false);
                    clearStates();
                  }}
                  className="w-[40px] cursor-pointer h-[40px] flex items-center justify-center bg-white rounded-lg"
                >
                  <i className="bi bi-arrow-left text-2xl"></i>
                </div>
                <div className="text-2xl font-[500]">Yangi Tutor</div>
              </div>
            </div>

            {error.state && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-3">
                {error.message}
                <button
                  onClick={() => setError({ message: "", state: false })}
                  className="float-right font-bold"
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={createHandler}>
              <div className="image my-4">
                <label
                  className="flex items-center justify-center"
                  htmlFor="image"
                >
                  <div className="w-[130px] rounded-lg bg-white p-3 h-[130px] relative">
                    <img
                      src={thumbnailImage}
                      className="w-[100px] h-[100px] rounded-lg object-cover"
                      alt="Tutor"
                    />
                    <img
                      src={EditPng}
                      className="w-[20px] cursor-pointer absolute bottom-[-10px] right-[-10px] h-[20px]"
                      alt="Edit"
                    />
                  </div>
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={changeImage}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <div className="input flex my-3 bg-white p-2 rounded-lg">
                <input
                  type="text"
                  placeholder="Ism"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="p-2 col-11 outline-none text-xl"
                  required
                />
                <div className="col-1 flex items-center justify-center">
                  <img src={EditPng} className="w-[30px] h-[30px]" alt="Edit" />
                </div>
              </div>

              <div className="input flex my-3 bg-white p-2 rounded-lg">
                <input
                  type="text"
                  placeholder="Familiya"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="p-2 col-11 outline-none text-xl"
                  required
                />
                <div className="col-1 flex items-center justify-center">
                  <img src={EditPng} className="w-[30px] h-[30px]" alt="Edit" />
                </div>
              </div>

              <div className="input flex my-3 bg-white p-2 rounded-lg">
                <div className="p-2 col-2 pl-3 outline-none text-xl">+998</div>
                <input
                  type="number"
                  placeholder="Telefon raqami"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="p-2 col-9 translate-x-[-20px] outline-none text-xl"
                  required
                />
                <div className="col-1 flex items-center justify-center">
                  <img src={EditPng} className="w-[30px] h-[30px]" alt="Edit" />
                </div>
              </div>

              <div className="input flex my-3 bg-white p-2 rounded-lg">
                <input
                  type="text"
                  placeholder="Login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="p-2 col-11 outline-none text-xl"
                  required
                />
                <div className="col-1 flex items-center justify-center">
                  <img src={EditPng} className="w-[30px] h-[30px]" alt="Edit" />
                </div>
              </div>

              <div className="input flex my-3 bg-white p-2 rounded-lg">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 col-11 outline-none text-xl"
                  required
                />
                <div className="col-1 flex items-center justify-center">
                  <img src={EditPng} className="w-[30px] h-[30px]" alt="Edit" />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary text-xl rounded-lg block w-full"
              >
                Yaratish
              </button>
            </form>
          </OptionComponent>
        )}

        <div className="p-4">
          <div className="row">
            <div
              className={`col-6 h-[60vh] overflow-y-scroll ${
                openCreateSide ? "hidden" : ""
              }`}
            >
              {tutors.isLoading ? (
                <div>
                  {[1, 2, 3, 4].map((_, index) => (
                    <div className="mt-3" key={index}>
                      <ShimmerLoading height="100px" />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {tutors.tutors.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div
                        onClick={() =>
                          selectTutor == item._id
                            ? setSelectTutor("")
                            : setSelectTutor(item._id)
                        }
                        className="cursor-pointer p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img
                                src={item.image}
                                className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                                alt="tutorImage"
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {item.group?.length || 0} ta guruh
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModalHandler(item);
                              }}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <MdEdit size={16} />
                            </motion.button>
                            <motion.div
                              animate={{
                                rotate: selectTutor == item._id ? 90 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <i className="bi bi-chevron-right text-gray-400 text-lg"></i>
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectTutor == item._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-gray-100 p-4 bg-gray-50"
                          >
                            <div className="space-y-3">
                              {item.group &&
                                item.group.map((group, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                  >
                                    <span className="font-medium text-gray-800">
                                      {group.name}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                          setSelectedGroupForStudents(group);
                                          loadGroupStudents(group.name);
                                          setOpenStudentsModal(true);
                                        }}
                                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                        title="Studentlarni ko'rish"
                                      >
                                        <MdVisibility size={16} />
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                          setOpenWarningModal(true);
                                          setSelectGroup({
                                            tutor: {
                                              id: item._id,
                                              tutorName: item.name,
                                            },
                                            group: group.name,
                                          });
                                        }}
                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                        title="Guruhni o'chirish"
                                      >
                                        <MdDelete size={16} />
                                      </motion.button>
                                    </div>
                                  </motion.div>
                                ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className={`${openCreateSide ? "col-7" : "col-6"}`}>
              {openCreateSide && (
                <div className="input flex my-3 bg-[#F2F5F9] p-2 rounded-lg">
                  <input
                    type="text"
                    placeholder="Qidirish"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 col-11 rounded-lg outline-none text-xl bg-transparent"
                  />
                  <div className="col-1 flex items-center justify-center">
                    <button className="btn btn-primary">
                      <i className="bi bi-search text-xl"></i>
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Mavjud Guruhlar
                </h3>

                {tutors.groupLoading ? (
                  <div>
                    {[1, 2, 3, 4].map((_, index) => (
                      <div className="mt-3" key={index}>
                        <ShimmerLoading height="80px" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[55vh] overflow-y-auto space-y-3">
                    {tutors.groups &&
                      tutors.groups.map((item, index) => (
                        <motion.div
                          key={item.id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => {
                            if (openCreateSide) {
                              const isSelected = selectGroups.find(
                                (c) => c.code == item.id
                              );
                              if (isSelected) {
                                setSelectGroups(
                                  selectGroups.filter((c) => c.code != item.id)
                                );
                              } else {
                                setSelectGroups([
                                  ...selectGroups,
                                  {
                                    name: item.name,
                                    code: item.id,
                                  },
                                ]);
                              }
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {item.educationLang?.name}
                              </p>
                            </div>
                            {openCreateSide && (
                              <div
                                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                  selectGroups.find((c) => c.code == item.id)
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectGroups.find(
                                  (c) => c.code == item.id
                                ) && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 400,
                                    }}
                                  >
                                    <MdCheck className="text-white text-sm" />
                                  </motion.div>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center mt-6 justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setOpenCreateSide(true);
                clearStates();
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <MdAdd size={20} />
              <span className="font-medium">Yangi Tutor</span>
            </motion.button>
          </div>
        </div>
      </BoxComponent>
    </div>
  );
};

export default Tutors;
