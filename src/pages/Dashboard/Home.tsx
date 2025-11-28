import PageMeta from "../../components/common/PageMeta";
import MainCard from "../../components/cards/MainCard";
import StatisticsChart from "../../components/charts/bar/HorizontalBarChart";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import DatePicker from "../../components/form/date-picker";
import { getCsrfToken } from "../../utils/global";
import Loader from "../../components/common/Loader";

export default function Home() {
  const [newsSentimentData, setNewsSentimentData] = useState([]);
  const [topRepeatedTags, setTopRepeatedTags] = useState([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchNewsSentimentData();
    fetchTopRepeatedTagsData();
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

  useEffect(() => {
    if (startDate && endDate) {
      setLoading(true);
      fetchNewsSentimentData();
      fetchTopRepeatedTagsData();
   
    }
  }, [startDate, endDate]);

  return (
    <>
      <PageMeta
        title="NICE Agentic AI APP - Dashboard"
        description="NICE Agentic AI Application Dashboard"
      />

      <MainCard cardtitle="Analytics">
        <div className="flex gap-6 justify-end items-center">
          {loading && <Loader />}
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
        <StatisticsChart
          data={newsSentimentData}
          labelKey="source"
          chartTitle="Sentiment Distribution by News Source"
        />

        <StatisticsChart
          data={topRepeatedTags}
          labelKey="tag_name"
          chartTitle="Top Repeated Speakers"
        />
      </MainCard>
    </>
  );
}
