import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type StatisticsChartProps = {
  data: {
    [key: string]: string | number;
  }[];
  labelKey: string; // <-- Dynamically choose source or tag_name
  chartTitle: string; // <-- Dynamic title
};

export default function StatisticsChart({
  data,
  labelKey,
  chartTitle,
}: StatisticsChartProps) {
  if (!data || data.length === 0) {
    return <p>Loading sentiment chart...</p>;
  }

  const categories = data.map((item) => item[labelKey] as string);

const positiveData = data.map((item) =>
  Number(item.positive ?? item.positive_percentage)
);
const negativeData = data.map((item) =>
  Number(item.negative ?? item.negative_percentage)
);
const neutralData = data.map((item) =>
  Number(item.neutral ?? item.neutral_percentage)
);


  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "60%",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
    },
    stroke: { width: 1, colors: ["#fff"] },
    xaxis: {
      categories: categories,
      title: { text: "Percentage (%)" },
    },
    yaxis: {
      title: { text: chartTitle },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`,
      },
    },
    fill: { opacity: 1 },
    legend: { position: "top" },
    colors: ["#28a745", "#dc3545", "#ffc107"],
  };

  const series = [
    { name: "Positive", data: positiveData },
    { name: "Negative", data: negativeData },
    { name: "Neutral", data: neutralData },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {chartTitle}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Positive, Negative, and Neutral sentiment percentages
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="bar" height={350} />
        </div>
      </div>
    </div>
  );
}
