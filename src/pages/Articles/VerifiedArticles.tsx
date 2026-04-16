import MainCard from "../../components/cards/MainCard";
import { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";
import { Article } from "../../types";
import VerifiedNewsCard from "../../components/cards/VerifiedNewsCard";
import { getCsrfToken } from "../../utils/global";

const VerifiedArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const pageSize = 7;
  const searchTimeoutRef = useRef<number | null>(null);
  const focus = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchArticles(1, "");
    focus.current?.focus();
  }, []);

  const fetchArticles = async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/articles/verified/?page=${page}&page_size=${pageSize}&q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            "X-CSRFToken": getCsrfToken(),
          },
        }
      );

      setArticles(response.data.results);
      setTotal(response.data.total);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: any) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      fetchArticles(1, value);
    }, 500);
  };

  const totalPages = Math.ceil(total / pageSize);

  const goNext = () => {
    if (currentPage < totalPages) {
      fetchArticles(currentPage + 1, search);
    }
  };

  const goPrev = () => {
    if (currentPage > 1) {
      fetchArticles(currentPage - 1, search);
    }
  };

  const goTo = (page: number) => {
    fetchArticles(page, search);
  };

  const changeVerificationStatus = async (articleId: number) => {
    try {
      await axios.put(
        `/articles/${articleId}/unverify/`,
        { verification_status: "Pending" },
        { headers: { "X-CSRFToken": getCsrfToken() } }
      );

      setArticles((prev) => prev.filter((a) => a.article_id !== articleId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MainCard cardtitle="Verified Articles">
      <div className="flex justify-center items-center gap-4">
        <input
          ref={focus}
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search..."
          className="py-4 w-1/2 bg-gray-100 px-4 rounded-xl"
        />

        {loading && <span>Loading...</span>}

        <div className="w-16 h-16 font-bold text-xl flex items-center justify-center bg-blue-600 text-white rounded-full">
          {total}
        </div>
      </div>

      {articles.length === 0 ? (
        <p>Verified articles loading...</p>
      ) : (
        <>
          <div className="flex flex-col gap-4 mt-4">
            {articles.map((article) => (
              <VerifiedNewsCard
                key={article.article_id}
                article={article}
                changeVerificationStatus={changeVerificationStatus}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex gap-2 justify-center mt-6 flex-wrap">
            <button onClick={goPrev} disabled={currentPage === 1}>
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
              key={i}
              onClick={() => goTo(i + 1)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 shadow-md 
                ${currentPage === i + 1 
                ? "bg-blue-600 text-white font-bold shadow-lg transform scale-110" 
                : "bg-white text-gray-700 hover:bg-blue-100 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
              {i + 1}
              </button>
            ))}

            <button onClick={goNext} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </MainCard>
  );
};

export default VerifiedArticles;
