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
import { envConfig } from "../config/envConfig";

/**
 * @function registerUser
 * @param {Request} req - Express request object containing user registration data
 * @param {Response} res - Express response object
 */
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  try {
    const existingUser = await userService.findOne({
      email: email.toLowerCase(),
    });

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

    const newUser: User = await userService.create(userData);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      envConfig.secretKey.jwtSecretKey,
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

/**
 * @function loginUser
 * @param {Request} req - Express request object containing user login data
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userService.findOne({
      email: email.toLowerCase(),
    });

    if (!existingUser) {
      return response(
        res,
        httpStatus.NOT_FOUND,
        errorMessages.User.USER_NOT_FOUND
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return response(res, httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    // Generate JWT
    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      envConfig.secretKey.jwtSecretKey,
      { expiresIn: "1d" }
    );

    return response(res, httpStatus.OK, "Login successful", {
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
      token,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return response(res, httpStatus.INTERNAL_SERVER_ERROR, err.message);
  }
});

export default {
  registerUser,
  loginUser,
};
