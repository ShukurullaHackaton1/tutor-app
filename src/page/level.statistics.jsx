import React, { useEffect } from "react";
import * as XLSX from "xlsx";
import BoxComponent from "../components/boxComponent";
import { useDispatch, useSelector } from "react-redux";
import ShimmerLoading from "../components/loading/loading";
import PieActiveArc from "../components/chart";
import { changeFullPage } from "../store/slice/ui.slice";
import DownloadIcon from "../icons/download.png";

const LevelStatistics = () => {
  const statistics = useSelector((state) => state.statistics);
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const changeSizePage = () => {
    dispatch(changeFullPage(!fullStatisticPage));
  };

  const downloadExcel = () => {
    if (!statistics.studentsLevel || statistics.studentsLevel.length === 0) {
      alert("Statistik ma'lumotlar mavjud emas!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      statistics.studentsLevel.map((item) => {
        return { Kurs: item.label, Soni: item.value };
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statistika");

    XLSX.writeFile(workbook, "Statistika.xlsx");
  };

  return (
    <BoxComponent>
      <div className="flex items-center justify-between">
        <div className="title text-[20px] font-[500] mb-2"></div>
        <div className="flex gap-3">
          <button
            className="btn bg-[#255ED6] text-white px-3 py-2 rounded"
            onClick={changeSizePage}
          >
            <i
              className={`bi text-[20px] ${
                fullStatisticPage
                  ? "bi-arrows-angle-contract"
                  : "bi-arrows-angle-expand"
              }`}
            ></i>
          </button>
        </div>
      </div>
      <div className="h-[80vh] w-[70%] mx-auto flex items-center">
        <div className="w-100">
          {statistics.isLoading ? (
            <ShimmerLoading height="400px" />
          ) : (
            <PieActiveArc height={300} data={statistics.studentsLevel} />
          )}
        </div>
      </div>
      <div className="text-end">
        <button className="btn bg-[#255ED6]" onClick={downloadExcel}>
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

export default LevelStatistics;
