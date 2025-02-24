import React, { useState } from "react";
import QmuLogo from "../../public/images/qmu-logo.png";
import Link from "antd/es/typography/Link";
import { useDispatch, useSelector } from "react-redux";
import AdminService from "../service/admin.service";
import { useNavigate } from "react-router-dom";
import { Error, Success } from "../components/alert";

const Sign = () => {
  const { isLoading } = useSelector((state) => state.admin);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const { status } = await AdminService.loginAdmin(dispatch, navigate, {
      username: login,
      password,
    });

    if (status === "error") {
      setErrorMessage(
        "Xurmatli foydalanuvchi, login yoki parol noto’gri kiritilgan, qaytadan urunib koring!"
      );
      setShowError(true);
    }
    if (status === "success") {
      setSuccessMessage("Profilga muaffaqiyatli kirildi");
      setShowSuccess(true);
    }
  };

  return (
    <div className="w-100 h-[100vh] flex items-center justify-center">
      {showError && <Error state={true} msg={errorMessage} />}
      {showSuccess && <Success state={true} msg={successMessage} />}
      <main className="w-[60%] flex items-center justify-center mx-auto bg-white h-auto p-3 rounded-lg shadow-md">
        <div className="text-center  w-[60%] mx-auto">
          <div className="form-header text-center">
            <div className="flex items-center justify-center">
              <img src={QmuLogo} alt="" />
            </div>
            <h1 className="text-[40px] font-[700] my-3">Kirish</h1>
            <p>Akkauntingizga kirish uchun login va parol kiriting</p>

            <form
              onSubmit={submitHandler}
              className="border w-[80%] p-5 mt-3 mx-auto rounded-lg"
            >
              <div className=" grid">
                <label
                  htmlFor="login"
                  className="block text-start font-[500] mb-2 text-[#6B7280] w-100 "
                >
                  Login *
                </label>
                <input
                  type="text"
                  id="login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="block border outline-none p-2 py-1 rounded-lg bg-[#F3F4F6] text-[16px]"
                />
              </div>
              <div className=" my-3 grid">
                <label
                  htmlFor="password"
                  className="block text-start font-[500] mb-2 text-[#6B7280] w-100 "
                >
                  Parol *
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block border outline-none p-2 py-1 rounded-lg bg-[#F3F4F6] text-[16px]"
                />
              </div>
              <Link to={`#`}>Login yoki parolni esdan chiqardingizmi?</Link>
              <button
                disabled={isLoading}
                className="btn btn-primary mt-2 w-100"
              >
                {isLoading ? "Yuborilmoqda..." : "Kirish"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sign;
