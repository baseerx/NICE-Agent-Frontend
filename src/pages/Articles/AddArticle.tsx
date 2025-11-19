import React from "react"
import MainCard from "../../components/cards/MainCard"
import Input from "../../components/form/input/InputField"
import Select from "../../components/form/Select"
import Button from "../../components/ui/button/Button"

const AddArticle = () => {
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("clicked")
    }
        
  return (
    <MainCard cardtitle="Add Article">
      <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div>
          <Input
            type="text"
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
              console.log("sentiment:", value);
            }}
          />
        </div>

        <div>
          <Input
            type="textarea"
            name="articleSummary"
            placeholder="Article Summary"
          />
        </div>

        <div>
          <Input type="text" name="author" placeholder="Article Author" />
        </div>

        <div>
          <Input type="text" name="sourceOfNews" placeholder="Source of News" />
        </div>

        <div>
          <Input type="date" name="publishDate" placeholder="Publishing Date" />
        </div>

        <div>
          <Input
            type="text"
            name="articleSourceLink"
            placeholder="Article source link (URL)"
          />
        </div>

        <div>
          {/* tags input: enforce comma-separated tags via pattern and give a hint */}
          <input
            type="text"
            name="tags"
            placeholder="Tags (separate with commas)"
            title="Enter tags separated by commas, e.g. tag1, tag2, tag3"
            pattern="^\s*[^,]+(?:\s*,\s*[^,]+)*\s*$"
            className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900  dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800 dark:text-white/90"
          />
        </div>
        <div className="col-span-2 flex justify-center">
            <Button type="submit" variant="primary" size="md" className="w-full md:w-auto">
                Submit Article
            </Button>
        </div>
      </form>
    </MainCard>
  );
}

export default AddArticle