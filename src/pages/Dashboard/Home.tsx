import PageMeta from "../../components/common/PageMeta";
import MainCard from "../../components/cards/MainCard";
import StatisticsChart from "../../components/charts/bar/HorizontalBarChart";
import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function Home() {
  const [newsSentimentData, setNewsSentimentData] = useState([]);
//  const [tagsSentimentData, setTagsSentimentData] = useState([]);
  useEffect(() => {
      fetchNewsSentimentData();
    //   fetchTagsSentimentData();
  }, []);

   
//     const fetchTagsSentimentData = async () => {
//     try {
//       const response = await axios.get("articles/top-tags-sentiment/");
//     //   setTagsSentimentData(response.data);
//     } catch (error) {
//       console.error("Error fetching tags sentiment data:", error);
//     }
//   }
  const fetchNewsSentimentData = async () => {
    try {
      const response = await axios.get("articles/news-sources-sentiment/");
      setNewsSentimentData(response.data);
    } catch (error) {
      console.error("Error fetching news sentiment data:", error);
    }
  };

  return (
    <>
      <PageMeta
        title="NICE Agentic AI APP - Dashboard"
        description="NICE Agentic AI Application Dashboard"
      />
      <MainCard cardtitle="Analytics">
        <StatisticsChart
          data={newsSentimentData}
          labelKey="source"
          chartTitle="Sentiment Distribution by News Source"
        />

        {/* <div className="mt-10">
          <StatisticsChart
            data={tagsSentimentData}
            labelKey="tag_name"
            chartTitle="Sentiment Distribution by Top 5 Tags"
          />
        </div> */}
      </MainCard>
    </>
  );
}
