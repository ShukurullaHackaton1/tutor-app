import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { faculties, navItems } from "../constants";
import { Link } from "react-router-dom";
import Header from "../components/header";
import { useDispatch, useSelector } from "react-redux";
import OptionComponent from "../components/option.component";
import { changeCreateSide } from "../store/slice/ui.slice";
import { getFacultyDataSuccess } from "../store/slice/statistics.slice";
import StatisticsService from "../service/statistics.service";

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
    <div>
      <div
        className={`absolute col-3 transition-[1.4s] shadow-md pt-4 pl-4  top-0 bg-[#FAFAFA] ${
          openCreateSide ? "translate-x-0" : "translate-x-[-100%]"
        } z-[999] h-[100vh]`}
      >
        <div className="config">
          <div className="flex gap-3 items-center">
            <div
              onClick={() => dispatch(changeCreateSide(false))}
              className="w-[40px]  cursor-pointer h-[40px] flex items-center justify-center bg-white rounded-lg"
            >
              <i className="bi bi-arrow-left text-2xl"></i>
            </div>
            <div className="text-2xl font-[500]">Statistika filtri</div>
          </div>
          <div className="h-[85vh] overflow-y-scroll pr-2 pt-3">
            {faculties.map((item) => (
              <div
                onClick={() =>
                  selectFaculty.find((c) => c == item)
                    ? setSelectFaculty(selectFaculty.filter((c) => c !== item))
                    : setSelectFaculty([...selectFaculty, item])
                }
                className="bg-white flex items-center justify-between cursor-pointer p-3 mb-3 rounded-lg font-[600]"
              >
                <p>{item}</p>
                <div
                  className={`w-[30px] flex items-center justify-center text-[#F2F5F9] h-[30px] border rounded-md ${
                    selectFaculty.find((c) => c == item)
                      ? "bg-primary"
                      : " bg-white"
                  }`}
                >
                  {selectFaculty.find((c) => c == item) ? (
                    <i className="bi bi-check text-3xl"></i>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => filterHandler()}
            className="block btn btn-primary w-100 text-xl"
          >
            Saqlash
          </button>
        </div>
      </div>
      <Row>
        <Col span={fullStatisticPage ? 0 : 4} className="gutter-row">
          <div className="h-[100vh] side-bar p-4 bg-white shadow-md">
            <ul className="text-[#BCBCBD]">
              {navItems.map((item) => (
                <Link
                  className={`flex gap-2 font-[500] py-1 text-[16px] ${
                    currentPage == item.title ? "text-[#255ED6]" : ""
                  }`}
                  to={item.path}
                  key={item.path}
                >
                  <i className={item.icon}></i>
                  <span>{item.title}</span>
                </Link>
              ))}
            </ul>
            <ul className="text-[#BCBCBD]">
              <Link className="flex gap-2 font-[500] py-1 text-[16px]" to={"#"}>
                <i className="bi bi-question-circle"></i>
                <span>Yordam</span>
              </Link>
              <Link
                className="flex gap-2 font-[500] py-1 text-[16px]"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                to={"#"}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span>Tizimdan chiqish</span>
              </Link>
            </ul>
          </div>
        </Col>
        <Col span={fullStatisticPage ? 24 : 20} className="gutter-row">
          <div className="p-4 scroll">
            <div
              className={`${
                fullStatisticPage ? "absolute w-[100%] top-[-100%]" : ""
              }`}
            >
              <Header />
            </div>
            <div className="py-2"></div>
            {activePage}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Layout;
