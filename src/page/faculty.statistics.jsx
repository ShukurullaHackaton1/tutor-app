import React, { useState } from "react";
import { CustomChart } from "../components/chart";
import BoxComponent from "../components/boxComponent";
import ShimmerLoading from "../components/loading/loading";
import FilterIcon from "../icons/filter.png";
import DownloadIcon from "../icons/download.png";
import { useDispatch, useSelector } from "react-redux";
import { changeCreateSide, changeFullPage } from "../store/slice/ui.slice";
import OptionComponent from "../components/option.component";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";

const FacultyStatistics = () => {
  const { facultyData, isLoading } = useSelector((state) => state.statistics);
  const data = facultyData;
  const { fullStatisticPage, openCreateSide } = useSelector(
    (state) => state.ui
  );
  const dispatch = useDispatch();

  const changeSizePage = () => {
    dispatch(changeFullPage(!fullStatisticPage));
  };

  const changeSide = () => {
    dispatch(changeCreateSide(!openCreateSide));
  };

  const downloadExcel = async () => {
    if (!data || data.length === 0) {
      alert("Yuklab olish uchun ma'lumot yo'q!");
      return;
    }

    const workbook = XLSX.utils.book_new();

    // Ma'lumotlar jadvali yaratish
    const wsData = [
      [
        "Fakultet nomi",
        "Jami talabalar",
        "Ijarada yashovchi talabalar",
        "Ijarada yashovchilar foizi",
      ],
      ...data.map((item) => [
        item.name,
        item.jami,
        item.ijarada,
        `${((item.ijarada / item.jami) * 100).toFixed(1)}%`,
      ]),
      ["", "", "", ""],
      [
        "JAMI",
        data.reduce((sum, item) => sum + item.jami, 0),
        data.reduce((sum, item) => sum + item.ijarada, 0),
        `${(
          (data.reduce((sum, item) => sum + item.ijarada, 0) /
            data.reduce((sum, item) => sum + item.jami, 0)) *
          100
        ).toFixed(1)}%`,
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
    for (let row = 2; row <= data.length + 1; row++) {
      // Jami talabalar ustuni (ko'k rang)
      const jamiCell = `B${row}`;
      if (worksheet[jamiCell]) {
        worksheet[jamiCell].s = {
          fill: { fgColor: { rgb: "E3F2FD" } },
          alignment: { horizontal: "center" },
          font: { bold: true },
        };
      }

      // Ijarada yashovchilar ustuni (yashil rang)
      const ijaradaCell = `C${row}`;
      if (worksheet[ijaradaCell]) {
        worksheet[ijaradaCell].s = {
          fill: { fgColor: { rgb: "E8F5E8" } },
          alignment: { horizontal: "center" },
          font: { bold: true },
        };
      }
    }

    // Jami qatori uchun stil
    const totalRowIndex = data.length + 3;
    ["A", "B", "C", "D"].forEach((col) => {
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
      const chartElement = document.getElementById("faculty-chart-container");
      if (chartElement) {
        const canvas = await html2canvas(chartElement, {
          backgroundColor: "#ffffff",
          scale: 2,
          height: chartElement.scrollHeight,
          windowWidth: chartElement.scrollWidth,
        });

        const chartImageBase64 = canvas.toDataURL("image/png").split(",")[1];
        const imageId = workbook.addImage({
          base64: chartImageBase64,
          extension: "png",
        });

        worksheet["!images"] = [
          {
            name: "FacultyChart",
            image: imageId,
            position: {
              from: { col: 5, row: 1 },
              to: { col: 15, row: 25 },
            },
          },
        ];
      }
    } catch (error) {
      console.error("Chart rasmini qo'shishda xatolik:", error);
    }

    // Ustun kengligini sozlash
    worksheet["!cols"] = [
      { wch: 30 }, // Fakultet nomi
      { wch: 18 }, // Jami talabalar
      { wch: 25 }, // Ijarada yashovchi talabalar
      { wch: 22 }, // Ijarada yashovchilar foizi
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty Statistics");

    // Ikkinchi sheet - Taqqoslash jadval
    const comparisonData = [
      ["Fakultet", "Ijarada yalamagan", "Ijarada yashovchi", "Jami"],
      ...data.map((item) => [
        item.name,
        item.jami - item.ijarada,
        item.ijarada,
        item.jami,
      ]),
    ];

    const comparisonWs = XLSX.utils.aoa_to_sheet(comparisonData);
    XLSX.utils.book_append_sheet(workbook, comparisonWs, "Comparison");

    XLSX.writeFile(
      workbook,
      `Faculty_Statistics_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  if (isLoading) {
    return (
      <BoxComponent>
        <div className="w-100 h-100 p-3 flex items-center justify-center">
          <ShimmerLoading width="800px" height="600px" />
        </div>
      </BoxComponent>
    );
  }

  return (
    <BoxComponent>
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-gray-800">
          Fakultetlar bo'yicha statistika
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
            className="btn bg-[#6c757d] text-white px-4 py-2 rounded-lg hover:bg-[#5a6268] transition-colors duration-200"
            onClick={changeSide}
          >
            <img src={FilterIcon} className="w-5 h-5" alt="Filter" />
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

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
        {/* Umumiy ma'lumotlar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {data.reduce((sum, item) => sum + item.jami, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Jami talabalar</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {data
                .reduce((sum, item) => sum + item.ijarada, 0)
                .toLocaleString()}
            </div>
            <div className="text-gray-600">Ijarada yashovchi</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {(
                data.reduce((sum, item) => sum + item.jami, 0) -
                data.reduce((sum, item) => sum + item.ijarada, 0)
              ).toLocaleString()}
            </div>
            <div className="text-gray-600">O'z uyida yashovchi</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {data.length}
            </div>
            <div className="text-gray-600">Fakultetlar soni</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-800">
            Fakultetlar bo'yicha talabalar taqsimoti
          </h3>
          <div id="faculty-chart-container">
            {isLoading ? (
              <ShimmerLoading height="400px" />
            ) : (
              <CustomChart data={data} />
            )}
          </div>
        </div>

        {/* Eng yuqori va eng past ko'rsatkichlar */}
        {!isLoading && data.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-green-600 mb-4 text-lg">
                Eng yuqori ko'rsatkichlar
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">
                    Eng ko'p talabali fakultet:
                  </span>
                  <div className="font-bold text-blue-600">
                    {
                      data.reduce(
                        (max, item) => (item.jami > max.jami ? item : max),
                        data[0]
                      ).name
                    }
                    <span className="text-sm text-gray-500 ml-2">
                      (
                      {data
                        .reduce(
                          (max, item) => (item.jami > max.jami ? item : max),
                          data[0]
                        )
                        .jami.toLocaleString()}{" "}
                      ta)
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    Eng ko'p ijarada yashovchi:
                  </span>
                  <div className="font-bold text-green-600">
                    {
                      data.reduce(
                        (max, item) =>
                          item.ijarada > max.ijarada ? item : max,
                        data[0]
                      ).name
                    }
                    <span className="text-sm text-gray-500 ml-2">
                      (
                      {data
                        .reduce(
                          (max, item) =>
                            item.ijarada > max.ijarada ? item : max,
                          data[0]
                        )
                        .ijarada.toLocaleString()}{" "}
                      ta)
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    Eng yuqori ijara foizi:
                  </span>
                  <div className="font-bold text-purple-600">
                    {
                      data.reduce(
                        (max, item) =>
                          item.ijarada / item.jami > max.ijarada / max.jami
                            ? item
                            : max,
                        data[0]
                      ).name
                    }
                    <span className="text-sm text-gray-500 ml-2">
                      (
                      {(
                        (data.reduce(
                          (max, item) =>
                            item.ijarada / item.jami > max.ijarada / max.jami
                              ? item
                              : max,
                          data[0]
                        ).ijarada /
                          data.reduce(
                            (max, item) =>
                              item.ijarada / item.jami > max.ijarada / max.jami
                                ? item
                                : max,
                            data[0]
                          ).jami) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-orange-600 mb-4 text-lg">
                Eng past ko'rsatkichlar
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">
                    Eng kam talabali fakultet:
                  </span>
                  <div className="font-bold text-blue-600">
                    {
                      data.reduce(
                        (min, item) => (item.jami < min.jami ? item : min),
                        data[0]
                      ).name
                    }
                    <span className="text-sm text-gray-500 ml-2">
                      (
                      {data
                        .reduce(
                          (min, item) => (item.jami < min.jami ? item : min),
                          data[0]
                        )
                        .jami.toLocaleString()}{" "}
                      ta)
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    Eng kam ijarada yashovchi:
                  </span>
                  <div className="font-bold text-green-600">
                    {
                      data.reduce(
                        (min, item) =>
                          item.ijarada < min.ijarada ? item : min,
                        data[0]
                      ).name
                    }
                    <span className="text-sm text-gray-500 ml-2">
                      (
                      {data
                        .reduce(
                          (min, item) =>
                            item.ijarada < min.ijarada ? item : min,
                          data[0]
                        )
                        .ijarada.toLocaleString()}{" "}
                      ta)
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    Eng past ijara foizi:
                  </span>
                  <div className="font-bold text-purple-600">
                    {
                      data.reduce(
                        (min, item) =>
                          item.ijarada / item.jami < min.ijarada / min.jami
                            ? item
                            : min,
                        data[0]
                      ).name
                    }
                    <span className="text-sm text-gray-500 ml-2">
                      (
                      {(
                        (data.reduce(
                          (min, item) =>
                            item.ijarada / item.jami < min.ijarada / min.jami
                              ? item
                              : min,
                          data[0]
                        ).ijarada /
                          data.reduce(
                            (min, item) =>
                              item.ijarada / item.jami < min.ijarada / min.jami
                                ? item
                                : min,
                            data[0]
                          ).jami) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tafsiliy jadval */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h4 className="font-semibold text-gray-800 mb-4 text-lg">
            Tafsiliy ma'lumotlar
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Fakultet
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-700">
                    Jami
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-700">
                    Ijarada
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-700">
                    O'z uyida
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-700">
                    Ijara %
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2 font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-4 py-2 text-center text-blue-600 font-bold">
                      {item.jami.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-center text-green-600 font-bold">
                      {item.ijarada.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-center text-orange-600 font-bold">
                      {(item.jami - item.ijarada).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          (item.ijarada / item.jami) * 100 > 50
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {((item.ijarada / item.jami) * 100).toFixed(1)}%
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
export default FacultyStatistics;
