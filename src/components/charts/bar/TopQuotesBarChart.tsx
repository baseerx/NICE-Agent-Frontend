import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type StatisticsChartProps = {
    data: { [key: string]: any }[];
    labelKey: string;
    chartTitle: string;
};

export default function TopQuotesBarChart({
    data,
    labelKey,
    chartTitle,
}: StatisticsChartProps) {
    if (!data || data.length === 0) {
        return <p className="p-5 text-center text-gray-500">Loading chart...</p>;
    }

    const quoteSummaries = data.map((item) =>
        String(item.quote_summary ?? item[labelKey] ?? "")
    );
    const categories = data.map((_, i) => `Quote ${i + 1}`);

    const positiveData = data.map((item) => Number(item.positive_percentage ?? 0));
    const negativeData = data.map((item) => Number(item.negative_percentage ?? 0));
    const neutralData = data.map((item) => Number(item.neutral_percentage ?? 0));

    const chartHeight = Math.max(data.length * 85, 400);

    const options: ApexOptions = {
        chart: {
            type: "bar",
            stacked: true,
            stackType: "100%", // Ensures the total bar always fills the width
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: "75%",
                dataLabels: {
                    // This tells Apex to position the label in the center of the segment
                    position: "center", 
                },
            },
        },
        colors: ["#22c55e", "#ef4444", "#64748b"],
        dataLabels: {
            enabled: true,
            // Attach label to the first series (Positive). 
            // In a 100% stacked chart, this is the most reliable anchor.
            enabledOnSeries: [0], 
            formatter: (_val, opts) => {
                const i = opts.dataPointIndex;
                return quoteSummaries[i];
            },
            style: {
                fontSize: "12px",
                fontWeight: 600,
                colors: ["#000000"],
            },
            // Centers the text relative to its anchor point
            textAnchor: "middle", 
            offsetX: 0,
            background: {
                enabled: true,
                foreColor: "#000",
                padding: 6,
                borderRadius: 4,
                opacity: 0.2,
                borderWidth: 0,
            },
        },
        xaxis: {
            categories,
            max: 100,
            labels: {
                formatter: (val) => `${val}%`,
            },
        },
        yaxis: {
            labels: {
                show: true,
                style: { fontWeight: 600 },
            },
        },
        grid: {
            xaxis: { lines: { show: true } },
            padding: {
                left: 10,
                right: 20, // Added slight right padding to prevent label clipping
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (val) => `${val}%`,
            },
        },
        legend: {
            position: "top",
            horizontalAlign: "center",
        },
    };

    const series = [
        { name: "Positive", data: positiveData },
        { name: "Negative", data: negativeData },
        { name: "Neutral", data: neutralData },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-6 text-lg font-bold text-gray-800 dark:text-white/90">
                {chartTitle}
            </h3>
            <div className="w-full overflow-hidden">
                <Chart
                    options={options}
                    series={series}
                    type="bar"
                    height={chartHeight}
                />
            </div>
        </div>
    );
}