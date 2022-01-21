import { User } from "./user.type";
import * as dbConnection from "../../common/database";
import { Knex } from "knex";

const db: Knex = dbConnection.default;

class UserRepo {
  private tableName = "users";
  private defaultColumns = ["id", "name", "phone_number", "email"];

  async list(): Promise<User[]> {
    const result = (await db(this.tableName).select(
      this.defaultColumns
    )) as User[];
    return result;
  }

  async find(id: string): Promise<User | undefined> {
    const result = (
      (await db(this.tableName)
        .select(this.defaultColumns)
        .where("id", "=", id)) as User[]
    )[0];
    return result;
  }

  async findByPhoneNumber(phone_number: string): Promise<User | undefined> {
    const result = await db<User>(this.tableName)
      .where("phone_number", phone_number)
      .first();
    return result;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await db<User>(this.tableName).where("email", email).first();
    return result;
  }

  async insert(user: User): Promise<number[]> {
    const result = await db<User>(this.tableName).insert(user);
    console.log("insert result: ", result);
    return result;
  }
}

export const userRepo = new UserRepo();
