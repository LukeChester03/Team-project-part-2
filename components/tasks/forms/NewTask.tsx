import { Autocomplete, Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import useUserStore from "stores/userStore";
import { ICreateTask } from "types/Task.d";
import { IUser } from "types/User.d";
import { IProject } from "../../../types/Project.d";
import { ISubTask } from "../../../types/SubTask.d";
import EditSubTasks from "./EditSubTasks";
import SelectStatus from "./SelectStatus";

/**
 * @author Tom Whitticase
 *
 * @description User interface form to create a new task
 *
 * @param createTask function to create a task
 * @param loadingCreateTask boolean to indicate if the create task request is loading
 *
 * @returns JSX.Element
 */

interface IProps {
  createTask: (newTask: ICreateTask) => void;
  loadingCreateTask: boolean;
}
export default function NewTask({ createTask, loadingCreateTask }: IProps) {
  const { user } = useUserStore();
  const [possibleAssignees, setPossibleAssigness] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const [deadline, setDeadline] = useState<string>("");
  const [deadlineError, setDeadlineError] = useState(false);
  const [manHours, setManHours] = useState<number>(0);
  const [manHoursError, setManHoursError] = useState(false);
  const [project, setProject] = useState<number | null>();
  const [status, setStatus] = useState<
    "to-do" | "in-progress" | "review" | "completed"
  >("to-do");
  const [subTasks, setSubTasks] = useState<ISubTask[]>([]);
  const [assignedUser, setAssignedUser] = useState<string | null>(null);
  const [assignedUserError, setAssignedUserError] = useState(false);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  //fetch projects for the project dropdown and users for the assignee dropdown
  useEffect(() => {
    async function fetchProjects() {
      const response = await axios.post("/api/projects/getProjects", {
        user,
      });
      setProjects(response.data);
    }
    async function fetchUsers() {
      try {
        const response = await axios.get("/api/users/getUsers");
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    if (user) {
      fetchProjects();
      fetchUsers();
    }
  }, [user]);
  //fetch possible assignees for the assignee dropdown
  useEffect(() => {
    setAssignedUser(null);
    if (projects.find((p) => p.id === project)) {
      //set possible assigneees to the users in the project
      setPossibleAssigness(
        projects.find((p) => p.id === project)?.userIds || []
      );
    }
    if (!project) {
      //set possible assignees to all users
      setPossibleAssigness(users.map((u) => u.userId));
    }
  }, [project, users]);

  const handleAddTask = () => {
    //set errors to false
    setTitleError(false);
    setDescriptionError(false);
    setManHoursError(false);
    setDeadlineError(false);
    setAssignedUserError(false);

    if (!title) {
      setTitleError(true);
      return;
    }
    if (!description) {
      setDescriptionError(true);
      return;
    }
    if (manHours <= 0 || manHours > 100) {
      setManHoursError(true);
      return;
    }
    //check if deadline is in the future (or today)
    const now = new Date();
    const deadlineDate = new Date(deadline);
    if (
      !deadline ||
      deadline === "" ||
      deadlineDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)
    ) {
      setDeadlineError(true);
      return;
    }

    if (assignedUser === "" || !assignedUser) {
      console.log("error wdwdw");
      setAssignedUserError(true);
      return;
    }

    if (assignedUser) {
      const newTask: ICreateTask = {
        name: title,
        description: description,
        projectId: project ? project : undefined,
        status: status,
        userId: assignedUser,
        deadline: new Date(deadline),
        manHours: manHours,
        subTasks: subTasks,
      };
      createTask(newTask);
    }
  };

  return (
    <>
      <div className="flex gap-4 mobile-only:flex-col">
        <div className="flex gap-4 flex-col  w-full">
          <TextField
            label="Title"
            error={titleError}
            helperText={titleError ? "Title is required" : ""}
            multiline
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ width: "100%" }}
          />

          <TextField
            label="Description"
            error={descriptionError}
            helperText={descriptionError ? "Description is required" : ""}
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={6}
            sx={{ width: "100%" }}
          />
          <div className="child:flex-1 flex mobile-only:flex-col gap-4">
            <TextField
              label="Deadline"
              error={deadlineError}
              helperText={deadlineError ? "Deadline must be in the future" : ""}
              size="small"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
              }}
            />

            <TextField
              label="Man Hours"
              error={manHoursError}
              helperText={
                manHoursError ? "Man hours must be between 1 and 100" : ""
              }
              size="small"
              type="number"
              value={manHours}
              onChange={(e) => setManHours(parseInt(e.target.value))}
            />
          </div>
          <Autocomplete
            id="combo-box-demo"
            options={possibleAssignees}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              setAssignedUser(newValue ? newValue : "");
            }}
            value={assignedUser}
            renderInput={(params) => (
              <TextField
                {...params}
                error={assignedUserError}
                helperText={assignedUserError ? "Assignee is required" : ""}
                label="Assignee"
                variant="outlined"
              />
            )}
          />

          <Autocomplete
            id="combo-box-demo"
            options={projects.map((project: IProject) => {
              return { name: project.name, id: project.id };
            })}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              setProject(newValue ? newValue.id : null);
              console.log(newValue ? newValue.id : "f");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Project (optional)"
                variant="outlined"
              />
            )}
          />
        </div>
        <div className="flex gap-4 flex-col w-full">
          <SelectStatus status={status} setStatus={setStatus} />

          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "5px",
              height: 300,
              overflowX: "auto",
            }}
          >
            <EditSubTasks subTasks={subTasks} setSubTasks={setSubTasks} />
          </Box>
          <div className="flex justify-end">
            {loadingCreateTask ? (
              <Button variant={"contained"} disabled>
                <ContentLoader className="mr-1" />
                Adding Task...
              </Button>
            ) : (
              <Button variant={"contained"} onClick={handleAddTask}>
                Add Task
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
