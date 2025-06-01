export const getSortType = (sortBy: string): string => {
  switch (sortBy) {
    case "recent": return "LATEST_MODIFIED";
    case "popular": return "MOST_FAVORITE";
    case "views": return "MOST_VIEWS";
    case "alphabetical": return "TITLE_ASC";
    default: return "LATEST_MODIFIED";
  }
}; 