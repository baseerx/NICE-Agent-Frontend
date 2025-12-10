import React from "react";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Article } from "../../types";

interface NewsCardProps {
  article: Article;
  changeVerificationStatus:(articleId:number)=>void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article,changeVerificationStatus }) => {
  const sentiment = article.sentiment || "Neutral";
    const tags = article.tags?.map((t) => t.tag_name) || [];
   
  const changeVerification = async(articleId:number)=>{
    changeVerificationStatus(articleId);
  }
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg"
    >
      {/* Sentiment (disabled look) */}
      <div className="flex justify-between items-center mb-4">
        <span
          className={`px-4 py-1 rounded-full text-sm font-medium border ${sentimentColor} ${sentimentBorder}`}
        >
          {sentiment}
        </span>

              <span
                  onClick={()=>changeVerification(article.article_id)}
          className={`text-xs font-medium px-3 py-1 rounded-full bg-green-100 animate animate-pulse text-green-700 cursor-pointer`}
              >
                 change verification status
        </span>
      </div>

      {/* Headline */}
      <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {article.headline}
      </h2>

      {/* Summary */}
      <p className="text-gray-600 dark:text-gray-400 text-sm md:text-sm xl:text-base mb-4">
        {article.article_summary}
      </p>

      {/* Meta Info */}
      <div className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          By <span className="font-medium">{article.author ?? "Unknown"}</span>
        </span>
        <span>
          • {article.source ?? "Unknown Source"} • {article.publication_date}
        </span>
      </div>

      {/* Tags (non-editable) */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end items-center">
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
          >
            Read More <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default NewsCard;
