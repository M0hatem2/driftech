export interface User {
  id: string;
  name: string;
  email: string;
  gender: string;
  phone: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileResponse {
  user: User;
}