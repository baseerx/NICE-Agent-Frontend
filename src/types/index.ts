export type Tag = { tag_id: number; tag_name: string };
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
  tags?: Tag[];
};
