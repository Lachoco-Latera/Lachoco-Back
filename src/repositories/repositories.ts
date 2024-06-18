import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entities";

export const UserRepo = AppDataSource.getRepository(User);
