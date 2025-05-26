import { Category } from "@/app/types/category";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

interface CategorySelectProps {
  categories: Category[];
  rootCategories: Category[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CategorySelect = ({
  categories,
  rootCategories,
  value,
  onChange,
  placeholder = "카테고리",
  className,
}: CategorySelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 카테고리</SelectItem>
        {rootCategories.map((category) => (
          <div key={category.id}>
            <SelectItem value={category.id.toString()}>
              {category.displayName}
            </SelectItem>
            {categories
              .filter((sub) => sub.parentCategoryId === category.id)
              .map((subCategory) => (
                <SelectItem
                  key={subCategory.id}
                  value={subCategory.id.toString()}
                  className="pl-6"
                >
                  {subCategory.displayName}
                </SelectItem>
              ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}; 