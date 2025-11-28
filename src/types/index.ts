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
  bookmarks: [];
  logo: string;
  links: ToolLink[];
}

export type Contact = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  reason: string;
  terms: boolean;
}