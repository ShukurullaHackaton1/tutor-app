import React from "react";
import * as XLSX from "xlsx";
import BoxComponent from "../components/boxComponent";
import { useDispatch, useSelector } from "react-redux";
import ShimmerLoading from "../components/loading/loading";
import PieActiveArc from "../components/chart";
import { changeFullPage } from "../store/slice/ui.slice";
import DownloadIcon from "../icons/download.png";
import html2canvas from "html2canvas";

const LevelStatistics = () => {
  const statistics = useSelector((state) => state.statistics);
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const changeSizePage = () => {
    dispatch(changeFullPage(!fullStatisticPage));
  };

  const downloadExcel = async () => {
    if (!statistics.studentsLevel || statistics.studentsLevel.length === 0) {
      alert("Statistik ma'lumotlar mavjud emas!");
      return;
    }

    const workbook = XLSX.utils.book_new();

    // Ma'lumotlar jadvali
    const wsData = [
      ["Kurs", "Talabalar soni", "Foiz", "Rang"],
      ...statistics.studentsLevel.map((item) => {
        const totalStudents = statistics.studentsLevel.reduce(
          (sum, s) => sum + s.value,
          0
        );
        return [
          item.label,
          item.value,
          `${((item.value / totalStudents) * 100).toFixed(1)}%`,
          item.color,
        ];
      }),
      ["", "", "", ""],
      [
        "Jami talabalar",
        statistics.studentsLevel.reduce((sum, item) => sum + item.value, 0),
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

    // Rang ustunini formatlash
    for (let row = 2; row <= statistics.studentsLevel.length + 1; row++) {
      const colorCell = `D${row}`;
      if (worksheet[colorCell]) {
        const color =
          statistics.studentsLevel[row - 2]?.color?.replace("#", "") ||
          "FFFFFF";
        worksheet[colorCell].s = {
          fill: { fgColor: { rgb: color } },
          alignment: { horizontal: "center" },
        };
      }
    }

    // Jami qatori uchun stil
    const totalRowIndex = statistics.studentsLevel.length + 3;
    ["A", "B", "C"].forEach((col) => {
      const cell = `${col}${totalRowIndex}`;
      if (worksheet[cell]) {
        worksheet[cell].s = {
          font: { bold: true, sz: 11 },
          fill: { fgColor: { rgb: "E7E6E6" } },
          alignment: { horizontal: "center" },
        };
      }
    });

    // Chart rasmini qo'shish
    try {
      const chartElement = document.getElementById("level-chart-container");
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
            name: "LevelChart",
            image: imageId,
            position: {
              from: { col: 5, row: 1 },
              to: { col: 12, row: 18 },
            },
          },
        ];
      }
    } catch (error) {
      console.error("Chart rasmini qo'shishda xatolik:", error);
    }

    // Ustun kengligini sozlash
    worksheet["!cols"] = [
      { wch: 15 }, // Kurs
      { wch: 18 }, // Talabalar soni
      { wch: 12 }, // Foiz
      { wch: 15 }, // Rang
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Level Statistics");
    XLSX.writeFile(
      workbook,
      `Level_Statistics_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <BoxComponent>
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-gray-800">
          Kurslar bo'yicha statistika
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

      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart qismi */}
          <div className="lg:col-span-2">
            <div
              id="level-chart-container"
              className="bg-white rounded-lg shadow-md p-4"
            >
              {statistics.isLoading ? (
                <ShimmerLoading height="400px" />
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-center mb-4 text-gray-800">
                    Talabalar kurslar bo'yicha taqsimoti
                  </h3>
                  <PieActiveArc height={300} data={statistics.studentsLevel} />
                </div>
              )}
            </div>
          </div>

          {/* Ma'lumotlar paneli */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Kurslar tafsiloti
              </h3>
              {statistics.isLoading ? (
                <ShimmerLoading height="300px" />
              ) : (
                <div className="space-y-3">
                  {statistics.studentsLevel.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-medium text-gray-700">
                          {item.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">
                          {item.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {(
                            (item.value /
                              statistics.studentsLevel.reduce(
                                (sum, s) => sum + s.value,
                                0
                              )) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Umumiy summa */}
                  <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg">
                      <span className="font-semibold text-gray-800">
                        Jami talabalar
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {statistics.studentsLevel
                          .reduce((sum, item) => sum + item.value, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kurslar bo'yicha qo'shimcha statistika */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {statistics.studentsLevel.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow duration-200"
            >
              <div
                className="text-2xl font-bold mb-2"
                style={{ color: item.color }}
              >
                {item.value.toLocaleString()}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {item.label}
              </div>
              <div
                className="text-xs mt-1 px-2 py-1 rounded-full text-white"
                style={{ backgroundColor: item.color }}
              >
                {(
                  (item.value /
                    statistics.studentsLevel.reduce(
                      (sum, s) => sum + s.value,
                      0
                    )) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>
          ))}
        </div>

        {/* Eng ko'p va eng kam kurslar */}
        {!statistics.isLoading && statistics.studentsLevel.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h4 className="font-semibold text-green-600 mb-2">
                Eng ko'p talabali kurs
              </h4>
              <div className="text-lg">
                {
                  statistics.studentsLevel.reduce(
                    (max, item) => (item.value > max.value ? item : max),
                    statistics.studentsLevel[0]
                  ).label
                }{" "}
                -{" "}
                {statistics.studentsLevel
                  .reduce(
                    (max, item) => (item.value > max.value ? item : max),
                    statistics.studentsLevel[0]
                  )
                  .value.toLocaleString()}{" "}
                ta
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h4 className="font-semibold text-orange-600 mb-2">
                Eng kam talabali kurs
              </h4>
              <div className="text-lg">
                {
                  statistics.studentsLevel.reduce(
                    (min, item) => (item.value < min.value ? item : min),
                    statistics.studentsLevel[0]
                  ).label
                }{" "}
                -{" "}
                {statistics.studentsLevel
                  .reduce(
                    (min, item) => (item.value < min.value ? item : min),
                    statistics.studentsLevel[0]
                  )
                  .value.toLocaleString()}{" "}
                ta
              </div>
            </div>
          </div>
        )}
      </div>
    </BoxComponent>
  );
};

export default LevelStatistics;
