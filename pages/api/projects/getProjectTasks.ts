/* request gives an id of project and response gives all the tasks that belong to that project*/
import type { NextApiRequest, NextApiResponse } from "next";
import { ITask } from "../../../types/Task.d";
import { IUser } from "../../../types/User.d";
import { sendBadRequestResponse, sendSuccessResponse } from "../responses";
import { PrismaClient, Project, Task, User } from "@prisma/client";

/**
 * @author Ben Pritchard
 *
 * @description Returns all tasks that belong to a project with given project id
 *
 * @input Project ID
 *
 */

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

const mapTask = (
  task: Task & {
    assignee: User;
    project: Project | null;
  }
): ITask => ({
  id: task.id,
  name: task.name,
  description: task.description,
  deadline: task.deadline,
  user: mapAssignee(task.assignee),
  status: statusMap[task.status] as
    | "to-do"
    | "in-progress"
    | "review"
    | "completed",
  projectName: task.project ? task.project.name : null,
  archived: task.archived,
  manHours: task.manHours,
  subTasks: JSON.parse(JSON.stringify(task.subTasks as string)),
});

const disconnect = async () => {
  await prisma.$disconnect();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id: string = req.body.id;
  if (id === null || id === undefined)
    sendBadRequestResponse(res, { message: "No id provided" });

  try {
    const tasks = await prisma.task.findMany({
      where: { projectId: parseInt(id as string) },
      include: {
        assignee: true,
        project: true,
      },
    });

    sendSuccessResponse(res, tasks.map(mapTask));
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "An error occurred" });
  } finally {
    disconnect();
  }
}
