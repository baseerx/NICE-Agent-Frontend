import React, { useState } from "react";
import {
  X,
  Trash2,
  ChevronDown,
  Check,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SentimentDropdown from "../ui/dropdown/SentimentDropdown";
import { Article } from "../../types";
import axios from "../../api/axios";
import { getCsrfToken } from "../../utils/global";
import InputUpdate from "../form/input/InputUpdate";

interface NewsCardProps {
  article: Article;
  onSentimentChange: (articleId: number, sentiment: string) => void;
  onVerify: (articleId: number) => void;
  onAddTag: (articleId: number, tag: string) => void;
  onRemoveTag: (articleId: number, tag: string) => void;
  onDelete: (articleId: number) => void;
  fetchArticles: () => void;
}

const sentimentOptions = ["Positive", "Neutral", "Negative"];

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onSentimentChange,
  onVerify,
  onAddTag,
  onRemoveTag,
  fetchArticles,
  onDelete,
}) => {
  const [sentiment, setSentiment] = useState(article.sentiment || "Neutral");
  const [mainDropdownOpen, setMainDropdownOpen] = useState(false);
  const [urlloader, setUrlLoader] = useState(false);
  const [tags, setTags] = useState<{ tag: string; sentiment: string }[]>(
    article.tags?.map((t) => ({
      tag: t.tag_name,
      sentiment: t.sentiment || "",
    })) || []
  );

  const [newTag, setNewTag] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loader, setLoader] = useState(false);
  // --- Read More Edit ---
  const [isEditingReadMore, setIsEditingReadMore] = useState(false);
  const [showSourceInput, setShowSourceInput] = useState(false);
  const [editUrl, setEditUrl] = useState(article.url);
  const [sourceval, setSourceval] = useState(article.source || "");
  const [quoteloader, setQuoteLoader] = useState(false);
  //handle  Author Edit (not implemented yet)
  const [authorval, setAuthorval] = useState(article.author || "");
  const [showAuthorInput, setShowAuthorInput] = useState(false);
  const [newQuote, setNewQuote] = useState("");
    const [quoteSentiment, setQuoteSentiment] = useState("");
    const [quoteperson, setQuotePerson] = useState("");

  const handleUpdateUrl = async (e: React.FormEvent) => {
    e.preventDefault();

    setUrlLoader(true);
    // Dummy API example
    try {
      await axios.put(
        "/articles/update_url/",
        {
          article_id: article.article_id,
          url: editUrl,
        },
        { headers: { "X-CSRFToken": getCsrfToken() }, withCredentials: true }
      );
      fetchArticles();
      setUrlLoader(false);
      setIsEditingReadMore(false);
    } catch (err) {
      console.error("Error updating URL:", err);
    }
  };

  const handleUpdateAuthor = async (e: React.FormEvent) => {
    setLoader(true);
    e.preventDefault();
    try {
      await axios.put(
        "/articles/update_author/",
        {
          article_id: article.article_id,
          author: authorval,
        },
        { headers: { "X-CSRFToken": getCsrfToken() }, withCredentials: true }
      );
      fetchArticles();
      setShowAuthorInput(false);
      setLoader(false);
    } catch (err) {
      console.error("Error updating Author:", err);
    }
  };

  // --- Handle overall sentiment ---
  const handleSentimentChange = (option: string) => {
    setSentiment(option);
    setMainDropdownOpen(false);
    onSentimentChange(article.article_id, option);
  };

  // --- Handle verification toggle ---
  const handleVerify = () => {
    setVerified((prev) => !prev);
    onVerify(article.article_id);
  };

  // --- Handle tag add ---
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTag.trim();
    if (tag && !tags.some((t) => t.tag === tag)) {
      const updatedTags = [...tags, { tag, sentiment: "" }];
      setTags(updatedTags);
      onAddTag(article.article_id, tag);
      setNewTag("");
    }
  };

  // --- Handle tag delete ---
  const handleDeleteTag = (tagName: string) => {
    const updatedTags = tags.filter((t) => t.tag !== tagName);
    setTags(updatedTags);
    onRemoveTag(article.article_id, tagName);
  };

  // --- Handle news delete ---
  const handleDeleteNews = () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      setIsDeleted(true);
      onDelete(article.article_id);
    }
  };

  const handleUpdateSource = async (e: React.FormEvent) => {
    setLoader(true);
    e.preventDefault();
    try {
      await axios.put(
        "/articles/update_source/",
        {
          article_id: article.article_id,
          source: sourceval,
        },
        { headers: { "X-CSRFToken": getCsrfToken() }, withCredentials: true }
      );
      fetchArticles();
      setShowSourceInput(false);
      setLoader(false);
    } catch (err) {
      console.error("Error updating Source:", err);
    }
  };
  // --- Handle individual tag sentiment ---
  const handleIndividualTagSentiment = async (
    tagName: string,
    sentimentValue: string
  ) => {
    try {
      await axios.post(
        "/articles/set_tag_sentiment/",
        {
          article_id: article.article_id,
          tag: tagName,
          sentiment: sentimentValue,
        },
        { withCredentials: true, headers: { "X-CSRFToken": getCsrfToken() } }
      );

      setTags((prev) =>
        prev.map((t) =>
          t.tag === tagName ? { ...t, sentiment: sentimentValue } : t
        )
      );
    } catch (e) {
      console.error("Error setting tag sentiment:", e);
    }
  };
  // Handler for adding quotation
  const handleAddQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    const quote = newQuote.trim();
    setQuoteLoader(true);
      if (quote && quoteSentiment && quoteperson) {
        console.log("inside quote add");
      try {
      await axios.post(
          "/articles/add-quote/",
          {
            article_id: article.article_id,
            quote: quote,
              sentiment: quoteSentiment,
                person: quoteperson,
          },
          {
          
            headers: { "X-CSRFToken": getCsrfToken() },
          }
        );

        //   console.log(response.data);
        // // --- Update local state ---
        // article.quote_sentiment = quoteSentiment;
        // article.quote_summary = quote;
      } catch (e) {
        console.error("Error setting tag sentiment:", e);
      }
      setNewQuote("");
          setQuoteSentiment("");
          setQuotePerson("");

      setQuoteLoader(false);
    }
  };

  // --- Sentiment colors ---
  const sentimentColor =
    sentiment === "Positive"
      ? "bg-green-100 text-green-700"
      : sentiment === "Negative"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  const sentimentBorder =
    sentiment === "Positive"
      ? "border-green-300"
      : sentiment === "Negative"
      ? "border-red-300"
      : "border-yellow-300";

  return (
    <AnimatePresence>
      {!isDeleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow hover:shadow-xl transition-all"
        >
          {/* --- Header --- */}
          <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
            <div className="flex items-center gap-3 relative">
              <button
                type="button"
                onClick={() => setMainDropdownOpen(!mainDropdownOpen)}
                className={`px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 border ${sentimentColor} ${sentimentBorder}`}
              >
                {sentiment}
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {mainDropdownOpen && (
                  <SentimentDropdown
                    sentiment={sentiment}
                    sentimentOptions={sentimentOptions}
                    handleSentimentChange={handleSentimentChange}
                  />
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={handleVerify}
              className={`border flex items-center ${
                verified
                  ? "text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                  : "text-gray-600 border-gray-400 hover:bg-gray-600 hover:text-white"
              } font-medium rounded-full text-xs px-3 py-2 transition-all duration-200`}
            >
              {verified ? "Verified" : "Verify Me"}
              {verified && <Check className="w-3 h-3 ml-1" />}
            </button>
          </div>
          {/* --- Headline --- */}
          <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {article.headline}
          </h2>
          {/* --- Summary --- */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {article.article_summary}
          </p>
          {/* --- Meta --- */}
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex flex-col flex-wrap items-start gap-3">
            {/* <div className="flex gap-3">
              <span className="text-blue-400">Quote:</span>
              <span>{article.quote_summary}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400">Quote Sentiment:</span>
              <span>{article.quote_sentiment}</span>
            </div> */}
            <div className="flex items-center gap-1">
              <span>Source:</span>
              <span className="text-orange-300 font-medium">
                {article.source ?? "Unknown Source"}
              </span>
              <span className="flex items-center gap-1">
                {showSourceInput && (
                  <InputUpdate
                    value={sourceval}
                    setValue={setSourceval}
                    onupdate={handleUpdateSource}
                    loader={loader}
                  />
                )}{" "}
                |
                <Edit3
                  className="w-4 h-4 text-green-500 cursor-pointer"
                  onClick={() => setShowSourceInput(!showSourceInput)}
                />
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>By line:</span>
              <span className="text-blue-400 font-medium">
                {article.author == "unknown"
                  ? "Staff Reporter"
                  : article.author}
              </span>
              <span>|</span>
              {showAuthorInput && (
                <InputUpdate
                  value={authorval}
                  setValue={setAuthorval}
                  onupdate={handleUpdateAuthor}
                  loader={loader}
                />
              )}
              <Edit3
                className="w-4 h-4 text-green-500 cursor-pointer"
                onClick={() => setShowAuthorInput(!showAuthorInput)}
              />
            </div>
            <span>Date: {article.publication_date}</span>
          </div>
          {/* --- Tags --- */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {tags.map((tagObj) => (
              <motion.div
                key={tagObj.tag}
                whileHover={{ scale: 1.05 }}
                className="relative bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                <select
                  className="bg-amber-100 rounded-xl text-xs"
                  value={tagObj.sentiment}
                  onChange={(e) =>
                    handleIndividualTagSentiment(tagObj.tag, e.target.value)
                  }
                >
                  <option value="">Sentiment</option>
                  <option value="Positive">Positive</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Negative">Negative</option>
                </select>

                <span>{tagObj.tag}</span>

                <button
                  type="button"
                  onClick={() => handleDeleteTag(tagObj.tag)}
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}

            <form onSubmit={handleAddTag}>
              <input
                type="text"
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="border border-gray-300 rounded-full px-3 py-1 text-sm"
              />
            </form>
          </div>
          <div className="my-4 border border-gray-300 dark:border-gray-700 rounded-2xl p-4 bg-gray-50 dark:bg-gray-800">
          <form
            onSubmit={handleAddQuote}
            className="flex items-center flex-wrap gap-2 mb-4"
          >
            <textarea
              placeholder="Add quote..."
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              className="flex-1 min-w-[120px] border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <textarea
                              placeholder="Person/Organization"
                              value={quoteperson}
                onChange={(e) => setQuotePerson(e.target.value)}
              className="flex-1 min-w-[120px] border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={quoteSentiment}
              onChange={(e) => setQuoteSentiment(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-full px-2 py-1 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Sentiment</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-medium disabled:opacity-50"
              disabled={!newQuote.trim() || !quoteSentiment || quoteloader}
            >
              {quoteloader ? "Adding..." : "Add Quote"}
            </button>
                      </form>
                      </div>
          {/* --- Read More + Edit Field --- */}
          <div className="space-y-3">
            <AnimatePresence>
              {isEditingReadMore && (
                <motion.form
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleUpdateUrl}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-3 py-2 rounded-xl text-sm"
                    disabled={urlloader}
                  >
                    {urlloader ? "Updating..." : "Update"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
                >
                  Read More <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setIsEditingReadMore(!isEditingReadMore)}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                >
                  | <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleDeleteNews}
                className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsCard;
