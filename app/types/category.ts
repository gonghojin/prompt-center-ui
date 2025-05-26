export interface Category {
  id: number;
  name: string;
  displayName: string;
  description: string;
  parentCategoryId: number | null;
  parentCategoryName: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
} 