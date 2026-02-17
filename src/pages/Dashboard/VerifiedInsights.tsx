import PageMeta from "../../components/common/PageMeta";
import MainCard from "../../components/cards/MainCard";
import StatisticsChart from "../../components/charts/bar/HorizontalBarChart";
import { useEffect, useRef, useState, useCallback } from "react";
import axios from "../../api/axios";
import DatePicker from "../../components/form/date-picker";
import { getCsrfToken } from "../../utils/global";
import Loader from "../../components/common/Loader";
import VerifiedQuoteBarChart from "../../components/charts/bar/VerifiedQuoteBarChart";

export default function VerifiedInsights() {
  const [newsSentimentData, setNewsSentimentData] = useState([]);
  const [topRepeatedTags, setTopRepeatedTags] = useState([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<{ value: number; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuotes, setFilteredQuotes] = useState<{ value: number; text: string }[]>([]);
  const [verifiedQuoteSentiment, setVerifiedQuoteSentiment] = useState<any[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<number | 0>(0);
  const hasInitialized = useRef(false);

  // Fetch all initial data once
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchNewsSentimentData();
      fetchTopRepeatedTagsData();
      getQuotes();
    }
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

useEffect(() => {
  if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

  if (searchTerm.trim() === "") {
    setFilteredQuotes([]);
    setShowDropdown(false);
    return;
  }

  searchTimeoutRef.current = setTimeout(() => {
    const filtered = quotes.filter((quote) =>
      quote.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ✅ Remove duplicates based on text
    const uniqueQuotes = Array.from(
      new Map(filtered.map((item) => [item.text.toLowerCase(), item])).values()
    );

    setFilteredQuotes(uniqueQuotes);
    setShowDropdown(uniqueQuotes.length > 0);
  }, 300);

  return () => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
  };
}, [searchTerm, quotes]);


  // Fetch data when dates change
  useEffect(() => {
    if (startDate && endDate) {
      setLoading(true);
      Promise.all([fetchNewsSentimentData(), fetchTopRepeatedTagsData()]).finally(
        () => setLoading(false)
      );
    }
  }, [startDate, endDate]);

  const getQuotes = useCallback(async () => {
    try {
      const response = await axios.get("articles/get-quotes/", {
        headers: { "X-CSRFToken": getCsrfToken() },
      });
      setQuotes(
        response.data.map((quote: any) => ({
          value: quote.quote_id,
          text: quote.person_quoted,
        }))
      );
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  }, []);

  const getVerifiedQuotes = useCallback(async (text: string) => {
    setSearchTerm(text);
    setShowDropdown(false);
    setLoading(true);

    try {
      const response = await axios.post(
        "articles/verified-quotes/",
        { quote: text },
        { headers: { "X-CSRFToken": getCsrfToken() } }
      );
      setVerifiedQuoteSentiment(response.data);
    } catch (error) {
      console.error("Error fetching verified quotes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNewsSentimentData = useCallback(async () => {
    try {
      const response = await axios.post(
        "articles/verified-news-sources-sentiment/",
        { start_date: startDate, end_date: endDate },
        { headers: { "X-CSRFToken": getCsrfToken() } }
      );
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

        <StatisticsChart
          data={newsSentimentData}
          labelKey="source"
          chartTitle="Sentiment Distribution by News Source"
        />

        <StatisticsChart
          data={topRepeatedTags}
          labelKey="tag_name"
          chartTitle="Top Issues/Organizations in Verified News"
        />

        <div
          className="mt-6 relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-sm shadow-sm"
          ref={dropdownRef}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search quote..."
            className="w-full bg-transparent outline-none"
          />

          {showDropdown && filteredQuotes.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
              {filteredQuotes.map((quote) => (
                <div
                  key={`quote-${quote.value}`}
                  onClick={() => getVerifiedQuotes(quote.text)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {quote.text}
                </div>
              ))}
            </div>
          )}

          <VerifiedQuoteBarChart data={verifiedQuoteSentiment} />
        </div>
      </MainCard>
    </>
  );
}
