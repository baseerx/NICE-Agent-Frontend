import React, { useState } from "react";
import {
  X,
  Trash2,
  ChevronDown,
  Check,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Article } from "../../types";

interface NewsCardProps {
  article: Article;
  onSentimentChange: (articleId: number, sentiment: string) => void;
  onVerify: (articleId: number) => void;
  onAddTag: (articleId: number, tag: string) => void;
  onRemoveTag: (articleId: number, tag: string) => void;
  onDelete?: (articleId: number) => void;
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tags, setTags] = useState(article.tags?.map((t) => t.tag_name) || []);
  const [newTag, setNewTag] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [verified, setVerified] = useState(false);

  // Handle sentiment change
  const handleSentimentChange = (option: string) => {
    setSentiment(option);
    setDropdownOpen(false);
    onSentimentChange(article.article_id, option);
  };

  // Handle verification toggle
  const handleVerify = () => {
    const newStatus = !verified;
    setVerified(newStatus);
    onVerify(article.article_id);
  };

  // Handle tag add/remove
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags([...tags, newTag.trim()]);
      onAddTag(article.article_id, newTag.trim());
      setNewTag("");
    }
  };
  const handleDeleteTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
    onRemoveTag(article.article_id, tag);
  };

  // Handle delete
  const handleDeleteNews = () => {
    setIsDeleted(true);
    onDelete(article.article_id);
  };

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
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
            <div className="flex items-center gap-3 relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 border ${sentimentColor} ${sentimentBorder}`}
              >
                {sentiment}
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-9 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-10 w-32"
                >
                  {sentimentOptions.map((option) => (
                    <button
                      key={option}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-lg ${
                        option === sentiment
                          ? "bg-gray-100 dark:bg-gray-700 font-medium"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handleSentimentChange(option)}
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <button
              type="button"
              onClick={handleVerify}
              className={`border flex ${
                verified
                  ? "text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                  : "text-gray-600 border-gray-400 hover:bg-gray-600 hover:text-white"
              } font-medium rounded-full text-xs p-2.5 transition-all duration-200`}
            >
              {verified ? "Verified" : "Verify Me"}
              {verified && <Check className="w-3 h-3 ml-1" />}
            </button>
          </div>

          {/* Headline */}
          <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {article.headline}
          </h2>

          {/* Summary */}
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-sm xl:text-base mb-4">
            {article.article_summary}
          </p>

          {/* Meta */}
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

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {tags.map((tag) => (
              <motion.div
                key={tag}
                whileHover={{ scale: 1.05 }}
                className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button type="button" onClick={() => handleDeleteTag(tag)}>
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

          {/* Footer actions */}
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
