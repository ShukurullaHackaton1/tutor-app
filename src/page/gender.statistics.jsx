import React from "react";
import BoxComponent from "../components/boxComponent";
import { useDispatch, useSelector } from "react-redux";
import DownloadIcon from "../icons/download.png";
import ShimmerLoading from "../components/loading/loading";
import PieActiveArc from "../components/chart";
import { changeFullPage } from "../store/slice/ui.slice";
import * as XLSX from "xlsx"; // 📌 Excel uchun kutubxona

const GenderStatistics = () => {
  const statistics = useSelector((state) => state.statistics);
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const changeSizePage = () => {
    dispatch(changeFullPage(!fullStatisticPage));
  };

  // 📌 **Chart ma'lumotlarini Excel formatda yuklab olish**
  const downloadExcel = () => {
    if (
      !statistics.studentsByGender ||
      statistics.studentsByGender.length === 0
    ) {
      alert("Yuklab olish uchun ma'lumot yo'q!");
      return;
    }

    // 📌 **Excel uchun JSON formatni yaratish**
    const excelData = [["Nomi", "Qiymati"]]; // Sarlavhalar
    statistics.studentsByGender.forEach((item) => {
      excelData.push([item.label, item.value]);
    });

    // 📌 **Ma'lumotlarni worksheetga o‘tkazish**
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statistika");

    // 📌 **Pie Chart qo‘shish**
    const chartRef = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: statistics.studentsByGender.length, c: 1 },
    });

    if (!ws["!charts"]) ws["!charts"] = [];
    ws["!charts"].push({
      type: "pie",
      title: "Statistika Diagramma",
      range: chartRef,
      pos: { x: 2, y: 10, w: 500, h: 300 }, // 📌 Grafikning joylashuvi va o‘lchami
    });

    // 📌 **Faylni yuklab olish**
    XLSX.writeFile(wb, "Statistika.xlsx");
  };

  return (
    <div className="">
      <BoxComponent>
        <div className="flex items-center justify-between">
          <div className="title text-[20px] font-[500] mb-2"></div>
          <button className="btn bg-[#255ED6]" onClick={changeSizePage}>
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
    </div>
  );
};

export default GenderStatistics;
