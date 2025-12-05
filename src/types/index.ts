export interface CategoryStats {
  id: string;
  name: string;
  tools: number;
  votes: number;
  saved: number;
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
  category: ToolCategory[];
  tags: ToolTag[];
  views: number;
  createdAt: string;
  updatedAt: string;
  bookmarks: User["_id"][];
  logo: string;
  links: SocialLinks;
  author?: {
    _id: string;
    username: string;
  };
}

export type NewTool = Omit<Tool, '_id' | 'views' | 'createdAt' | 'updatedAt' | 'bookmarks'>;

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
export interface User {
  _id: string;
  username: string;
  email: string;
  refreshToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContext {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}