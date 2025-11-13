import MainCard from "../../components/cards/MainCard";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Article } from "../../types/index";
import VerifiedNewsCard from "../../components/cards/VerifiedNewsCard";
import { getCsrfToken } from "../../utils/global";

const VerifiedArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 3; // number of articles per page

  useEffect(() => {
    fetchVerifiedArticles();
  }, []);
    const changeVerificationStatus = async (articleId: number) => {
          try {
            await axios.put(
              `/articles/${articleId}/unverify/`,
              {
                verification_status: "Pending",
              },
              {
                headers: {
                  "X-CSRFToken": getCsrfToken(),
                },
              }
            );
            
          } catch (err) {
            console.error("Failed to verify article:", err);
          }
    setArticles((prev) => prev.filter((a) => a.article_id !== articleId));
  };
  const fetchVerifiedArticles = async () => {
    try {
      const response = await axios.get("/articles/verified/", {
        headers: {
          "X-CSRFToken": getCsrfToken(),
        },
      });

      if (Array.isArray(response.data) && response.data.length > 0) {
        setArticles(response.data);
        setCurrentPage(0);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching verified articles:", error);
    }
  };

  // Pagination calculations
  const pageCount = Math.max(1, Math.ceil(articles.length / pageSize));
  const startIndex = currentPage * pageSize;
  const pagedArticles = articles.slice(startIndex, startIndex + pageSize);

  const goPrev = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(pageCount - 1, p + 1));
  const goTo = (i: number) =>
    setCurrentPage(() => Math.max(0, Math.min(pageCount - 1, i)));

  return (
    <MainCard cardtitle="Verified Articles">
      {articles.length === 0 ? (
        <p>No verified articles available.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Display paginated verified articles */}
          {pagedArticles.map((article) => (
            <VerifiedNewsCard
              changeVerificationStatus={changeVerificationStatus}
              key={article.article_id}
              article={article}
            />
          ))}

          {/* Pagination Controls */}
          <div className="flex gap-2 items-center justify-center mt-4 flex-wrap">
            <button
              onClick={goPrev}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentPage === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border shadow hover:bg-gray-50"
              }`}
            >
              Prev
            </button>

            {Array.from({ length: pageCount }).map((_, i) => {
              const active = i === currentPage;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`min-w-[40px] px-3 py-2 rounded-lg font-semibold ${
                    active
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white text-gray-700 border hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}

            <button
              onClick={goNext}
              disabled={currentPage >= pageCount - 1}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentPage >= pageCount - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border shadow hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </MainCard>
  );
};

export default VerifiedArticles;
