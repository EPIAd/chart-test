document.getElementById("dataForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // 입력 값 가져오기
  const dataInput = document.getElementById("dataInput").value;
  const dataValues = dataInput.split(",").map(Number);

  // 유효성 검사
  if (dataValues.some(isNaN)) {
    alert("Please enter valid numbers separated by commas.");
    return;
  }

  // Chart.js를 사용하여 그래프 생성
  const ctx = document.getElementById("lineChart").getContext("2d");

  if (window.myChart) {
    window.myChart.destroy(); // 기존 그래프 삭제
  }

  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dataValues.map((_, i) => `Point ${i + 1}`),
      datasets: [
        {
          label: "Dynamic Data",
          data: dataValues,
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
          text: "Generated Line Graph",
        },
      },
    },
  });
});
