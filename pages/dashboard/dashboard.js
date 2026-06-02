(function () {
  const chartData = [
    { label: "Em andamento", value: 14, color: "#22d3ee" },
    { label: "Aguardando", value: 6, color: "#a78bfa" },
    { label: "Concluídos", value: 4, color: "#34d399" },
  ];

  const canvas = document.getElementById("processChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const legendEl = document.getElementById("chartLegend");
  const totalEl = document.getElementById("chartTotal");
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (totalEl) {
    totalEl.textContent = String(total);
  }

  function drawChart() {
    const wrap = canvas.parentElement;
    const size = Math.min(wrap.offsetWidth, wrap.offsetHeight);
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const center = size / 2;
    const outerRadius = size / 2 - 10;
    const innerRadius = outerRadius * 0.64;
    let startAngle = -Math.PI / 2;

    chartData.forEach((segment) => {
      const slice = (segment.value / total) * Math.PI * 2;
      const endAngle = startAngle + slice;

      ctx.beginPath();
      ctx.arc(center, center, outerRadius, startAngle, endAngle);
      ctx.arc(center, center, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      const gradient = ctx.createRadialGradient(
        center,
        center,
        innerRadius,
        center,
        center,
        outerRadius,
      );
      gradient.addColorStop(0, segment.color);
      gradient.addColorStop(1, shadeColor(segment.color, -25));
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = "rgba(7, 11, 20, 0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle = endAngle;
    });

    ctx.beginPath();
    ctx.arc(center, center, innerRadius - 1, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(7, 11, 20, 0.95)";
    ctx.fill();
  }

  function shadeColor(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  if (legendEl) {
    legendEl.innerHTML = chartData
      .map(
        (item) =>
          `<li>
            <span class="chart-legend__label">
              <span class="chart-legend__dot" style="background:${item.color};box-shadow:0 0 8px ${item.color}"></span>
              ${item.label}
            </span>
            <span class="chart-legend__value">${item.value}</span>
          </li>`,
      )
      .join("");
  }

  drawChart();
  window.addEventListener("resize", drawChart);
})();
