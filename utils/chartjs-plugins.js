export const levelsColoring = () => {
  return {
    beforeDraw: function (chart, args, options) {
      var ctx = chart.ctx;
      var opacity = "dd";
      var rules = [
        {
          backgroundColor: "#9f0b75",
          y: 150,
        },
        {
          backgroundColor: "#2e23aa",
          y: 109,
        },
        {
          backgroundColor: "#08969b",
          y: 83,
        },
        {
          backgroundColor: "#948e11",
          y: 61,
        },
        {
          backgroundColor: "#1b950e",
          y: 49,
        },
        {
          backgroundColor: "#555555",
          y: 0,
        },
      ];

      var yaxis = chart.scales.y;
      var xaxis = chart.scales.x;

      let max = yaxis.max - yaxis.min;
      let prev = max;
      var partPercentage = chart.chartArea.height / max;
      rules = rules.map((e) => {
        e.y = Math.max(e.y - yaxis.min, 0);
        return e;
      });

      for (let i = 0; i < rules.length; i++) {
        const y = Math.max(max - prev, 0);
        const h = Math.min(prev - rules[i].y, max - y);

        prev = rules[i].y;
        ctx.fillStyle = rules[i].backgroundColor + opacity;

        ctx.fillRect(
          xaxis.left,
          Math.max(y * partPercentage, 0) + chart.chartArea.top,
          xaxis.width,
          Math.max(h * partPercentage, 0)
        );
      }
    },
  };
};
