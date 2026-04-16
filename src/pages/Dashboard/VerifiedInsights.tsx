import PageMeta from "../../components/common/PageMeta";
import MainCard from "../../components/cards/MainCard";
import StatisticsChart from "../../components/charts/bar/HorizontalBarChart";
import { useEffect, useRef, useState, useCallback } from "react";
import axios from "../../api/axios";
import DatePicker from "../../components/form/date-picker";
import { getCsrfToken } from "../../utils/global";
import Loader from "../../components/common/Loader";
import MinisterTrendChart from "../../components/charts/line/LineChartOne";
import { Summary } from "../../types";

export default function VerifiedInsights() {
  const [newsSentimentData, setNewsSentimentData] = useState([]);
  const [topRepeatedTags, setTopRepeatedTags] = useState([]);
  const [topThreePersons, setTopThreePersons] = useState([]);
  const [topRepeatedQuotes, setTopRepeatedQuotes] = useState([]);
  const [ministerTrendData, setMinisterTrendData] = useState([]);
  const [ismoTrendData, setIsmoTrendData] = useState([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [combinedSummary, setCombinedSummary] = useState<Summary>({});


  const hasInitialized = useRef(false);

  // Fetch all initial data once
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchNewsSentimentData();
      fetchTopRepeatedTagsData();
      getTopThreePersons();
      getTopRepeatedQuotes();
      fetchMinisterTrendData();
      fetchIsmoTrendData();
      fetchCombinedSummary();
    }
  }, []);


  // Fetch data when dates change
  useEffect(() => {
    if (startDate && endDate) {
      setLoading(true);
      Promise.all([fetchNewsSentimentData(), fetchTopRepeatedTagsData(), getTopThreePersons(), getTopRepeatedQuotes(), fetchMinisterTrendData(), fetchIsmoTrendData()]).finally(
        () => setLoading(false)
      );
    }
  }, [startDate, endDate]);

  const getTopThreePersons = async () => {
    try {
      const response = await axios.post(
        "articles/get-top-three-persons/",
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

      console.log("Top Three Persons Response:", response.data);
      setTopThreePersons(response.data);
    } catch (error) {
      console.error("Error fetching top three persons:", error);
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
      console.log("Combined Summary Response:", response.data);

      setSentimentLoading(false);

      setCombinedSummary(response.data);
    } catch (error) {
      setSentimentLoading(false);
      console.error("Error fetching news sentiment data:", error);
    }
  };


  const fetchMinisterTrendData = async () => {
    try {
      const response = await axios.post(
        "articles/get-awais-monthly-sentiment-trend/",
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

      // console.log("Minister Trend Data Response:", response.data);
      setMinisterTrendData(response.data);
    } catch (error) {
      console.error("Error fetching minister trend data:", error);
    }
  };

  const fetchIsmoTrendData = async () => {
    try {
      const response = await axios.post(
        "articles/get-ismo-monthly-sentiment-trend/",
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

      // console.log("Ismo Trend Data Response:", response.data);
      setIsmoTrendData(response.data);
    } catch (error) {
      console.error("Error fetching ismo trend data:", error);
    }
  };

  const getTopRepeatedQuotes = useCallback(async () => {
    try {
      const response = await axios.get("articles/get-top-three-quotes/", {
        headers: { "X-CSRFToken": getCsrfToken() },
      });
      console.log("Top Repeated Quotes Response:", response.data);
      setTopRepeatedQuotes(response.data);
    } catch (error) {
      console.error("Error fetching top repeated quotes:", error);
    }
  }, []);

  const fetchNewsSentimentData = useCallback(async () => {
    try {
      const response = await axios.post(
        "articles/verified-news-sources-sentiment/",
        { start_date: startDate, end_date: endDate },
        { headers: { "X-CSRFToken": getCsrfToken() } }
      );
      console.log("News Sentiment Data Response:", response.data);
      setNewsSentimentData(response.data);
    } catch (error) {
      console.error("Error fetching news sentiment data:", error);
    }
  }, [startDate, endDate]);

  const fetchTopRepeatedTagsData = useCallback(async () => {
    try {
      const response = await axios.post(
        "articles/verified-top-repeated-tags/",
        { start_date: startDate, end_date: endDate },
        { headers: { "X-CSRFToken": getCsrfToken() } }
      );
      setTopRepeatedTags(response.data);
    } catch (error) {
      console.error("Error fetching top repeated tags data:", error);
    }
  }, [startDate, endDate]);

  return (
    <>
      <PageMeta
        title="NICE Agentic AI APP - Dashboard"
        description="NICE Agentic AI Application Dashboard"
      />

      <MainCard cardtitle="Information">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm flex justify-between gap-2 shadow-sm">
          <div>
            <span className="font-semibold text-blue-500 text-xl">Dates of Analysis:</span>
            <span className="text-lg">
              {startDate && endDate ? ` ${startDate} to ${endDate}` : " Past 14 days data"}
            </span>
          </div>
          <div>{loading && <Loader />}</div>
          <div className="flex gap-2">
            <DatePicker
              id="start-date"
              label="Start Date"
              placeholder="YYYY-MM-DD"
              onChange={(_, dateStr) => setStartDate(dateStr)}
            />
            <DatePicker
              id="end-date"
              label="End Date"
              placeholder="YYYY-MM-DD"
              onChange={(_, dateStr) => setEndDate(dateStr)}
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
          chartTitle="Top Issues"
        />
        <StatisticsChart
          data={topThreePersons}
          labelKey="person_quoted"
          chartTitle="Top Voices"
        />

        <StatisticsChart
          data={topRepeatedQuotes}
          labelKey="quote_summary"
          chartTitle="Top Quotes"
        />
        <MinisterTrendChart data={ministerTrendData} />
        <MinisterTrendChart data={ismoTrendData} />


      </MainCard>
    </>
  );
}
