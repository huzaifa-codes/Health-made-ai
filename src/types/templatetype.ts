export interface TemplateData {
  fullName?: string;
  email?: string;
  summary?: string;
  skills?: string;
  experience?: string;
  [key: string]: string | undefined;
}
export interface ResumeData {
  fullName: string;
  email: string;
  summary: string;
    [key: string]: string; 
}

export type TemplateDatas = ResumeData;

export interface TemplateType {
  id: string;
  name: string;
  component: React.ComponentType<{ data: ResumeData }>;
}
