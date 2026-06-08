import type { ReactNode } from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string; // Lucide icon name
  component: ReactNode;
  seoKeywords: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}
