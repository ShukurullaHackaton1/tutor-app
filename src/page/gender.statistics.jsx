import React from "react";
import BoxComponent from "../components/boxComponent";
import { useDispatch, useSelector } from "react-redux";
import DownloadIcon from "../icons/download.png";
import ShimmerLoading from "../components/loading/loading";
import PieActiveArc from "../components/chart";
import { changeFullPage } from "../store/slice/ui.slice";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";

const GenderStatistics = () => {
  const statistics = useSelector((state) => state.statistics);
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const changeSizePage = () => {
    dispatch(changeFullPage(!fullStatisticPage));
  };

  // Excel export funksiyasi
  const downloadExcel = async () => {
    if (
      !statistics.studentsByGender ||
      statistics.studentsByGender.length === 0
    ) {
      alert("Yuklab olish uchun ma'lumot yo'q!");
      return;
    }

    const workbook = XLSX.utils.book_new();

    // Ma'lumotlar jadvali yaratish
    const wsData = [
      ["Gender", "Count", "Color"],
      ...statistics.studentsByGender.map((item) => [
        item.label,
        item.value,
        item.color,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);

    // Jadvalni formatlash
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // Header stilini qo'llash
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center" },
      };
    }

    // Ranglar ustunini formatlash
    for (let row = 1; row <= range.e.r; row++) {
      const colorCellAddress = XLSX.utils.encode_cell({ r: row, c: 2 });
      if (worksheet[colorCellAddress]) {
        const color =
          statistics.studentsByGender[row - 1]?.color?.replace("#", "") ||
          "FFFFFF";
        worksheet[colorCellAddress].s = {
          fill: { fgColor: { rgb: color } },
          alignment: { horizontal: "center" },
        };
      }
    }

    // Chart rasmini olish va qo'shish
    try {
      const chartElement = document.getElementById("gender-chart-container");
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
            name: "GenderChart",
            image: imageId,
            position: {
              from: { col: 4, row: 1 },
              to: { col: 10, row: 15 },
            },
          },
        ];
      }
    } catch (error) {
      console.error("Chart rasmini qo'shishda xatolik:", error);
    }

    // Ustun kengligini sozlash
    worksheet["!cols"] = [
      { wch: 20 }, // Gender
      { wch: 15 }, // Count
      { wch: 15 }, // Color
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Gender Statistics");
    XLSX.writeFile(
      workbook,
      `Gender_Statistics_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div>
      <BoxComponent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-gray-800">
            Talabalar jinsi bo'yicha statistika
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

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart qismi */}
            <div className="lg:col-span-2">
              <div
                id="gender-chart-container"
                className="bg-white rounded-lg shadow-md p-4"
              >
                {statistics.isLoading ? (
                  <ShimmerLoading height="400px" />
                ) : (
                  <PieActiveArc
                    height={300}
                    data={statistics.studentsByGender}
                  />
                )}
              </div>
            </div>

            {/* Ma'lumotlar paneli */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Umumiy ma'lumotlar
                </h3>
                {statistics.isLoading ? (
                  <ShimmerLoading height="200px" />
                ) : (
                  <div className="space-y-3">
                    {statistics.studentsByGender.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="font-medium text-gray-700">
                            {item.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-800">
                            {item.value.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(
                              (item.value /
                                statistics.studentsByGender.reduce(
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
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-semibold text-gray-800">
                          Jami talabalar
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          {statistics.studentsByGender
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

          {/* Qo'shimcha statistika */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {statistics.studentsByGender.find((item) =>
                  item.label.includes("Erkak")
                )?.value || 0}
              </div>
              <div className="text-gray-600">Erkak talabalar</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-3xl font-bold text-pink-600">
                {statistics.studentsByGender.find((item) =>
                  item.label.includes("Ayol")
                )?.value || 0}
              </div>
              <div className="text-gray-600">Ayol talabalar</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {(
                  (statistics.studentsByGender.find((item) =>
                    item.label.includes("Ayol")
                  )?.value /
                    statistics.studentsByGender.find((item) =>
                      item.label.includes("Erkak")
                    )?.value) *
                    100 || 0
                ).toFixed(1)}
                %
              </div>
              <div className="text-gray-600">Ayol/Erkak nisbati</div>
            </div>
          </div>
        </div>
      </BoxComponent>
    </div>
  );
};

export default GenderStatistics;
