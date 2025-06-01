import type { Category } from "./category";
import type { JSX } from "react";

export interface ApiPrompt {
  id: string;
  title: string;
  description: string;
  content: string;
  author: { id: string; email: string; name: string };
  tags: { id: number; name: string }[];
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  favoriteCount: number;
  categoryId: number;
  visibility: string;
  status: string;
  public: boolean;
  createdByName: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: Category;
  author: string;
  favoriteCount: number;
  viewCount: number;
  updatedAt: string;
  tags: string[];
  icon: JSX.Element;
  isFavorite: boolean;
  isPublic: boolean;
} 