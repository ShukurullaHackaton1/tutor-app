import React, { useEffect, useState } from "react";
import { changePage } from "../store/slice/ui.slice";
import { useDispatch, useSelector } from "react-redux";
import BoxComponent from "../components/boxComponent";
import { Link } from "react-router-dom";
import TutorService from "../service/tutor.service";
import ShimmerLoading from "../components/loading/loading";
import TrashIcon from "../icons/trash.png";
import OptionComponent from "../components/option.component";
import EditPng from "../icons/Edit.png";
import toast from "react-hot-toast";

const Tutors = () => {
  const dispatch = useDispatch();
  const tutors = useSelector((state) => state.tutor);
  const [selectTutor, setSelectTutor] = useState("");

  const [openCreateSide, setOpenCreateSide] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddGroupModal, setOpenAddGroupModal] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);
  const [addingGroupToTutor, setAddingGroupToTutor] = useState(null);

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
    setEditThumbnailImage(
      tutor.image ||
        "https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small/simple-user-default-icon-free-png.png"
    );
    setOpenEditModal(true);
  };

  // Add group modal ni ochish
  const openAddGroupModalHandler = (tutor) => {
    setAddingGroupToTutor(tutor);
    setAddingGroups([]);
    setOpenAddGroupModal(true);
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
        toast.success("Tutor muaffaqiyatli yaratildi!!");
        setOpenCreateSide(false);
        clearStates();
        TutorService.getTutors(dispatch);

        // TutorNotification yaratish
        await createTutorNotification(
          data.data._id,
          `Siz ${selectGroups.map((g) => g.name).join(", ")} guruh${
            selectGroups.length > 1 ? "lari" : "i"
          }ga tutor qilib tayinlandingiz`
        );
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

    if (editImage && editImage instanceof File) {
      formData.append("image", editImage);
    }

    try {
      // URL ni yangilash - tutorning ID sini parametrga qo'shish
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

  // Guruh qo'shish
  const addGroupsHandler = async () => {
    if (addingGroups.length === 0) {
      return setError({
        state: true,
        message: "Iltimos, qo'shiladigan guruhlarni tanlang",
      });
    }

    try {
      const response = await fetch(
        `https://tutorapp.kerek.uz/tutor/add-group/${addingGroupToTutor._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin-jwt")}`,
          },
          body: JSON.stringify({ groups: addingGroups }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        toast.success("Guruhlar muvaffaqiyatli qo'shildi!");
        setOpenAddGroupModal(false);
        setAddingGroups([]);
        TutorService.getTutors(dispatch);

        // TutorNotification yaratish
        await createTutorNotification(
          addingGroupToTutor._id,
          `Siz ${addingGroups.map((g) => g.name).join(", ")} guruh${
            addingGroups.length > 1 ? "lari" : "i"
          }ga tutor qilib qo'shildingiz`
        );
      } else {
        setError({
          state: true,
          message: data.message || "Guruh qo'shishda xatolik yuz berdi",
        });
      }
    } catch (error) {
      console.error("Error adding groups:", error);
      setError({
        state: true,
        message: "Guruh qo'shishda xatolik yuz berdi",
      });
    }
  };

  // TutorNotification yaratish funksiyasi
  const createTutorNotification = async (tutorId, message) => {
    try {
      await fetch("https://tutorapp.kerek.uz/tutor-notification/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-jwt")}`,
        },
        body: JSON.stringify({
          tutorId,
          message,
        }),
      });
    } catch (error) {
      console.error("Error creating tutor notification:", error);
    }
  };

  const removeHandler = async () => {
    try {
      await TutorService.tutorsRemoveGroup(dispatch, selectGroup.tutor.id, {
        groupName: selectGroup.group,
      });

      // TutorNotification yaratish
      await createTutorNotification(
        selectGroup.tutor.id,
        `Siz endi ${selectGroup.group} guruhining tutori emassiz`
      );

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
        <Link className="text-primary">Tutorlar</Link>{" "}
        <i className="bi bi-chevron-right"></i>
      </div>

      {/* Warning Modal */}
      {openWarningModal && (
        <div className="w-100 h-100 absolute z-[99] top-0 left-0 flex items-center justify-center bg-[#0000005c]">
          <div className="w-[50%]">
            <BoxComponent>
              <h1 className="text-xl font-[500]">
                <b>{selectGroup.tutor.tutorName}</b> nomli tutordan{" "}
                <b>{selectGroup.group}</b> nomli guruhni olib tashlamoqchimisiz
              </h1>
              <div className="flex mt-3 gap-3">
                <button
                  onClick={() => removeHandler()}
                  className="w-[130px] bg-red-500 text-lg p-2 text-white rounded-[10px] font-[500]"
                >
                  Ha
                </button>
                <button
                  onClick={() => {
                    setOpenWarningModal(false);
                    setSelectGroup({ tutor: {}, group: "" });
                  }}
                  className="w-[130px] bg-blue-500 text-lg p-2 text-white rounded-[10px] font-[500]"
                >
                  Bekor qilish
                </button>
              </div>
            </BoxComponent>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {openEditModal && (
        <div className="w-100 h-100 absolute z-[99] top-0 left-0 flex items-center justify-center bg-[#0000005c]">
          <div className="w-[50%] max-h-[90vh] overflow-y-auto">
            <BoxComponent>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-[500]">Tutorni tahrirlash</h1>
                <button
                  onClick={() => {
                    setOpenEditModal(false);
                    clearEditStates();
                  }}
                  className="text-red-500 text-2xl"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
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

              <form onSubmit={updateTutorHandler}>
                <div className="image my-4">
                  <label
                    className="flex items-center justify-center"
                    htmlFor="edit-image"
                  >
                    <div className="w-[130px] rounded-lg bg-white p-3 h-[130px] relative">
                      <img
                        src={editThumbnailImage}
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
                    id="edit-image"
                    onChange={changeEditImage}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="input flex bg-white p-2 rounded-lg">
                    <input
                      type="text"
                      placeholder="Ism"
                      value={editFirstname}
                      onChange={(e) => setEditFirstname(e.target.value)}
                      className="p-2 w-full outline-none text-xl"
                      required
                    />
                  </div>
                  <div className="input flex bg-white p-2 rounded-lg">
                    <input
                      type="text"
                      placeholder="Familiya"
                      value={editLastname}
                      onChange={(e) => setEditLastname(e.target.value)}
                      className="p-2 w-full outline-none text-xl"
                      required
                    />
                  </div>
                </div>

                <div className="input flex my-3 bg-white p-2 rounded-lg">
                  <div className="p-2 col-2 pl-3 outline-none text-xl">
                    +998
                  </div>
                  <input
                    type="number"
                    placeholder="Telefon raqami"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="p-2 col-9 translate-x-[-20px] outline-none text-xl"
                  />
                </div>

                <div className="input flex my-3 bg-white p-2 rounded-lg">
                  <input
                    type="text"
                    placeholder="Login"
                    value={editLogin}
                    onChange={(e) => setEditLogin(e.target.value)}
                    className="p-2 w-full outline-none text-xl"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary text-xl rounded-lg flex-1"
                  >
                    Yangilash
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenEditModal(false);
                      clearEditStates();
                    }}
                    className="btn btn-secondary text-xl rounded-lg flex-1"
                  >
                    Bekor qilish
                  </button>
                </div>
              </form>
            </BoxComponent>
          </div>
        </div>
      )}

      {/* Add Group Modal */}
      {openAddGroupModal && (
        <div className="w-100 h-100 absolute z-[99] top-0 left-0 flex items-center justify-center bg-[#0000005c]">
          <div className="w-[60%] max-h-[90vh] overflow-y-auto">
            <BoxComponent>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-[500]">
                  {addingGroupToTutor?.name} ga guruh qo'shish
                </h1>
                <button
                  onClick={() => {
                    setOpenAddGroupModal(false);
                    setAddingGroups([]);
                  }}
                  className="text-red-500 text-2xl"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
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

              <div className="input flex my-3 bg-[#F2F5F9] p-2 rounded-lg">
                <input
                  type="text"
                  placeholder="Guruh qidirish"
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

              <div className="h-[50vh] overflow-y-scroll">
                {tutors.groupLoading ? (
                  <div>
                    {[1, 2, 3, 4].map((_, index) => (
                      <div className="mt-3" key={index}>
                        <ShimmerLoading height="100px" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {tutors.groups &&
                      tutors.groups
                        .filter(
                          (group) =>
                            !addingGroupToTutor?.group?.some(
                              (existingGroup) =>
                                existingGroup.name === group.name
                            )
                        )
                        .map((item, index) => (
                          <div
                            key={item.id || index}
                            className="cursor-pointer mb-3 bg-[#F2F5F9] p-3 rounded-lg hover:bg-gray-200 transition-colors"
                            onClick={() => {
                              const isSelected = addingGroups.find(
                                (c) => c.code === item.id
                              );
                              if (isSelected) {
                                setAddingGroups(
                                  addingGroups.filter((c) => c.code !== item.id)
                                );
                              } else {
                                setAddingGroups([
                                  ...addingGroups,
                                  {
                                    name: item.name,
                                    code: item.id,
                                  },
                                ]);
                              }
                            }}
                          >
                            <div className="p-3 flex items-center justify-between px-4 text-lg font-[500]">
                              <div>
                                <div>{item.name}</div>
                                <div className="text-sm text-gray-500">
                                  {item.educationLang?.name}
                                </div>
                              </div>
                              <div
                                className={`w-[30px] flex items-center justify-center text-[#F2F5F9] h-[30px] border rounded-md ${
                                  addingGroups.find((c) => c.code === item.id)
                                    ? "bg-primary"
                                    : "bg-white"
                                }`}
                              >
                                {addingGroups.find(
                                  (c) => c.code === item.id
                                ) ? (
                                  <i className="bi bi-check text-3xl"></i>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={addGroupsHandler}
                  className="btn btn-primary text-xl rounded-lg flex-1"
                  disabled={addingGroups.length === 0}
                >
                  Guruh qo'shish ({addingGroups.length})
                </button>
                <button
                  onClick={() => {
                    setOpenAddGroupModal(false);
                    setAddingGroups([]);
                  }}
                  className="btn btn-secondary text-xl rounded-lg flex-1"
                >
                  Bekor qilish
                </button>
              </div>
            </BoxComponent>
          </div>
        </div>
      )}

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
                    <div
                      key={item._id}
                      className="cursor-pointer mb-3 bg-[#F2F5F9] p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div
                        onClick={() =>
                          selectTutor == item._id
                            ? setSelectTutor("")
                            : setSelectTutor(item._id)
                        }
                        className="flex items-center justify-between"
                      >
                        <div className="info flex item-center items-center gap-4">
                          <img
                            src={item.image}
                            className="w-[60px] bg-[#fff] h-[60px] rounded-full object-cover"
                            alt="tutorImage"
                          />
                          <div>
                            <h1 className="text-xl font-[500]">{item.name}</h1>
                            <p className="text-gray-500">
                              {item.group?.length || 0} ta guruh
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModalHandler(item);
                            }}
                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                            title="Tahrirlash"
                          >
                            <i className="bi bi-pencil text-sm"></i>
                          </button>
                          <i
                            className={`bi text-xl font bi-chevron-right ${
                              selectTutor == item._id ? "rotate-90" : ""
                            }`}
                          ></i>
                        </div>
                      </div>

                      {selectTutor == item._id && (
                        <div className="mt-3">
                          {item.group &&
                            item.group.map((group, index) => (
                              <div
                                key={index}
                                className="p-3 flex items-center justify-between px-4 text-lg font-[500] bg-white rounded-lg mb-2"
                              >
                                <span>{group.name}</span>
                                <img
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
                                  src={TrashIcon}
                                  className="cursor-pointer w-5 h-5"
                                  alt="delete"
                                />
                              </div>
                            ))}

                          {/* Guruh qo'shish tugmasi */}
                          <button
                            onClick={() => openAddGroupModalHandler(item)}
                            className="w-full mt-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <i className="bi bi-plus-lg"></i>
                            <span>Guruh qo'shish</span>
                          </button>
                        </div>
                      )}
                    </div>
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

              {tutors.groupLoading ? (
                <div>
                  {[1, 2, 3, 4].map((_, index) => (
                    <div className="mt-3" key={index}>
                      <ShimmerLoading height="100px" />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="h-[60vh] overflow-y-scroll">
                    {tutors.groups &&
                      tutors.groups.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="cursor-pointer mb-3 bg-[#F2F5F9] p-3 rounded-lg hover:bg-gray-200 transition-colors"
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
                          <div className="p-3 flex items-center justify-between px-4 text-lg font-[500]">
                            <div>
                              <div>{item.name}</div>
                              <div className="text-sm text-gray-500">
                                {item.educationLang?.name}
                              </div>
                            </div>
                            {openCreateSide && (
                              <div
                                className={`w-[30px] flex items-center justify-center text-[#F2F5F9] h-[30px] border rounded-md ${
                                  selectGroups.find((c) => c.code == item.id)
                                    ? "bg-primary"
                                    : "bg-white"
                                }`}
                              >
                                {selectGroups.find((c) => c.code == item.id) ? (
                                  <i className="bi bi-check text-3xl"></i>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center mt-3 justify-end">
            <button
              className="btn btn-primary"
              onClick={() => {
                setOpenCreateSide(true);
                clearStates();
              }}
            >
              <i className="bi bi-plus-lg text-2xl"></i>
            </button>
          </div>
        </div>
      </BoxComponent>
    </div>
  );
};

export default Tutors;
