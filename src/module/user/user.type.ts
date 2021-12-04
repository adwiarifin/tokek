export interface User {
  id: string;
  username: string;
  email: string;
  created_at: Date;
}

export interface UserSignupPayload {
  username: string;
  email: string;
}
