export interface University {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Faculty {
  id: number;
  name: string;
  university_id: number;
  created_at: string | null;
  updated_at: string | null;
}