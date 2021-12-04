import boom from "@hapi/boom";
import { ulid } from "ulid";

import { userRepo } from "./user.repo";
import type { User, UserSignupPayload } from "./user.type";

class UserService {
  signup({ username, email }: UserSignupPayload): User {
    if (userRepo.findByUsername(username)) {
      throw boom.badRequest(
        `A user with the username "${username}" already exists.`
      );
    }
    if (userRepo.findByEmail(email)) {
      throw boom.badRequest(`A user with the email "${email}" already exists.`);
    }

    const user = userRepo.insert({
      id: ulid(),
      username,
      email,
      created_at: new Date(),
    });

    return user;
  }

  list(): User[] {
    const users = userRepo.list();
    return users;
  }
}

export const userService = new UserService();
