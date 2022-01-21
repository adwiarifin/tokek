import boom from "@hapi/boom";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ulid } from "ulid";

import { config } from "../../config";
import { logger } from "../../util/logger";
import { setCache, getCache, delCache } from "../../common/cache";

import { userRepo } from "./user.repo";
import type {
  User,
  UserAuthPayload,
  UserLoginPayload,
  UserSignupPayload,
} from "./user.type";

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

  async validateUser({ phone_number, email }: UserAuthPayload): Promise<User> {
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

    return user;
  }

  async sendOtp({ phone_number, email }: UserAuthPayload) {
    const user: User = await this.validateUser({ phone_number, email });
    const code = this.generateOTP();
    await setCache(this.getAuthKey(user.id), code, 300);

    return { message: "OTP Sent" };
  }

  async login({
    phone_number,
    email,
    otp,
  }: UserLoginPayload): Promise<{ user: User; token: string }> {
    const user: User = await this.validateUser({ phone_number, email });

    // user exists, validate otp
    const authKey = this.getAuthKey(user.id);
    const savedOtp = await getCache(authKey);
    if (otp != savedOtp) {
      // TODO: need to fix static otp
      logger.error(`Login Invalid, wrong otp`);
      throw boom.badRequest(`Login Invalid, wrong otp`);
    }

    // otp valid, generate token
    await delCache(authKey);
    const token = this.generateToken(user.id);
    // remove unwanted data
    delete user.created_at;
    delete user.updated_at;
    delete user.password;
    return { user, token };
  }

  getAuthKey(id: string): string {
    return `user:auth:${id}`;
  }

  generateOTP(): string {
    let code = "";
    for (let i = 0; i < 4; i++) {
      const rand = Math.floor(Math.random() * 10) + 1;
      code = `${code}${rand}`;
    }
    return code;
  }

  generateToken(userId: string): string {
    const { secret, expire } = config.app.token;
    return jwt.sign({ uid: userId }, secret, { expiresIn: expire });
  }
}

export const userService = new UserService();
