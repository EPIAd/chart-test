const GITHUB_EXCEL_URL = "https://epiad.github.io/chart-test/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4%EB%B9%84%EC%A4%91_EPIAD.xlsx";

document.getElementById("loadData").addEventListener("click", async () => {
  try {
    const data = await fetchExcelData(GITHUB_EXCEL_URL);
    console.log("Excel Data:", data); // 데이터 확인
    renderTable(data);
  } catch (error) {
    console.error("Failed to load Excel data:", error.message); // 에러 메시지 확인
    alert("Failed to load data. Please check the file URL or try again.");
  }
});

async function fetchExcelData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { header: 1 });
  } catch (err) {
    console.error("Error during fetch:", err.message); // Fetch 관련 에러 확인
    throw err;
  }
}

function renderTable(data) {
  const tableContainer = document.getElementById("tableContainer");
  tableContainer.innerHTML = "";

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headerRow = document.createElement("tr");
  data[0].forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  data.slice(1).forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell || "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  tableContainer.appendChild(table);
}
