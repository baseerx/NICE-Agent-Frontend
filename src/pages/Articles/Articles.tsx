import { useEffect, useState } from "react";
import MainCard from "../../components/cards/MainCard";
import axios from "../../api/axios";
import { Article } from "../../types/index";
import NewsCard from "../../components/cards/NewsCard";
import { getCsrfToken } from "../../utils/global";
const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 3;

  useEffect(() => {
    fetchArticles();
  }, []);
  const fetchArticles = async () => {
    try {
      const response = await axios.get("/articles/get/");
      setArticles(response.data);
      setCurrentPage(0);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const handleSentimentChange = async (
    articleId: number,
    newSentiment: string
  ) => {
    try {
      const response = await axios.put(
        `/articles/${articleId}/article_sentiment/`,
        {
          sentiment: newSentiment,
        },
        {
          headers: {
            "X-CSRFToken": getCsrfToken(),
          },
        }
      );
      setArticles((prev) =>
        prev.map((a) =>
          a.article_id === articleId ? { ...a, sentiment: newSentiment } : a
        )
      );
      console.log("Sentiment updated:", response.data);
    } catch (err) {
      console.error("Failed to update sentiment:", err);
    }
  };

  const handleVerify = async (articleId: number) => {
    try {
      await axios.put(
        `/articles/${articleId}/verify/`,
        {
          verification_status: "Verified",
        },
        {
          headers: {
            "X-CSRFToken": getCsrfToken(),
          },
        }
      );
      fetchArticles();
    } catch (err) {
      console.error("Failed to verify article:", err);
    }
  };

  const handleAddTag = async (articleId: number, newTag: string) => {
    try {
      await axios.put(
        `/articles/${articleId}/add_tag/`,
        { tag_name: newTag },
        {
          headers: {
            "X-CSRFToken": getCsrfToken(),
          },
        }
      );
      setArticles((prev) =>
        prev.map((a) =>
          a.article_id === articleId
            ? {
                ...a,
                tags: [
                  ...(a.tags || []),
                  { tag_id: Date.now(), tag_name: newTag },
                ],
              }
            : a
        )
      );
    } catch (err) {
      console.error("Failed to add tag:", err);
    }
  };

  const handleRemoveTag = async (articleId: number, tagName: string) => {
    try {
      await axios.delete(`/articles/${articleId}/remove_tag/`, {
        data: { tag_name: tagName },
        headers: {
          "X-CSRFToken": getCsrfToken(),
        },
      });
      setArticles((prev) =>
        prev.map((a) =>
          a.article_id === articleId
            ? {
                ...a,
                tags: a.tags?.filter((t) => t.tag_name !== tagName) || [],
              }
            : a
        )
      );
    } catch (err) {
      console.error("Failed to remove tag:", err);
    }
  };

  const handleDelete = async (articleId: number) => {
    try {
      await axios.delete(`/articles/${articleId}/delete/`, {
        headers: {
          "X-CSRFToken": getCsrfToken(),
        },
      });

      setArticles((prev) => prev.filter((a) => a.article_id !== articleId));
    } catch (err) {
      console.error("Failed to delete article:", err);
    }
  };

  const pageCount = Math.max(1, Math.ceil(articles.length / pageSize));
  const startIndex = currentPage * pageSize;
  const pagedArticles = articles.slice(startIndex, startIndex + pageSize);

  const goPrev = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(pageCount - 1, p + 1));
  const goTo = (i: number) =>
    setCurrentPage(() => Math.max(0, Math.min(pageCount - 1, i)));

  return (
    <MainCard cardtitle="Articles">
      {articles.length === 0 ? (
        <div>Loading articles...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {pagedArticles.map((a) => (
            <NewsCard
              key={a.article_id}
              article={a}
              onSentimentChange={handleSentimentChange}
              onVerify={handleVerify}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              onDelete={handleDelete}
            />
          ))}

          {/* Pagination controls */}
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

export default Articles;
