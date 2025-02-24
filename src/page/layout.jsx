import { Col, Row } from "antd";
import React from "react";
import { navItems } from "../constants";
import { Link } from "react-router-dom";
import Header from "../components/header";
import { useSelector } from "react-redux";

const Layout = ({ activePage }) => {
  const { currentPage, fullStatisticPage } = useSelector((state) => state.ui);

  return (
    <div>
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
              <Link className="flex gap-2 font-[500] py-1 text-[16px]" to={"#"}>
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
