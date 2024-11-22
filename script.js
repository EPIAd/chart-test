const GITHUB_EXCEL_URL = "const GITHUB_EXCEL_URL = "https://github.com/EPIAd/chart-test/raw/refs/heads/main/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4%EB%B9%84%EC%A4%91_EPIAD.xlsx";
";

document.getElementById("dateForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // 1. 날짜 입력 가져오기
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (new Date(startDate) > new Date(endDate)) {
    alert("Start date must be earlier than end date.");
    return;
  }

  // 2. GitHub에서 Excel 데이터 가져오기
  const portfolioData = await fetchExcelData(GITHUB_EXCEL_URL);
  const filteredData = filterDataByDate(portfolioData, startDate, endDate);

  // 3. ETF 가격 크롤링 및 수익률 계산
  const returns = await calculateDailyReturns(filteredData);

  // 4. 그래프 그리기
  drawGraph(returns.dates, returns.returns);
});

// GitHub에서 엑셀 데이터 가져오기
async function fetchExcelData(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  // 데이터 구조 변경: 날짜(Date), 티커(Ticker), 비중(Weight)
  const formattedData = [];
  jsonData.forEach(row => {
    const date = row["Date"];
    for (const ticker in row) {
      if (ticker !== "Date" && ticker !== "합계") {
        formattedData.push({ Date: date, Ticker: ticker, Weight: row[ticker] });
      }
    }
  });

  return formattedData;
}

// 날짜 필터링
function filterDataByDate(data, startDate, endDate) {
  return data.filter(row => {
    const date = new Date(row.Date);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });
}

// ETF 가격 크롤링 및 수익률 계산
async function calculateDailyReturns(portfolioData) {
  const tickers = [...new Set(portfolioData.map(row => row.Ticker))];
  const startDate = portfolioData[0].Date;
  const endDate = portfolioData[portfolioData.length - 1].Date;

  const prices = {};
  for (const ticker of tickers) {
    const response = await fetch(`https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${new Date(startDate).getTime() / 1000}&period2=${new Date(endDate).getTime() / 1000}&interval=1d&events=history`);
    const csv = await response.text();
    prices[ticker] = parseYahooData(csv);
  }

  const returns = [];
  const dates = [...new Set(portfolioData.map(row => row.Date))];

  for (let i = 1; i < dates.length; i++) {
    const date = dates[i];
    const prevDate = dates[i - 1];

    let dailyReturn = 0;
    const dayData = portfolioData.filter(row => row.Date === date);
    const prevDayData = portfolioData.filter(row => row.Date === prevDate);

    for (const row of dayData) {
      const ticker = row.Ticker;
      const weight = row.Weight;
      const prevPrice = prices[ticker][prevDate];
      const currPrice = prices[ticker][date];
      if (prevPrice && currPrice) {
        dailyReturn += weight * ((currPrice - prevPrice) / prevPrice);
      }
    }
    returns.push(dailyReturn * 100); // 퍼센트로 변환
  }

  return { dates, returns };
}

// Yahoo 데이터 파싱
function parseYahooData(csv) {
  const lines = csv.split("\n");
  const result = {};
  for (const line of lines.slice(1)) {
    const [date, open, high, low, close] = line.split(",");
    result[date] = parseFloat(close);
  }
  return result;
}

// 그래프 그리기
function drawGraph(dates, returns) {
  const ctx = document.getElementById("lineChart").getContext("2d");

  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Portfolio Daily Returns (%)",
          data: returns,
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Daily Portfolio Returns",
        },
      },
    },
  });
}
