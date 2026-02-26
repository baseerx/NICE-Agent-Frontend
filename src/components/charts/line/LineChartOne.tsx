import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface TrendData {
  person_quoted: string;
  month_year: string;
  positive: number;
  negative: number;
}

interface Props {
  data: TrendData[];
}

export default function MinisterTrendChart({ data }: Props) {
  const categories = data.map((item) => item.month_year);
  const positiveData = data.map((item) => item.positive);
  const negativeData = data.map((item) => item.negative);

  const personName =
    data.length > 0
      ? data[0].person_quoted
      : "Federal Minister Sardar Awais Ahmad Khan Leghari";

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    title: {
      text: `${personName} - Monthly Sentiment Trend`,
      align: "left",
    },
    legend: {
      show: true,
      position: "top",
    },
    colors: ["#16a34a", "#dc2626"], // Green = Positive, Red = Negative
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      yaxis: {
        lines: { show: true },
      },
    },
    xaxis: {
      categories: categories,
      title: { text: "Month-Year" },
    },
    yaxis: {
      title: { text: "Number of Quotes" },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const series = [
    {
      name: "Positive Sentiment",
      data: positiveData,
    },
    {
      name: "Negative Sentiment",
      data: negativeData,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mt-6">
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
}
