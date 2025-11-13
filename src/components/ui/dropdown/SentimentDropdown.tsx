import { motion } from "framer-motion";

interface SentimentDropdownProps {
  sentimentOptions: string[];
  sentiment: string;
  handleSentimentChange: (option: string) => void;
}

const SentimentDropdown: React.FC<SentimentDropdownProps> = ({
  sentimentOptions,
  sentiment,
  handleSentimentChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.15 }}
      className="absolute top-9 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-50 w-32"
    >
      {sentimentOptions.map((option) => (
        <button
          key={option}
          onClick={() => handleSentimentChange(option)}
          className={`block w-full text-left px-3 py-2 text-sm rounded-lg ${
            option === sentiment
              ? "bg-gray-100 dark:bg-gray-700 font-medium"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          {option}
        </button>
      ))}
    </motion.div>
  );
};

export default SentimentDropdown;
