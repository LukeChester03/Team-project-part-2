/**
 * @author Ben Pritchard
 *
 * @description List of project data that the user as access to
 *
 * @input IUser tyoe containing the user's data who is accessing the projects
 *
 */

import type { NextApiRequest, NextApiResponse } from "next";
import {
  sendErrorResponse,
  sendSuccessResponse,
  sendBadRequestResponse,
} from "../responses";
import {
  PrismaClient,
  Project,
  Task,
  User,
  UserOnProjects,
} from "@prisma/client";
import { IProject } from "../../../types/Project.d";
import { IUser } from "../../../types/User.d";
import { ITask } from "../../../types/Task.d";

const prisma = new PrismaClient();

const statusMap = {
  TODO: "to-do",
  INPROGRESS: "in-progress",
  REVIEW: "review",
  COMPLETED: "completed",
};

const mapAssignee = (assignee: User): IUser => ({
  userId: assignee.userId,
  name: assignee.name,
  role: assignee.role.toLowerCase() as "employee" | "manager" | "admin",
  profileImage: assignee.profileImage as string,
});

// maps project from database to IProject type
const mapProject = (
  project: Project & {
    tasks: Task[];
    userOnProjects: UserOnProjects[];
    leader: User;
  }
): IProject => ({
  id: project.id,
  name: project.name,
  description: project.description,
  userIds: project.userOnProjects.map((user) => user.userId), //
  leaderId: project.leaderId,
});
// need to map list of users retrieved from usersOnProjects and Users from database to IUser to store in project
const disconnect = async () => {
  await prisma.$disconnect();
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user: IUser = req.body.user; //IUSer type
  } catch (error) {
    sendBadRequestResponse(res, { message: "No user provided" });
  }
  try {
    const user: IUser = req.body.user; //IUSer type
    //get projects from database that the user is leader of
    if (user.role === "employee") {
      //if user is employee
      try {
        const projects = await (prisma.project as any).findMany({
          where: {
            leaderId: user.userId,
          },
          include: {
            leader: true,
            userOnProjects: true,
            tasks: {
              include: {
                assignee: true,
                project: true,
              },
            },
          },
        });
        sendSuccessResponse(res, projects.map(mapProject));
      } catch (error) {
        console.error(error);
        sendErrorResponse(res, error);
      }
    } else {
      //if user is manager or admin
      try {
        const projects = await (prisma.project as any).findMany({
          include: {
            leader: true,
            tasks: {
              include: {
                assignee: true,
                project: true,
              },
            },
            userOnProjects: true,
          },
        });
        sendSuccessResponse(res, projects.map(mapProject));
      } catch (error) {
        console.error(error);
        sendErrorResponse(res, error);
      }
    }
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, error);
  }
};
