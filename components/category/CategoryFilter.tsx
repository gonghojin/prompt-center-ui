import { Category } from "@/app/types/category";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

interface CategoryFilterProps {
  categories: Category[];
  rootCategories: Category[];
  selectedCategories: number[];
  onCategoryChange: (categoryId: number, checked: boolean) => void;
  className?: string;
}

export const CategoryFilter = ({
  categories,
  rootCategories,
  selectedCategories,
  onCategoryChange,
  className,
}: CategoryFilterProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>카테고리</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rootCategories.map((category) => (
            <div key={category.id} className="space-y-2">
              <label className="flex items-center gap-2 text-white/70 text-sm">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={selectedCategories.includes(category.id)}
                  onChange={(e) => onCategoryChange(category.id, e.target.checked)}
                />
                {category.displayName}
              </label>
              <div className="ml-6 space-y-2">
                {categories
                  .filter((sub) => sub.parentCategoryId === category.id)
                  .map((subCategory) => (
                    <label key={subCategory.id} className="flex items-center gap-2 text-white/70 text-sm">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedCategories.includes(subCategory.id)}
                        onChange={(e) => onCategoryChange(subCategory.id, e.target.checked)}
                      />
                      {subCategory.displayName}
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 