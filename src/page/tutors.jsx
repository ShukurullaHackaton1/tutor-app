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
  console.log(tutors.groups);

  const [openCreateSide, setOpenCreateSide] = useState(false);
  const [thumbnailImage, setThumbnailImage] = useState(
    "https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small/simple-user-default-icon-free-png.png"
  );
  const [image, setImage] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
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

  const createHandler = async (e) => {
    e.preventDefault();
    console.log("bosildi");

    // Majburiy maydonlarni tekshirish
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

    // Agar rasm tanlangan bo'lsa qo'shamiz
    if (image && image instanceof File) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:7788/tutor/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-jwt")}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (data.status == "success") {
        toast.success("Tutor muaffaqiyatli yaratildi!!");
        setOpenCreateSide(false);
        clearStates(); // State'larni tozalash
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

  const removeHandler = () => {
    TutorService.tutorsRemoveGroup(dispatch, selectGroup.tutor.id, {
      groupName: selectGroup.group,
    });
    console.log(selectGroup.tutor.id, selectGroup.group);

    setOpenWarningModal(false);
    setSelectGroup({
      tutor: {
        id: "",
        tutorName: "",
      },
      group: "",
    });
  };

  return (
    <div className="h-[100vh] overflow-y-scroll">
      <div className="mb-3">
        <Link className="text-primary">Tutorlar</Link>{" "}
        <i className="bi bi-chevron-right"></i>
      </div>
      {openWarningModal ? (
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
      ) : (
        ""
      )}
      <BoxComponent>
        {openCreateSide ? (
          <OptionComponent state={openCreateSide}>
            <div className="config">
              <div className="flex gap-3 items-center">
                <div
                  onClick={() => {
                    setOpenCreateSide(false);
                    clearStates(); // Yopilganda state'larni tozalash
                  }}
                  className="w-[40px]  cursor-pointer h-[40px] flex items-center justify-center bg-white rounded-lg"
                >
                  <i className="bi bi-arrow-left text-2xl "></i>
                </div>
                <div className="text-2xl font-[500]">Tyutor</div>
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

            <form onSubmit={(e) => createHandler(e)}>
              <div className="image my-4">
                <label
                  className="flex items-center justify-center"
                  htmlFor="image"
                >
                  <div className="w-[130px] rounded-lg bg-white p-3 h-[130px] relative">
                    <img
                      src={thumbnailImage}
                      className="w-[100px] h-[100px] rounded-lg object-cover"
                    />
                    <img
                      src={EditPng}
                      className="w-[20px] cursor-pointer absolute bottom-[-10px] right-[-10px] h-[20px]"
                      alt=""
                    />
                  </div>
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={(e) => changeImage(e)}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div className="input flex my-3 bg-white p-2  rounded-lg">
                <input
                  type="text"
                  placeholder="Ism"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="p-2 col-11 outline-none text-xl"
                  required
                />
                <div className="col-1 flex items-center justify-center">
                  <img src={EditPng} className="w-[30px] h-[30px]" alt="" />
                </div>
              </div>
              <div className="input flex my-3 bg-white p-2  rounded-lg">
                <input
                  type="text"
                  placeholder="Familiya"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="p-2 col-11 outline-none text-xl"
                  required
                />
                <div className="col-1 flex items-center justify-center">
                  <img src={EditPng} className="w-[30px] h-[30px]" alt="" />
                </div>
              </div>
              <div className="input flex my-3 bg-white p-2  rounded-lg">
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
                  <img src={EditPng} className="w-[30px] h-[30px]" alt="" />
                </div>
              </div>
              <div className="input flex my-3 bg-white p-2  rounded-lg">
                <input
                  type="text"
                  placeholder="Login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="p-2 col-11 outline-none text-xl"
                  required
                />
                <div className="col-1 flex items-center justify-center">
                  <img src={EditPng} className="w-[30px] h-[30px]" alt="" />
                </div>
              </div>
              <div className="input flex my-3 bg-white p-2  rounded-lg">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 col-11 outline-none text-xl"
                  required
                />
                <div className="col-1 flex items-center justify-center">
                  <img src={EditPng} className="w-[30px] h-[30px]" alt="" />
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
        ) : (
          ""
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
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                </div>
              ) : (
                <div>
                  {tutors.tutors.map((item) => (
                    <div
                      key={item._id}
                      className="cursor-pointer mb-3 bg-[#F2F5F9] p-3 rounded-lg"
                    >
                      <div
                        onClick={() =>
                          selectTutor == item._id
                            ? setSelectTutor("")
                            : setSelectTutor(item._id)
                        }
                        className="flex  items-center justify-between"
                      >
                        <div className="info flex item-center items-center gap-4">
                          <img
                            src={item.image}
                            className="w-[60px] bg-[#fff] h-[60px] rounded-full object-cover"
                            alt="tutorImage"
                          />
                          <div className="">
                            <h1 className="text-xl font-[500]">{item.name}</h1>
                          </div>
                        </div>
                        <i
                          className={`bi text-xl font bi-chevron-right ${
                            selectTutor == item._id ? "rotate-90" : ""
                          }`}
                        ></i>
                      </div>
                      {selectTutor == item._id ? (
                        <>
                          {item.group &&
                            item.group.map((group, index) => (
                              <div
                                key={index}
                                className="p-3 flex items-center justify-between px-4 text-lg font-[500]"
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
                                  className="cursor-pointer"
                                  alt="delete"
                                />
                              </div>
                            ))}
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={`${openCreateSide ? "col-7" : "col-6"}`}>
              {openCreateSide ? (
                <div className="input flex my-3 bg-[#F2F5F9] p-2  rounded-lg">
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
              ) : (
                ""
              )}
              {tutors.groupLoading ? (
                <div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="h-[60vh] overflow-y-scroll">
                    {tutors.groups &&
                      tutors.groups.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="cursor-pointer mb-3 bg-[#F2F5F9] p-3 rounded-lg "
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
                                    code: item.id, // id ni code sifatida jo'natamiz
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
                            {openCreateSide ? (
                              <div
                                className={`w-[30px] flex items-center justify-center text-[#F2F5F9] h-[30px] border rounded-md ${
                                  selectGroups.find((c) => c.code == item.id)
                                    ? "bg-primary"
                                    : " bg-white"
                                }`}
                              >
                                {selectGroups.find((c) => c.code == item.id) ? (
                                  <i className="bi bi-check text-3xl"></i>
                                ) : (
                                  ""
                                )}
                              </div>
                            ) : (
                              ""
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
                clearStates(); // Ochilganda state'larni tozalash
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
