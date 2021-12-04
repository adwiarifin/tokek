import { User } from "./user.type";

const userDb: User[] = [];

class UserRepo {
  list(): User[] {
    return userDb;
  }

  find(id: string): User | undefined {
    return userDb.find(user => user.id === id);
  }

  findByUsername(username: string): User | undefined {
    return userDb.find(user => user.username === username);
  }

  findByEmail(email: string): User | undefined {
    return userDb.find(user => user.email === email);
  }

  insert(user: User): User {
    userDb.push(user);
    return user;
  }
}

export const userRepo = new UserRepo();
