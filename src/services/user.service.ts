import { User } from "@prisma/client";
import { prisma, PrismaTypes } from "../config/prisma";

/**
 * Find one user
 * @param {PrismaTypes.UserWhereInput} condition - The condition to find the user
 * @returns {Promise<PrismaTypes.User | null>} The user
 */
async function findOne(
  condition: PrismaTypes.UserWhereInput
): Promise<User | null> {
  return await prisma.user.findFirst({
    where: condition,
  });
}

export function create(data: PrismaTypes.UserCreateInput) {
  return prisma.user.create({
    data,
  });
}

export default {
  findOne,
  create,
};
