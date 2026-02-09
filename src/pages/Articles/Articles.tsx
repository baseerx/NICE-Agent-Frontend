import { useEffect, useState,useRef } from "react";
import MainCard from "../../components/cards/MainCard";
import axios from "../../api/axios";
import { Article } from "../../types/index";
import NewsCard from "../../components/cards/NewsCard";
import { getCsrfToken } from "../../utils/global";
import MultiSelect from "../../components/form/MultiSelect";
import { Option } from "../../components/form/MultiSelect";
import Loader from "../../components/common/Loader";
import Select from "../../components/form/Select";

type SingleOption = {
  label: string;
  value: string;
};
const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  const [newsSources, setNewsSources] = useState<Option[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const source: SingleOption[] = [
    { label: "Local", value: "local" },
    { label: "International", value: "international" },
  ];

  const searchTimeoutRef = useRef<number | null>(null);
  const focus=useRef<HTMLInputElement | null>(null);

  const [loader, setLoader] = useState(false);
  const pageSize = 8;

  useEffect(() => {
    fetchArticles();
    focus.current?.focus();
  }, []);

useEffect(() => {
  if (selectedSources.length === 0) {
    setArticles(allArticles);
  } 
 
  else {
    setArticles(
      allArticles.filter((a) =>
        selectedSources.includes(a.source || "")
      )
    );
  }
  setCurrentPage(0);
}, [selectedSources, allArticles]);


  const fetchArticles = async () => {
    setLoader(true);
    try {
      const response = await axios.get("/articles/get/");
      setArticles(response.data);
      setAllArticles(response.data);
      setCurrentPage(0);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setLoader(false);
    }
  };



  const getNewsSources = async (value: string) => {
    try {
      const response = await axios.post("/articles/sources/", { source: value }, {
        headers: {
          "X-CSRFToken": getCsrfToken(),
        },
      });
      setNewsSources(response.data);
    } catch (error) {
      console.error("Error fetching news sources:", error);
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
      setArticles((prev: any) =>
        prev.map((a: any) =>
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


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

  if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current);
  }

  if (!value.trim()) {
    setArticles(allArticles);
    setLoading(false);
    return;
  }

  setLoading(true);

  searchTimeoutRef.current = setTimeout(async () => {
    try {
      const response = await axios.get(
        `/articles/search/?q=${encodeURIComponent(value.trim())}`,
        {
          headers: { "X-CSRFToken": getCsrfToken() },
        }
      );
      setArticles(response.data || []);
      setCurrentPage(0);
    } catch (err) {
      console.error("Error searching articles:", err);
    } finally {
      setLoading(false);
    }
  }, 3000);
};


  return (
    <MainCard cardtitle="Articles">
      <div>

        <div className="flex justify-center items-center gap-4 relative">

          <input type="text" onChange={(e) => handleSearch(e)} ref={focus} placeholder="Search.." name="verified_articles_search" id="verified_articles_search" className="py-4 w-1/2 bg-gray-100 px-4 rounded-xl" />
          {loading && "Loading..."}
          {articles.length > 0 && (
            <div className="relative right-0 flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg font-bold text-xl">
              {articles.length}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center gap-3 w-full">
        <div className="w-1/2">
          <label htmlFor="localInternational">Local/International</label>
          <Select
            options={source}
            onChange={(newSelected) => getNewsSources(newSelected)}
          />
        </div>
        <div className="w-1/2">
          <MultiSelect
            options={newsSources}
            label="Media Sources"
            value={selectedSources}
            onChange={(newSelected) => setSelectedSources(newSelected)}
          />
        </div>
      </div>
      {articles.length === 0 ? (
        <div className="flex items-center gap-2">
          {loader ? (
            <>
              <Loader />
              <span>Loading articles...</span>
            </>
          ) : (
            <div>No articles found.</div>
          )}
        </div>
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
              fetchArticles={fetchArticles}
            />
          ))}

          {/* Pagination controls */}
          <div className="flex gap-2 items-center justify-center mt-4 flex-wrap">
            <button
              onClick={goPrev}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded-lg font-semibold ${currentPage === 0
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
                  className={`min-w-[40px] px-3 py-2 rounded-lg font-semibold ${active
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
              className={`px-4 py-2 rounded-lg font-semibold ${currentPage >= pageCount - 1
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
