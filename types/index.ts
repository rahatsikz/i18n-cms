type ISODateString = string;

// User model
export interface User {
  id: string;
  username: string;
  password: string;
  role: "user" | string;
  projects?: Project[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Project model
export interface Project {
  id: string;
  userId: string;
  user?: User;
  name: string;
  slug?: string | null;
  description?: string | null;
  locales?: Locale[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Locale model
export interface Locale {
  id: string;
  projectId: string;
  project?: Project;
  name?: string | null;
  lang?: string | null;
  content: Record<string, any>;
  version?: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
