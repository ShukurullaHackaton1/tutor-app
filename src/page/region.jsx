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
import html2canvas from "html2canvas";

const RegionStatistics = () => {
  const statistics = useSelector((state) => state.statistics);
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const data = statistics.regionStudents.map((item) => ({
    name:
      item.region.length > 15 ? item.region.slice(0, 15) + "..." : item.region,
    fullName: item.region,
    count: item.total,
  }));

  const changeSizePage = () => {
    dispatch(changeFullPage(!fullStatisticPage));
  };

  const downloadExcel = async () => {
    if (!statistics.regionStudents || statistics.regionStudents.length === 0) {
      alert("Statistik ma'lumotlar mavjud emas!");
      return;
    }

    const workbook = XLSX.utils.book_new();

    // Ma'lumotlar jadvali
    const wsData = [
      ["Viloyat/Hudud", "Talabalar soni", "Foiz", "Rang"],
      ...statistics.regionStudents.map((item) => {
        const totalStudents = statistics.regionStudents.reduce(
          (sum, s) => sum + s.total,
          0
        );
        return [
          item.region,
          item.total,
          `${((item.total / totalStudents) * 100).toFixed(1)}%`,
          "#42A5F5", // Chart rangi
        ];
      }),
      ["", "", "", ""],
      [
        "Jami talabalar",
        statistics.regionStudents.reduce((sum, item) => sum + item.total, 0),
        "100%",
        "",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);

    // Header stilini qo'llash
    const headerStyle = {
      font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    ["A1", "B1", "C1", "D1"].forEach((cell) => {
      if (worksheet[cell]) worksheet[cell].s = headerStyle;
    });

    // Ma'lumotlar qatorlarini formatlash
    for (let row = 2; row <= statistics.regionStudents.length + 1; row++) {
      // Talabalar soni ustuni (ko'k rang)
      const countCell = `B${row}`;
      if (worksheet[countCell]) {
        worksheet[countCell].s = {
          fill: { fgColor: { rgb: "E3F2FD" } },
          alignment: { horizontal: "center" },
          font: { bold: true },
        };
      }

      // Rang ustuni
      const colorCell = `D${row}`;
      if (worksheet[colorCell]) {
        worksheet[colorCell].s = {
          fill: { fgColor: { rgb: "42A5F5" } },
          alignment: { horizontal: "center" },
        };
      }
    }

    // Jami qatori uchun stil
    const totalRowIndex = statistics.regionStudents.length + 3;
    ["A", "B", "C"].forEach((col) => {
      const cell = `${col}${totalRowIndex}`;
      if (worksheet[cell]) {
        worksheet[cell].s = {
          font: { bold: true, sz: 12 },
          fill: { fgColor: { rgb: "FFD700" } },
          alignment: { horizontal: "center" },
        };
      }
    });

    // Chart rasmini qo'shish
    try {
      const chartElement = document.getElementById("region-chart-container");
      if (chartElement) {
        const canvas = await html2canvas(chartElement, {
          backgroundColor: "#ffffff",
          scale: 2,
        });

        const chartImageBase64 = canvas.toDataURL("image/png").split(",")[1];
        const imageId = workbook.addImage({
          base64: chartImageBase64,
          extension: "png",
        });

        worksheet["!images"] = [
          {
            name: "RegionChart",
            image: imageId,
            position: {
              from: { col: 5, row: 1 },
              to: { col: 12, row: 20 },
            },
          },
        ];
      }
    } catch (error) {
      console.error("Chart rasmini qo'shishda xatolik:", error);
    }

    // Ustun kengligini sozlash
    worksheet["!cols"] = [
      { wch: 25 }, // Viloyat/Hudud
      { wch: 18 }, // Talabalar soni
      { wch: 12 }, // Foiz
      { wch: 15 }, // Rang
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Region Statistics");
    XLSX.writeFile(
      workbook,
      `Region_Statistics_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <BoxComponent>
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-gray-800">
          Viloyatlar bo'yicha statistika
        </div>
        <div className="flex gap-2">
          <button
            className="btn bg-[#255ED6] text-white px-4 py-2 rounded-lg hover:bg-[#1e4bb8] transition-colors duration-200"
            onClick={changeSizePage}
          >
            <i
              className={`bi text-[18px] ${
                fullStatisticPage
                  ? "bi-arrows-angle-contract"
                  : "bi-arrows-angle-expand"
              }`}
            ></i>
          </button>
          <button
            className="btn bg-[#28a745] text-white px-4 py-2 rounded-lg hover:bg-[#218838] transition-colors duration-200 flex items-center gap-2"
            onClick={downloadExcel}
          >
            <img src={DownloadIcon} className="w-5 h-5" alt="Download" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6">
        {/* Umumiy ma'lumotlar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {statistics.regionStudents
                .reduce((sum, item) => sum + item.total, 0)
                .toLocaleString()}
            </div>
            <div className="text-gray-600">Jami talabalar</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {statistics.regionStudents.length}
            </div>
            <div className="text-gray-600">Viloyatlar soni</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {statistics.regionStudents.length > 0
                ? Math.max(
                    ...statistics.regionStudents.map((item) => item.total)
                  ).toLocaleString()
                : 0}
            </div>
            <div className="text-gray-600">Eng ko'p talaba</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {statistics.regionStudents.length > 0
                ? Math.min(
                    ...statistics.regionStudents.map((item) => item.total)
                  ).toLocaleString()
                : 0}
            </div>
            <div className="text-gray-600">Eng kam talaba</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-800">
            Viloyatlar bo'yicha talabalar taqsimoti
          </h3>
          <div id="region-chart-container">
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
                    <Tooltip
                      formatter={(value, name, props) => [
                        value.toLocaleString(),
                        "Talabalar soni",
                      ]}
                      labelFormatter={(label, payload) => {
                        const item = payload?.[0]?.payload;
                        return item?.fullName || label;
                      }}
                    />
                    <Bar dataKey="count" fill="#42A5F5" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-center flex items-center justify-center gap-2 mt-4">
                  <span className="w-[15px] inline-block h-[15px] bg-[#42A5F5]"></span>
                  <span>
                    Ijarada yashovchi talabalar qaysi viloyat yashovchisi
                  </span>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Eng yuqori va eng past ko'rsatkichlar */}
        {!statistics.isLoading && statistics.regionStudents.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-green-600 mb-4 text-lg">
                TOP 5 Viloyatlar
              </h4>
              <div className="space-y-3">
                {[0, statistics.regionStudents]
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : index === 2
                              ? "bg-orange-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium">{item.region}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {item.total?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {(
                            (item.total /
                              statistics.regionStudents.reduce(
                                (sum, s) => sum + s.total,
                                0
                              )) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-orange-600 mb-4 text-lg">
                Eng kam talabali viloyatlar
              </h4>
              <div className="space-y-3">
                {[...statistics.regionStudents]
                  .sort((a, b) => a.total - b.total)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{item.region}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-600">
                          {item.total.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {(
                            (item.total /
                              statistics.regionStudents.reduce(
                                (sum, s) => sum + s.total,
                                0
                              )) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tafsiliy jadval */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h4 className="font-semibold text-gray-800 mb-4 text-lg">
            Barcha viloyatlar ro'yxati
          </h4>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    #
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Viloyat/Hudud
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-700">
                    Talabalar soni
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-700">
                    Foiz
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...statistics.regionStudents]
                  .sort((a, b) => b.total - a.total)
                  .map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-2 font-medium text-gray-600">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-800">
                        {item.region}
                      </td>
                      <td className="px-4 py-2 text-center text-blue-600 font-bold">
                        {item.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${
                            (item.total /
                              statistics.regionStudents.reduce(
                                (sum, s) => sum + s.total,
                                0
                              )) *
                              100 >
                            5
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {(
                            (item.total /
                              statistics.regionStudents.reduce(
                                (sum, s) => sum + s.total,
                                0
                              )) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BoxComponent>
  );
};

export default RegionStatistics;
