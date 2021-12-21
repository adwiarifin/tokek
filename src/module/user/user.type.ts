export interface User {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserSignupPayload {
  name: string;
  phone_number: string;
  email: string;
  password: string;
}
