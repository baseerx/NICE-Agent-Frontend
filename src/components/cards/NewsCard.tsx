import React, { useState } from "react";
import { X, Trash2, ChevronDown, Check, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SentimentDropdown from "../ui/dropdown/SentimentDropdown";
import { Article } from "../../types";
import axios from "../../api/axios";
import { getCsrfToken } from "../../utils/global";

interface NewsCardProps {
  article: Article;
  onSentimentChange: (articleId: number, sentiment: string) => void;
  onVerify: (articleId: number) => void;
  onAddTag: (articleId: number, tag: string) => void;
  onRemoveTag: (articleId: number, tag: string) => void;
  onDelete: (articleId: number) => void;
}

const sentimentOptions = ["Positive", "Neutral", "Negative"];

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onSentimentChange,
  onVerify,
  onAddTag,
  onRemoveTag,
  onDelete,
}) => {
  const [sentiment, setSentiment] = useState(article.sentiment || "Neutral");
  const [mainDropdownOpen, setMainDropdownOpen] = useState(false);
  const [tags, setTags] = useState<{ tag: string; sentiment: string }[]>(
    article.tags?.map((t) => ({
      tag: t.tag_name,
      sentiment: t.sentiment || "",
    })) || []
  );

  const [newTag, setNewTag] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [verified, setVerified] = useState(false);

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
   if(window.confirm("Are you sure you want to delete this article?")) {
      setIsDeleted(true);
      onDelete(article.article_id);
    }
  };

  // --- Handle individual tag sentiment ---
  const handleIndividualTagSentiment = async (
    tagName: string,
    sentimentValue: string
  ) => {
    try {
      const response = await axios.post(
        "/articles/set_tag_sentiment/",
        {
          article_id: article.article_id,
          tag: tagName,
          sentiment: sentimentValue,
        },
        { withCredentials: true, headers: { "X-CSRFToken": getCsrfToken() } }
      );
      console.log("Tag sentiment set response:", response.data);

      // Update local tag sentiment
      setTags((prev) =>
        prev.map((t) =>
          t.tag === tagName ? { ...t, sentiment: sentimentValue } : t
        )
      );
    } catch (e) {
      console.error("Error setting tag sentiment:", e);
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

          {/* --- Meta Info --- */}
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              By{" "}
              <span className="font-medium">{article.author ?? "Unknown"}</span>
            </span>
            <span>
              • {article.source ?? "Unknown Source"} •{" "}
              {article.publication_date}
            </span>
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

          {/* --- Footer --- */}
          <div className="flex justify-between items-center">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
            >
              Read More <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={handleDeleteNews}
              className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsCard;
