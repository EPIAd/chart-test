const GITHUB_EXCEL_URL = "https://epiad.github.io/chart-test/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4%EB%B9%84%EC%A4%91_EPIAD.xlsx";

// 버튼 클릭 시 Excel 데이터 로드
document.getElementById("loadData").addEventListener("click", async () => {
  try {
    const data = await fetchExcelData(GITHUB_EXCEL_URL);
    renderTable(data);
  } catch (error) {
    console.error("Failed to load Excel data:", error);
    alert("Failed to load data. Please check the file URL or try again.");
  }
});

// GitHub에서 Excel 데이터 가져오기
async function fetchExcelData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // 2D
