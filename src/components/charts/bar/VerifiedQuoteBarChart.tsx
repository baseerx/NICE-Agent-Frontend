import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Props {
  data: any[];
}

export default function VerifiedQuoteBarChart({ data }: Props) {
    
  if (!data || data.length === 0) return null;

  const count = data.reduce((sum, item) => sum + item.total_quotes, 0);

  const categories = data.map((item) => item.year_month);

  const series = [
    {
      name: "Positive",
      data: data.map((item) => item.positive_count),
    },
    {
      name: "Neutral",
      data: data.map((item) => item.neutral_count),
    },
    {
      name: "Negative",
      data: data.map((item) => item.negative_count),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 5,
      },
    },
    xaxis: {
      categories,
    },
    colors: ["#22C55E", "#FACC15", "#EF4444"],
    legend: {
      position: "top",
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Total Quotes Sentiment Over Time (Positive, Neutral, Negative): <span className="text-blue-500 font-bold text-xl">{count}</span>
      </h3>

      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
}
