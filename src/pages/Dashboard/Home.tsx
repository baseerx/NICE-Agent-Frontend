import PageMeta from "../../components/common/PageMeta";
import MainCard from "../../components/cards/MainCard";
import StatisticsChart from "../../components/charts/bar/HorizontalBarChart";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import DatePicker from "../../components/form/date-picker";
import { getCsrfToken } from "../../utils/global";
import Loader from "../../components/common/Loader";
import { Summary } from "../../types";

export default function Home() {
  const [newsSentimentData, setNewsSentimentData] = useState([]);
  const [topRepeatedTags, setTopRepeatedTags] = useState([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [combinedSummary, setCombinedSummary] = useState<Summary>({});
  
    useEffect(() => {
    fetchNewsSentimentData();
    fetchTopRepeatedTagsData();
    fetchCombinedSummary();
  }, []);

  const fetchNewsSentimentData = async () => {
    try {
      const response = await axios.post(
        "articles/news-sources-sentiment/",
        {
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            "X-CSRFToken": getCsrfToken(),
          },
        }
      );
      setNewsSentimentData(response.data);
    } catch (error) {
      console.error("Error fetching news sentiment data:", error);
    }
  };

  const fetchTopRepeatedTagsData = async () => {
    try {
      const response = await axios.post(
        "articles/top-repeated-tags/",
        {
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            "X-CSRFToken": getCsrfToken(),
          },
        }
      );

      setLoading(false);

      setTopRepeatedTags(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching news sentiment data:", error);
    }
  };
    const fetchCombinedSummary = async () => {
      setSentimentLoading(true);
    try {
      const response = await axios.post(
        "articles/news-summary/",
        {
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            "X-CSRFToken": getCsrfToken(),
          },
        }
      );
        // console.log("Combined Summary Response:", response.data);

      setSentimentLoading(false);

      setCombinedSummary(response.data);
    } catch (error) {
      setSentimentLoading(false);
      console.error("Error fetching news sentiment data:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      setLoading(true);
      fetchNewsSentimentData();
        fetchTopRepeatedTagsData();
        fetchCombinedSummary();
    }
  }, [startDate, endDate]);

  return (
    <>
      <PageMeta
        title="NICE Agentic AI APP - Dashboard"
        description="NICE Agentic AI Application Dashboard"
      />

      <MainCard cardtitle="Information">
        <div className=" bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm flex justify-between gap-2 shadow-sm">
          <div>
            <span className="font-semibold text-blue-500 text-xl">
              Dates of Analysis:
            </span>
            <span className="text-lg">
              {startDate && endDate && ` ${startDate} to ${endDate}`}
              {!startDate && !endDate && ` Past 14 days data`}
            </span>
          </div>
          <div>{loading && <Loader />}</div>
          <div className="flex gap-2">
            <DatePicker
              id="start-date"
              label="Start Date"
              placeholder="YYYY-MM-DD"
              onChange={(selectedDates, dateStr) => {
                console.log("Selected start date:", selectedDates);
                setStartDate(dateStr);
              }}
            />
            <DatePicker
              id="end-date"
              label="End Date"
              placeholder="YYYY-MM-DD"
              onChange={(selectedDates, dateStr) => {
                console.log("Selected end date:", selectedDates);
                setEndDate(dateStr);
              }}
            />
          </div>
        </div>
        <div className=" bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm flex justify-between gap-2 shadow-sm">
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-blue-500 text-lg md:text-xl">
                        Overall Summary:
                    </span>
                    {sentimentLoading && <Loader />}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    {!sentimentLoading ? combinedSummary?.combined_summary : "N/A"}
                </p>
            </div>

            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-orange-500 text-lg">
                        Overall Sentiment:
                    </span>
                    {sentimentLoading && <Loader />}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    {!sentimentLoading ? combinedSummary?.overall_sentiment : "N/A"}
                </p>
            </div>
        </div>
        </div>
        <StatisticsChart
          data={newsSentimentData}
          labelKey="source"
          chartTitle="Sentiment Distribution by News Source"
        />

        <StatisticsChart
          data={topRepeatedTags}
          labelKey="tag_name"
          chartTitle="Top Issues/Organizations"
        />
      </MainCard>
    </>
  );
}
