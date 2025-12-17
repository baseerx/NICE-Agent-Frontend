export type Tag = { tag_id: number; tag_name: string,sentiment:string };
export type Article = {
  article_id: number;
  headline: string;
  publication_date: string;
  author?: string;
  source?: string;
  url?: string;
  image_url?: string;
  sentiment?: string;
    article_summary?: string;
    quote_summary?: string;
    quote_sentiment?: string;
  tags?: Tag[];
};



export type Summary = {
    combined_summary?: string;
    overall_sentiment?: string;
    sentiment_breakdown?: {
        positive: number;
        negative: number;
        neutral: number;
    };
    date_range?: {
        earliest_date: string;
        latest_date: string;
    };
    key_developments?: string[];
};

