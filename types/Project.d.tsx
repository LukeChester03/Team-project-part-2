import { ITask } from "./Task.d";
import { IUser } from "./User.d";

/**
 * @author Tom Whitticase
 *
 * @description This is the project interface. It is used to define the project object.
 */

export interface IProject {
  id: number;
  name: string;
  description: string;
  userIds: string[];
  leaderId: string;
}
export interface ICreateProject {
  name: string;
  description: string;
  userIds: string[];
  leaderId: string;
}
