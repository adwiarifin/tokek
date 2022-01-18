import boom from "@hapi/boom";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ulid } from "ulid";

import { config } from "../../config";
import { logger } from "../../util/logger";

import { userRepo } from "./user.repo";
import type { User, UserLoginPayload, UserSignupPayload } from "./user.type";

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

  async login({
    phone_number,
    email,
    otp,
  }: UserLoginPayload): Promise<{ user: User; token: string }> {
    let user: User | null = null;
    if (phone_number) {
      const userByPhoneNumber = await userRepo.findByPhoneNumber(phone_number);
      if (!userByPhoneNumber) {
        logger.error(`Login Invalid, phone_number ${phone_number} not exists`);
        throw boom.badRequest(
          `Login Invalid, phone_number ${phone_number} not exists`
        );
      }
      user = userByPhoneNumber;
    }
    if (email) {
      const userByEmail = await userRepo.findByEmail(email);
      if (!userByEmail) {
        logger.error(`Login Invalid, email ${email} not exists`);
        throw boom.badRequest(`Login Invalid, email ${email} not exists`);
      }
      user = userByEmail;
    }
    if (!user) {
      logger.error(`Login Invalid, phone_number or email not defined`);
      throw boom.badRequest(`Login Invalid, phone_number or email not defined`);
    }

    // user exists, validate otp
    if (otp != "1234") {
      // TODO: need to fix static otp
      logger.error(`Login Invalid, wrong otp`);
      throw boom.badRequest(`Login Invalid, wrong otp`);
    }

    // otp valid, generate token
    const token = this.generateToken(user.id);
    // remove unwanted data
    delete user.created_at;
    delete user.updated_at;
    delete user.password;
    return { user, token };
  }

  generateToken(userId: string) {
    const { secret, expire } = config.app.token;
    return jwt.sign({ uid: userId }, secret, { expiresIn: expire });
  }
}

export const userService = new UserService();
