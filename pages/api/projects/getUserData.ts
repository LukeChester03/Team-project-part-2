/**
 * @author Ben Pritchard
 *
 * @description Endpoint to get all users data associated with a project
 *
 */
import type { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../../types/User.d";
import { PrismaClient } from "@prisma/client";
import {
  sendBadRequestResponse,
  sendErrorResponse,
  sendSuccessResponse,
} from "../responses";
import Users from "pages/users";
import { IProject } from "types/Project.d";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  async function main() {
    const { projectId } = req.body;
    try {
      const users = await prisma.user.findMany({
        where: {
          projectsAssigned: {
            some: {
              projectId: projectId,
            },
          },
        },
      });
      if (users) {
        const usersArray: IUser[] = users.map((user) => {
          const newUser: IUser = {
            userId: user.userId,
            name: user.name,
            role: user.role.toLowerCase() as "employee" | "manager" | "admin",
            profileImage: user.profileImage as string,
          };
          return newUser;
        });
        sendSuccessResponse(res, usersArray);
      }
    } catch (e) {
      sendErrorResponse(res, e);
    }
  }
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
