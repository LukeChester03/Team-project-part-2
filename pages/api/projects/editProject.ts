import type { NextApiRequest, NextApiResponse } from "next";
import {
  sendBadRequestResponse,
  sendErrorResponse,
  sendSuccessResponse,
} from "../responses";
import { PrismaClient } from "@prisma/client";
import { IProject } from "types/Project.d";

/**
 * @author Ben Pritchard
 *
 * @description Updates project data in the database
 *
 * @input IProject containing the updated project data
 *
 */

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const project: IProject = req.body.project; //task to edit

  if (!project) sendBadRequestResponse(res, "No project provided");

  const mapStatus = {
    completed: "COMPLETED",
    "in-progress": "INPROGRESS",
    review: "REVIEW",
    "to-do": "TODO",
  };

  //if task is valid then update the database with the new project
  async function main() {
    try {
      const updated = await prisma.project.update({
        where: {
          id: project.id,
        },
        data: {
          name: project.name,
          description: project.description,
        },
      });
      sendSuccessResponse(res, null);
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
