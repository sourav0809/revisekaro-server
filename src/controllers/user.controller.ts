import { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import { response } from "../utils/response";
import userService from "../services/user.service";
import { SALT_ROUNDS } from "../constant/common";
import { errorMessages } from "../constant/errorMessages";
import { successMessages } from "../constant/successMessages";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await userService.findOne({
      email: email.toLowerCase(),
    } as Prisma.UserWhereInput);

    if (existingUser) {
      return response(
        res,
        httpStatus.CONFLICT,
        errorMessages.User.USER_ALREADY_EXISTS
      );
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const userData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    };

    // Save user
    const newUser: User = await userService.create(userData);

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return response(
      res,
      httpStatus.CREATED,
      successMessages.User.USER_CREATED,
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
        token,
      }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return response(res, httpStatus.INTERNAL_SERVER_ERROR, err.message);
  }
});

export default {
  registerUser,
};
