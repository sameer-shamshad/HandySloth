export interface ToolLink {
  label: string;
  url: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  clicks: number;
  views: number;
  createdAt: string;
  logo: string;
  links: ToolLink[];
}