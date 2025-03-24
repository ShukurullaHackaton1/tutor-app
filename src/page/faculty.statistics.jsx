import React, { useState } from "react";
import { CustomChart } from "../components/chart";
import axios from "../service/api";
import { useQuery } from "@tanstack/react-query";
import BoxComponent from "../components/boxComponent";
import ShimmerLoading from "../components/loading/loading";
import FilterIcon from "../icons/filter.png";
import DownloadIcon from "../icons/download.png";
import { useDispatch, useSelector } from "react-redux";
import { changeCreateSide, changeFullPage } from "../store/slice/ui.slice";
import OptionComponent from "../components/option.component";

const FacultyStatistics = () => {
  const { facultyData, isLoading } = useSelector((state) => state.statistics);
  const data = facultyData;
  const { fullStatisticPage, openCreateSide } = useSelector(
    (state) => state.ui
  );
  const dispatch = useDispatch();

  if (isLoading)
    return (
      <BoxComponent>
        <div className="w-100 h-100 p-3 flex items-center justify-center">
          <ShimmerLoading width="800px" height="600px" />
        </div>
      </BoxComponent>
    );

  const changeSizePage = () => {
    dispatch(changeFullPage(!fullStatisticPage));
  };
  const changeSide = () => {
    dispatch(changeCreateSide(!openCreateSide));
  };

  return (
    <BoxComponent>
      <div className="flex items-center justify-between">
        <div className="title text-[20px] font-[500] mb-2"></div>
        <div className="flex gap-3">
          <button className="btn bg-[#255ED6]" onClick={() => changeSizePage()}>
            <i
              className={`bi text-[20px] text-[#fff] ${
                fullStatisticPage
                  ? "bi-arrows-angle-contract"
                  : "bi-arrows-angle-expand"
              }`}
            ></i>
          </button>
          <button className="btn bg-[#255ED6]" onClick={() => changeSide()}>
            <img src={FilterIcon} alt="" />
          </button>
        </div>
      </div>
      <div className="h-[70vh] w-[100%] mx-auto flex items-center">
        <div className="w-[90%]">
          {isLoading ? (
            <ShimmerLoading height="400px" />
          ) : (
            <CustomChart data={data} />
          )}
        </div>
      </div>
      <div className="text-end">
        <button className="btn bg-[#255ED6]">
          <img
            src={DownloadIcon}
            className="w-[30px] h-[30px]"
            alt="Download"
          />
        </button>
      </div>
    </BoxComponent>
  );
};

export default FacultyStatistics;
