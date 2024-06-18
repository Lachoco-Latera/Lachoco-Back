import { JWT_SECRET } from "../config/envs";
import { createUserDto } from "../dto/user/createUser.dto";
import { LoginDto } from "../dto/user/credential.dto";
import { User } from "../entities/user.entities";
import { UserRepo } from "../repositories/repositories";
import dataError from "../utils/errors/dataError";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userServices = {
  createUser: async (user: createUserDto) => {
    const verifyEmail = await UserRepo.findOne({
      where: {
        email: user.email,
      },
    });
    //*Verificar si existe email
    if (verifyEmail) throw new dataError("EMAIL DUPLICATED", 400);

    const hashPassword = await bcrypt.hash(user.password, 10);
    if (!hashPassword) throw new dataError("Password could not be hashed", 400);

    const newUser: User = new User();
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.lastname = user.lastname;
    newUser.password = user.password;

    const savedNewUser = await UserRepo.save(newUser);
    if (!savedNewUser) throw new dataError("User not created", 400);
    return savedNewUser;
  },
  loginUser: async (credential: LoginDto) => {
    if (!credential.email || !credential.password)
      throw new dataError("Please enter your email and Password", 400);

    const verifyEmail = await UserRepo.findOne({
      where: {
        email: credential.email,
      },
    });

    if (!verifyEmail) {
      throw new dataError("Email not Found or Password not Valid", 400);
    }

    const checkPassword = await bcrypt.compare(
      credential.password,
      verifyEmail.password
    );
    if (!checkPassword) {
      throw new dataError("Email not Found or Password not Valid", 400);
    }

    const payload = {
      id: verifyEmail.id,
      email: verifyEmail.email,
      role: [verifyEmail.role],
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h",
    });
    return { success: "Login Success", token };
  },
};
