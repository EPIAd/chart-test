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
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // 2D 배열로 변환
  
  return jsonData; // 테이블 데이터 반환
}

// 데이터를 기반으로 테이블 렌더링
function renderTable(data) {
  const tableContainer = document.getElementById("tableContainer");
  tableContainer.innerHTML = ""; // 기존 테이블 초기화

  // 테이블 생성
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // 헤더 행 생성
  const headerRow = document.createElement("tr");
  data[0].forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // 데이터 행 생성
  data.slice(1).forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell || ""; // 빈 값 처리
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  tableContainer.appendChild(
