import boom from "@hapi/boom";
import bcrypt from "bcryptjs";
import { ulid } from "ulid";

import { userRepo } from "./user.repo";
import type { User, UserSignupPayload } from "./user.type";

class UserService {
  async signup({
    name,
    phone_number,
    email,
    password,
  }: UserSignupPayload): Promise<User> {
    await this.validateSignup(phone_number, email);

    const hash = bcrypt.hashSync(password, 10);
    const userData = {
      id: ulid(),
      name,
      phone_number,
      email,
      password: hash,
    };
    await userRepo.insert(userData);

    return userData;
  }

  async validateSignup(phone_number: string, email: string) {
    const userByPhoneNumber = await userRepo.findByPhoneNumber(phone_number);
    if (userByPhoneNumber) {
      throw boom.badRequest(
        `A user with the phone number "${phone_number}" already exists.`
      );
    }
    const userByEmail = await userRepo.findByEmail(email);
    if (userByEmail) {
      throw boom.badRequest(`A user with the email "${email}" already exists.`);
    }
  }

  async list(): Promise<User[]> {
    const users = await userRepo.list();
    return users;
  }
}

export const userService = new UserService();
