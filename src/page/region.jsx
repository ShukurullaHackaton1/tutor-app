import React from "react";
import * as XLSX from "xlsx";
import ShimmerLoading from "../components/loading/loading";
import BoxComponent from "../components/boxComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { changeFullPage } from "../store/slice/ui.slice";
import DownloadIcon from "../icons/download.png";

const RegionStatistics = () => {
  const statistics = useSelector((state) => state.statistics);
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const data = statistics.regionStudents.map((item) => ({
    name: item.region,
    count: item.total,
  }));

  const changeSizePage = () => {
    dispatch(changeFullPage(!fullStatisticPage));
  };

  const downloadExcel = () => {
    if (!statistics.regionStudents || statistics.regionStudents.length === 0) {
      alert("Statistik ma'lumotlar mavjud emas!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      statistics.regionStudents.map((item) => ({
        Viloyat: item.region,
        Soni: item.total,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Region Statistika");

    XLSX.writeFile(workbook, "Region_Statistika.xlsx");
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
            <>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  layout="vertical"
                  data={data}
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#42A5F5" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center flex items-center justify-center gap-2">
                <span className="w-[15px] inline-block h-[15px] bg-[#42A5F5]"></span>
                <span>
                  Ijarada yashovchi talabalar qaysi viloyat yashovchisi
                </span>
              </p>
            </>
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

export default RegionStatistics;
