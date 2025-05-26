import { Category } from "@/app/types/category";
import { Badge } from "@components/ui/badge";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  return (
    <Badge variant="outline" className={className}>
      {category.parentCategoryName
        ? `${category.parentCategoryName} > ${category.displayName}`
        : category.displayName}
    </Badge>
  );
}; 