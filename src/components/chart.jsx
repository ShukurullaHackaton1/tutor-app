import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Chart, registerables } from "chart.js";
import { toPng } from "html-to-image";

Chart.register(...registerables);

export default function PieActiveArc({ height, data, title = "Pie Chart" }) {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Pie Chart Data");

    // Add title
    worksheet.addRow([title]);
    worksheet.getCell("A1").font = { bold: true, size: 16 };
    worksheet.mergeCells("A1:C1");
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Add column headers
    worksheet.addRow(["Category", "Value", "Percentage"]);
    worksheet.getCell("A2").font = { bold: true };
    worksheet.getCell("B2").font = { bold: true };
    worksheet.getCell("C2").font = { bold: true };

    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Add data rows with percentage calculation
    data.forEach((item, index) => {
      const percentage = ((item.value / total) * 100).toFixed(2) + "%";
      worksheet.addRow([item.label, item.value, percentage]);
    });

    // Create a chart image
    const chartElement = document.getElementById("chart-container");
    if (chartElement) {
      const chartImage = await toPng(chartElement);

      // Add the chart image to the Excel sheet
      const imageId = workbook.addImage({
        base64: chartImage,
        extension: "png",
      });

      worksheet.addImage(imageId, {
        tl: { col: 1, row: 4 + data.length },
        ext: { width: 500, height: 300 },
      });
    }

    // Generate the Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${title.replace(/\s+/g, "_")}.xlsx`);
    });
  };

  return (
    <div>
      <div id="chart-container">
        <PieChart
          series={[
            {
              data: data,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          height={height}
        />
      </div>
    </div>
  );
}

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const CustomChart = ({ data }) => {
  const length = () => {
    if (data.length == 0) {
      return 100;
    }
    if (data.length < 4) {
      return 250;
    }
    if (data.length < 8) {
      return 400;
    }
    if (data.length < 12) {
      return 650;
    }
    if (data.length < 16) {
      return 1000;
    }
    if (data.length < 20) {
      return 1250;
    }
  };

  return (
    <div className="w-100 h-[60vh] pt-[50px] overflow-y-scroll">
      <ResponsiveContainer
        width="90%"
        className="float-start overflow-y-scroll"
        height={length()}
      >
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, "dataMax + 5"]} />
          <YAxis dataKey="name" type="category" width={240} minTickGap={10} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="jami"
            fill="#6b76ff"
            name="Ijarada yashovchi talabalar soni"
          />
          <Bar
            dataKey="ijarada"
            fill="#ff9999"
            name="Jami xabar olingan talabalar soni"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
