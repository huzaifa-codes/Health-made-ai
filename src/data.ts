// /data/templates.ts
import Modern01 from "@/component/templates/Modern01";
import Modern02 from "@/component/templates/Modern02";
import Modern03 from "@/component/templates/Modern03";
import Modern04 from "@/component/templates/Modern04";
import Modern05 from "@/component/templates/Modern05";


import { TemplateType } from "@/types/templatetype";

export const templates: TemplateType[] = [
  { id: "modern01", name: "Modern 01", component: Modern01 },
  { id: "modern02", name: "Modern 02", component: Modern02 },
  { id: "modern03", name: "Modern 03", component: Modern03 },
  { id: "modern04", name: "Modern 04", component: Modern04 },
  { id: "modern05", name: "Modern 05", component: Modern05 },
];
