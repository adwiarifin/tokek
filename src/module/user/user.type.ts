export interface User {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
  token?: string;
}

export interface UserSignupPayload {
  name: string;
  phone_number: string;
  email: string;
  password: string;
}

export interface UserAuthPayload {
  phone_number?: string;
  email?: string;
}

export interface UserLoginPayload extends UserAuthPayload {
  otp: string;
}
