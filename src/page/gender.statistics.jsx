import React, { useEffect } from "react";
import BoxComponent from "../components/boxComponent";
import { useDispatch, useSelector } from "react-redux";
import StatisticsService from "../service/statistics.service";
import ShimmerLoading from "../components/loading/loading";
import PieActiveArc from "../components/chart";
import { changeFullPage } from "../store/slice/ui.slice";

const GenderStatistics = () => {
  const statistics = useSelector((state) => state.statistics);
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const changeSizePage = () => {
    dispatch(changeFullPage(!fullStatisticPage));
  };
  return (
    <div className="">
      <BoxComponent>
        <div className="flex items-center justify-between">
          <div className="title text-[20px] font-[500] mb-2">Statistika</div>
          <button className="btn bg-[#255ED6]" onClick={() => changeSizePage()}>
            <i
              className={`bi text-[20px] text-[#fff] ${
                fullStatisticPage
                  ? "bi-arrows-angle-contract"
                  : "bi-arrows-angle-expand"
              }`}
            ></i>
          </button>
        </div>
        <div className="h-[80vh] w-[70%] mx-auto flex items-center">
          <div className="w-100">
            {statistics.isLoading ? (
              <ShimmerLoading height="400px" />
            ) : (
              <PieActiveArc height={300} data={statistics.studentsByGender} />
            )}
          </div>
        </div>
      </BoxComponent>
    </div>
  );
};

export default GenderStatistics;
