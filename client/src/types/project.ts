import type { Section } from "./section";
export interface Project {
  id: string;
  title: string;
  color: string;
  order: number;
  favorites: boolean;
  sections?: Section[];
}
