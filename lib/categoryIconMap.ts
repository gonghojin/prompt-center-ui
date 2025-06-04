import { Code2, Palette, BarChart3, Database } from "lucide-react";
import type { JSX } from "react";
import React from "react";

export const categoryIconMap: Record<string, JSX.Element> = {
  Backend: React.createElement(Code2, { className: "h-5 w-5" }),
  Frontend: React.createElement(Palette, { className: "h-5 w-5" }),
  "Data Science": React.createElement(BarChart3, { className: "h-5 w-5" }),
  Database: React.createElement(Database, { className: "h-5 w-5" }),
  Design: React.createElement(Palette, { className: "h-5 w-5" }),
  default: React.createElement(Code2, { className: "h-5 w-5" }),
}; 