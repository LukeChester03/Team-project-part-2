import { Autocomplete, Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ITask } from "types/Task.d";
import { IProject } from "../../types/Project.d";
import { IUser } from "../../types/User.d";

/**
 * @author Tom Whitticase
 *
 * @description TaskFilter component. used for filtering tasks by project and user
 *
 * @param setFilter - Function to set the filter
 * @param tasks - Array of tasks to generate filter options from
 *
 * @returns JSX.Element
 */

interface IProps {
  setFilter: any;
  tasks: ITask[];
}
export default function TaskFilter({ setFilter, tasks }: IProps) {
  const [projects, setProjects] = useState<string[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    // Extract unique users from tasks
    const uniqueUsers: IUser[] = [];
    tasks.forEach((task) => {
      if (!uniqueUsers.some((user) => user.userId === task.user.userId)) {
        uniqueUsers.push(task.user);
      }
    });
    setUsers(uniqueUsers);

    // Extract unique project names from tasks
    const uniqueProjectNames: string[] = [];
    tasks.forEach((task) => {
      if (task.projectName && !uniqueProjectNames.includes(task.projectName)) {
        uniqueProjectNames.push(task.projectName);
      }
    });
    setProjects(uniqueProjectNames);
  }, [tasks]);

  const [selectedProject, setSelectedProject] = useState<string | null>();
  const [selectedUser, setSelectedUser] = useState<string | null>();

  //update filter when selected project or user changes
  useEffect(() => {
    setFilter({ project: selectedProject, userId: selectedUser });
  }, [selectedProject, selectedUser]);

  return (
    <>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", padding: 1 }}>
        <Autocomplete
          disablePortal
          options={
            projects?.map((project) => {
              return { label: project };
            }) || []
          }
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Project"
              size="small"
              variant="standard"
            />
          )}
          onChange={(event, value) => {
            setSelectedProject((value && value.label) || null);
          }}
        />

        <Autocomplete
          size={"small"}
          disablePortal
          options={
            users?.map((user) => {
              return { label: user.name, email: user.userId };
            }) || []
          }
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="User" variant={"standard"} />
          )}
          onChange={(event, value) => {
            setSelectedUser((value && value.email) || null);
          }}
        />
      </Box>
    </>
  );
}
