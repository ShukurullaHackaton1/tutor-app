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
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Add column headers
    worksheet.addRow(["Category", "Value", "Percentage"]);
    worksheet.getCell('A2').font = { bold: true };
    worksheet.getCell('B2').font = { bold: true };
    worksheet.getCell('C2').font = { bold: true };

    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Add data rows with percentage calculation
    data.forEach((item, index) => {
      const percentage = ((item.value / total) * 100).toFixed(2) + '%';
      worksheet.addRow([item.label, item.value, percentage]);
    });

    // Create a chart image
    const chartElement = document.getElementById("chart-container");
    if (chartElement) {
      const chartImage = await toPng(chartElement);

      // Add the chart image to the Excel sheet
      const imageId = workbook.addImage({
        base64: chartImage,
        extension: 'png',
      });

      worksheet.addImage(imageId, {
        tl: { col: 1, row: 4 + data.length },
        ext: { width: 500, height: 300 },
      });
    }

    // Generate the Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${title.replace(/\s+/g, '_')}.xlsx`);
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
      <button
        onClick={exportToExcel}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Export to Excel
      </button>
    </div>
  );
}