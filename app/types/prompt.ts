import type {Category} from "./category";
import type {JSX} from "react";

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
  favorite: boolean;
  liked: boolean;
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
  icon?: JSX.Element;
  favorite?: boolean;
  isPublic?: boolean;
  status?: string;
  visibility?: string;
  liked?: boolean;
}

export interface FavoritePrompt {
  favoriteId: number;
  promptUuid: string;
  id?: string;
  title: string;
  description: string;
  tags: string[];
  createdById: number;
  createdByName: string;
  categoryId: number;
  visibility: "PUBLIC" | "TEAM" | "PRIVATE";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "DELETED";
  promptCreatedAt: string;
  promptUpdatedAt: string;
  favoriteCreatedAt: string;
  viewCount: number;
  favoriteCount: number;
  category?: Category;
  author?: string;
  icon?: JSX.Element;
  favorite?: boolean;
  liked?: boolean;
} 