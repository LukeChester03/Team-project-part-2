import type { NextApiRequest, NextApiResponse } from "next";
import {
  sendBadRequestResponse,
  sendErrorResponse,
  sendSuccessResponse,
} from "../responses";
import { PrismaClient } from "@prisma/client";

/**
 * @author Ben Pritchard
 *
 * @description Endpoint to delete a project from the database
 *
 * @input projectId of the project to delete
 *
 */

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id: number = req.body.id; //project
  if (!id) sendBadRequestResponse(res, "No project provided");

  //delete all userOnProjects with projectId = id and then delete project with id = id
  async function main() {
    try {
      const deletedUserOnProjects = await prisma.userOnProjects.deleteMany({
        where: {
          projectId: id,
        },
      });
      const deletedProject = await prisma.project.delete({
        where: {
          id: id,
        },
      });

      sendSuccessResponse(res, { updated: true });
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
