import React, { useState, useEffect } from "react";
import MainCard from "../../components/cards/MainCard";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import DatePicker from "../../components/form/date-picker";
import axios from "../../api/axios";
import { getCsrfToken } from "../../utils/global";
import { useNavigate } from "react-router-dom";
type Props = {
  heading: string;
  sentiment: string;
  summary: string;
  author: string;
  sourceOfNews: string;
  publishDate: string;
  articleSourceLink: string;
  tags: string;
};
const AddArticle = () => {
    const navigation = useNavigate();
  const [formData, setFormData] = useState<Props>({
    heading: "",
    sentiment: "",
    summary: "",
    author: "",
    sourceOfNews: "",
    publishDate: "",
    articleSourceLink: "",
    tags: "",
  });

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // simple validation: ensure no field is empty (after trimming)
  const hasEmptyField = Object.values(formData).some((v) => v.trim() === "");
  if (hasEmptyField) {
    alert("Please fill in all fields before submitting.");
    return;
  }

  try {
    // map frontend keys to backend keys
    const payload = {
      headline: formData.heading,
      publication_date: formData.publishDate,
      author: formData.author,
      source: formData.sourceOfNews,
      url: formData.articleSourceLink,
      sentiment: formData.sentiment,
      summary: formData.summary,
      local_or_international: "Local", // default, can be dynamic
      article_unique_id: crypto.randomUUID(), // generate unique ID
      tags: formData.tags.split(",").map((t) => t.trim()), // optional
    };

    await axios.post("/articles/addarticle/", payload, {
      headers: {
        "X-CSRFToken": getCsrfToken(),
      },
    });

    navigation("/articles");
  } catch (error) {
    console.error("Error submitting article:", error);
    alert("Failed to submit article. Please try again.");
  }
};

  return (
    <MainCard cardtitle="Add Article">
      <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div>
          <Input
            type="text"
            value={formData.heading}
            onChange={(e) =>
              setFormData({ ...formData, heading: e.target.value })
            }
            name="articleHeading"
            placeholder="Article Heading"
          />
        </div>

        <div>
          <Select
            options={[
              { value: "Positive", label: "Positive" },
              { value: "Negative", label: "Negative" },
              { value: "Neutral", label: "Neutral" },
            ]}
            placeholder="Choose sentiment"
            defaultValue=""
            onChange={(value: string) => {
              // handle sentiment change (replace with form state handler as needed)
              setFormData({ ...formData, sentiment: value });
            }}
          />
        </div>

        <div>
          <Input
            type="textarea"
            name="articleSummary"
            value={formData.summary}
            onChange={(e) =>
              setFormData({ ...formData, summary: e.target.value })
            }
            placeholder="Article Summary"
          />
        </div>

        <div>
          <Input
            type="text"
            name="author"
            placeholder="Article Author"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
          />
        </div>

        <div>
          <Input
            type="text"
            name="sourceOfNews"
            placeholder="Source of News"
            value={formData.sourceOfNews}
            onChange={(e) =>
              setFormData({ ...formData, sourceOfNews: e.target.value })
            }
          />
        </div>

        <div>
          <DatePicker
            id="publishDate"
            placeholder="Publishing Date"
            defaultDate={formData.publishDate || undefined}
            onChange={(_selectedDates, dateStr) =>
              setFormData({ ...formData, publishDate: dateStr })
            }
          />
        </div>

        <div>
          <Input
            type="text"
            name="articleSourceLink"
            placeholder="Article source link (URL)"
            value={formData.articleSourceLink}
            onChange={(e) =>
              setFormData({ ...formData, articleSourceLink: e.target.value })
            }
          />
        </div>

        <div>
          {/* tags input: enforce comma-separated tags via pattern and give a hint */}
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Tags (separate with commas)"
            title="Enter tags separated by commas, e.g. tag1, tag2, tag3"
            pattern="^\s*[^,]+(?:\s*,\s*[^,]+)*\s*$"
            className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900  dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800 dark:text-white/90"
          />
        </div>
        <div className="col-span-2 flex justify-center">
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full md:w-auto"
          >
            Submit Article
          </Button>
        </div>
      </form>
    </MainCard>
  );
};

export default AddArticle;
