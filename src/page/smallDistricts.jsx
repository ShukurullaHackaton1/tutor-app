import React from "react";
import ShimmerLoading from "../components/loading/loading";
import BoxComponent from "../components/boxComponent";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { changeFullPage } from "../store/slice/ui.slice";

const SmallDistricts = () => {
  const statistics = useSelector((state) => state.statistics);
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const data = statistics.smallDistricts.map((item) => ({
    name: item.title,
    count: item.total,
  }));

  const dispatch = useDispatch();

  const changeSizePage = () => {
    dispatch(changeFullPage(!fullStatisticPage));
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statistics");

    XLSX.writeFile(workbook, "SmallDistricts_Statistics.xlsx");
  };

  return (
    <BoxComponent>
      <div className="flex items-center justify-between">
        <div className="title text-[20px] font-[500] mb-2">Statistika</div>
        <div className="flex gap-2">
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
                  Ijarada yashovchi talabalar kichik tumanlar kesimida
                </span>
              </p>
            </>
          )}
        </div>
      </div>
      <div className="text-end">
        <button className="btn bg-[#255ED6]" onClick={downloadExcel}>
          <i className="bi bi-download text-[20px] text-[#fff]"></i>
        </button>
      </div>
    </BoxComponent>
  );
};

export default SmallDistricts;
