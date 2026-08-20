export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cookTimeMin: number;
  tag: string;
  imageUrl?: string;
  warningNote?: string;
  createdAt: string;
  isUserUpload: boolean;
  inMyBox: boolean;
  servings?: number;
  difficulty?: 'trivial' | 'medium' | 'high';
}

export type NavigationTab = 'my-box' | 'search' | 'upload' | 'login' | 'faq' | 'terms' | 'privacy';

export type FilterCategory = 'ALL' | 'MY_UPLOADS' | 'QUICK_FIXES' | 'SAVED';

export type ThemeMode = 'dark' | 'light';
