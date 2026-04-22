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
            stackType: "100%",
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: "75%",
                dataLabels: {
                    position: "center",
                },
            },
        },
        colors: ["#22c55e", "#ef4444", "#64748b"],
        dataLabels: {
            enabled: true,
            enabledOnSeries: [0], 
            formatter: (_val, opts) => quoteSummaries[opts.dataPointIndex],
            style: {
                fontSize: "13px", // Slightly smaller for better fit
                fontWeight: 600,
                colors: ["#000000"],
            },
            textAnchor: "middle",
            background: {
                enabled: true,
                foreColor: "#fff",
                padding: 10,
                borderRadius: 4,
                opacity: 0.5,
            },
        },
        xaxis: {
            categories,
            max: 100,
            labels: { formatter: (val) => `${val}%` },
        },
        yaxis: {
            labels: { style: { fontWeight: 600 } },
        },
        tooltip: {
            shared: true,
            intersect: false,
            followCursor: true, // Follows mouse so it doesn't get stuck at the top
            fixed: {
                enabled: false, // Set to false to allow the tooltip to move with the mouse
            },
            // Compact custom tooltip
            custom: function({ dataPointIndex }) {
                const item = data[dataPointIndex];
                return (
                    '<div style="padding: 10px; font-family: inherit; font-size: 12px; background: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">' +
                        '<div style="font-weight: bold; margin-bottom: 5px; color: #1f2937;">Quote ' + (dataPointIndex + 1) + '</div>' +
                        '<div style="display: flex; flex-direction: column; gap: 2px;">' +
                            '<div><span style="color: #22c55e;">●</span> Positive: <b>' + item.positive_percentage + '%</b></div>' +
                            '<div><span style="color: #ef4444;">●</span> Negative: <b>' + item.negative_percentage + '%</b></div>' +
                            '<div><span style="color: #64748b;">●</span> Neutral: <b>' + item.neutral_percentage + '%</b></div>' +
                        '</div>' +
                        '<div style="margin-top: 8px; padding-top: 5px; border-top: 1px solid #eee; font-weight: bold; color: #2563eb;">' +
                            'Total Quotes: ' + item.total_quotes + 
                        '</div>' +
                    '</div>'
                );
            }
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
            {/* Removed overflow-hidden from the container to ensure tooltip isn't clipped */}
            <div className="w-full">
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