import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DownloadExcel = ({ data, fileName = "data" }) => {
  const handleDownload = () => {
    if (!data || data.length === 0) {
      alert("No data available to download");
      return;
    }

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Convert workbook to binary
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-green-600 hover:bg-green-700 text-white px-2 my-1 rounded shadow w-[160px] h-[35px]"
    >
      Download Excel
    </button>
  );
};

export default DownloadExcel;
