export interface CategoryStats {
  id: string;
  name: string;
  tools: number;
  votes: number;
  saved: number;
}

export interface ToolSocialLink {
  label: "Website" | "Telegram" | "X";
  url: string;
}

export interface SocialLinks {
  telegram: string;
  x: string;
  website: string;
}

export type ToolCategory = '' 
  | 'Data Analytics'
  | 'AI Tools'
  | 'Development' 
  | 'Design' 
  | 'Marketing' 
  | 'Productivity' 
  | 'Social Media' 
  | 'Content Creation' 
  | 'E-commerce' 
  | 'Other';

export type ToolTag = 'Free' 
  | 'Paid' 
  | 'Open Source' 
  | 'Web-based' 
  | 'Desktop' 
  | 'Mobile' 
  | 'API' 
  | 'Plugin' 
  | 'No Signup' 
  | 'Cloud' 
  | 'Self-hosted' 
  | 'AI Powered';

export interface Tool {
  _id: string;
  name: string;
  shortDescription?: string;
  fullDetail?: string;
  toolImages?: string[];
  category: ToolCategory;
  tags: ToolTag[];
  clicks: number;
  views: number;
  createdAt: string;
  bookmarks: number;
  logo?: string;
  links: ToolSocialLink[];
}

export type NewTool = Omit<Tool, '_id' | 'clicks' | 'views' | 'createdAt' | 'bookmarks' | 'logo' | 'links'> & {
  links: SocialLinks;
};

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