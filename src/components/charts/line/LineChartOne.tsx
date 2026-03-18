import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface TrendData {
  person_quoted: string;
  week_start: string;
  week_number: number;
  year: number;
  month_name: string;    // <-- added
  month_number: number;  // <-- added
  positive: number;
  negative: number;
  total_quotes: number;
  positive_percentage: number;
  negative_percentage: number;
}


interface Props {
  data: TrendData[];
}

export default function MinisterTrendChart({ data }: Props) {
 
  // Group data by week number and year, summing sentiments
  const groupedByWeek = new Map<string, TrendData>();

  data.forEach((item) => {
    const key = `${item.year}-W${item.week_number}(${item.month_name})`;
    if (groupedByWeek.has(key)) {
      const existing = groupedByWeek.get(key)!;
      existing.positive += item.positive;
      existing.negative += item.negative;
      existing.total_quotes += item.total_quotes;
    } else {
      groupedByWeek.set(key, { ...item });
    }
  });

  const sortedWeeks = Array.from(groupedByWeek.values()).sort(
    (a, b) => a.week_number - b.week_number || a.year - b.year
  );

  const categories = sortedWeeks.map((item) => `W${item.week_number} (${item.month_name}) ${item.year}`);
  const positiveData = sortedWeeks.map((item) => item.positive);
  const negativeData = sortedWeeks.map((item) => item.negative);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    title: {
      text: data[0]?.person_quoted || "Weekly Sentiment Trend",
      align: "left",
    },
    legend: {
      show: true,
      position: "top",
    },
    colors: ["#16a34a", "#dc2626"],
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
      title: { text: "Week" },
    },
    yaxis: {
      title: { text: "Sentiment Count" },
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
