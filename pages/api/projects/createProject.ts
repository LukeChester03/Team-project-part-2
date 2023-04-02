import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import {
  sendBadRequestResponse,
  sendErrorResponse,
  sendSuccessResponse,
} from "../responses";
/**
 * @author Ben Pritchard
 *
 * @description Endpoint to add a new project to the database
 *
 * @input ICreateProject containing data to add to the database
 *
 */
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse

  // add project, users IDs not project IDs
) {
  const { name, description, userIds, leaderId } = req.body;
  if (!name || !description || !userIds || !leaderId) {
    sendBadRequestResponse(res, { message: "No project data provided" });
  }

  async function main() {
    //queries here
    try {
      const project = await prisma.project.create({
        data: {
          name: name,
          description: description,
          leaderId: leaderId,
        },
      });
      for (const userId of userIds) {
        const userOnProject = await prisma.userOnProjects.create({
          data: {
            userId: userId,
            projectId: project.id,
            assignedBy: leaderId,
          },
        });
      }

      if (project) {
        //project created on database
        sendSuccessResponse(res, { created: true });
      } else {
        //project not created on database
        sendSuccessResponse(res, { created: false });
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
