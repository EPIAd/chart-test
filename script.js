document.getElementById("dataForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const dataInput = document.getElementById("dataInput").value;
  const dataValues = dataInput.split(",").map(Number);

  if (dataValues.some(isNaN)) {
    alert("Please enter valid numbers separated by commas.");
    return;
  }

  drawGraph(dataValues);
});

function drawGraph(dataValues) {
  const canvas = document.getElementById("drawingCanvas");
  const ctx = canvas.getContext("2d");

  // Canvas 초기화
  canvas.width = 600;
  canvas.height = 300;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 축 설정
  const padding = 40;
  const graphWidth = canvas.width - 2 * padding;
  const graphHeight = canvas.height - 2 * padding;

  // 데이터 변환
  const maxValue = Math.max(...dataValues);
  const points = dataValues.map((value, index) => ({
    x: padding + (index / (dataValues.length - 1)) * graphWidth,
    y: canvas.height - padding - (value / maxValue) * graphHeight,
  }));

  // 축 그리기
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  // 펜으로 그리기 애니메이션
  ctx.strokeStyle = "#007bff";
  ctx.lineWidth = 2;
  let currentIndex = 0;

  function animate() {
    if (currentIndex < points.length - 1) {
      ctx.beginPath();
      ctx.moveTo(points[currentIndex].x, points[currentIndex].y);
      ctx.lineTo(points[currentIndex + 1].x, points[currentIndex + 1].y);
      ctx.stroke();
      currentIndex++;
      requestAnimationFrame(animate); // 다음 프레임으로 이동
    }
  }

  animate(); // 애니메이션 시작
}
