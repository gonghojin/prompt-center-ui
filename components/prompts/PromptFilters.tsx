import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Search } from "lucide-react";
import { CategorySelect } from "@components/category/CategorySelect";
import type { Category } from "@/app/types/category";
import type { FC } from "react";

interface PromptFiltersProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  categories: Category[];
  rootCategories: Category[];
}

export const PromptFilters: FC<PromptFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  rootCategories,
}) => (
  <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
    <CardContent className="p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="프롬프트 제목, 설명, 태그로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
            aria-label="프롬프트 검색"
          />
        </div>
        <CategorySelect
          categories={categories}
          rootCategories={rootCategories}
          value={selectedCategory}
          onChange={setSelectedCategory}
          className="w-full md:w-48 bg-white/10 backdrop-blur-sm border-white/20 text-white"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48 bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">최근 수정순</SelectItem>
            <SelectItem value="popular">인기순</SelectItem>
            <SelectItem value="views">조회수순</SelectItem>
            <SelectItem value="alphabetical">이름순</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>
); 