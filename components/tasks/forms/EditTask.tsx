import { Button, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { ISubTask } from "../../../types/SubTask.d";
import { ITask } from "../../../types/Task.d";
import EditSubTasks from "./EditSubTasks";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import SelectStatus from "./SelectStatus";
import ConfirmModal from "components/misc/ConfirmModal";
import UserAvatar from "components/user/UserAvatar";
import ContentLoader from "react-content-loader";

/**
 * @author Tom Whitticase
 *
 * @description User interface form to edit a task
 *
 * @param task the task to edit
 * @param editTask function to edit a task
 * @param loadingEditTask boolean to indicate if the edit task request is loading
 * @param deleteTask function to delete a task
 * @param loadingDeleteTask boolean to indicate if the delete task request is loading
 *
 * @returns JSX.Element
 */

interface IProps {
  task: ITask;
  editTask: (task: ITask) => void;
  loadingEditTask: boolean;
  deleteTask: (id: number) => void;
  loadingDeleteTask: boolean;
}
export default function EditTask({
  task,
  editTask,
  loadingEditTask,
  deleteTask,
  loadingDeleteTask,
}: IProps) {
  const [title, setTitle] = useState(task.name as string);
  const [titleError, setTitleError] = useState(false);
  const [description, setDescription] = useState(task.description as string);
  const [descriptionError, setDescriptionError] = useState(false);
  const [deadline, setDeadline] = useState(
    new Date(task.deadline).toISOString().substring(0, 10)
  );
  const [deadlineError, setDeadlineError] = useState(false);
  const [manHours, setManHours] = useState<number>(task.manHours);
  const [manHoursError, setManHoursError] = useState(false);
  const [status, setStatus] = useState<
    "to-do" | "in-progress" | "review" | "completed"
  >(task.status);
  const [subTasks, setSubTasks] = useState<ISubTask[]>(task.subTasks);

  function getNewTask(): ITask | void {
    if (title === "") {
      setTitleError(true);
      return;
    }
    if (description === "") {
      setDescriptionError(true);
      return;
    }

    if (manHours < 0 || manHours > 100) {
      setManHoursError(true);
      return;
    }

    try {
      const newTask: ITask = {
        id: task.id,
        name: title,
        projectName: task.projectName,
        description: description,
        deadline: new Date(deadline),
        manHours: manHours,
        status: status,
        subTasks: subTasks,
        user: task.user,
        archived: task.archived,
      };
      return newTask;
    } catch {
      console.log("Error converting values to make new task");
    }
  }

  return (
    <>
      <div className="flex gap-4 mobile-only:flex-col">
        <div className="flex gap-4 flex-col  w-full">
          <table>
            {task.projectName && (
              <tr>
                <td>
                  <Typography>Project</Typography>
                </td>
                <td>
                  <Typography>{task.projectName}</Typography>
                </td>
              </tr>
            )}
            <tr>
              <td>
                <Typography>Assigned to</Typography>
              </td>
              <td>
                <Typography>
                  <UserAvatar user={task.user} />
                </Typography>
              </td>
            </tr>
          </table>

          <TextField
            label="Title"
            size="small"
            value={title}
            error={titleError}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ width: "100%" }}
          />

          <TextField
            label="Description"
            size="small"
            value={description}
            error={descriptionError}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={6}
            sx={{ width: "100%" }}
          />
          <div className="child:flex-1 flex mobile-only:flex-col gap-4">
            <TextField
              label="Deadline"
              size="small"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={deadline}
              error={deadlineError}
              onChange={(e) => {
                setDeadline(e.target.value);
              }}
            />

            <TextField
              label="Man Hours"
              size="small"
              type="number"
              error={manHoursError}
              value={manHours}
              onChange={(e) => setManHours(parseInt(e.target.value))}
            />
          </div>
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
          <div className="flex justify-end gap-4 flex-wrap">
            <ConfirmModal
              button={
                <Button
                  disabled={loadingDeleteTask}
                  variant={"outlined"}
                  startIcon={<DeleteIcon />}
                  sx={{ width: "8rem" }}
                >
                  {loadingDeleteTask ? "Deleting..." : "Delete"}
                </Button>
              }
              message={"Are you sure you want to delete this task?"}
              action={() => deleteTask(task.id)}
            />

            <Button
              variant={"contained"}
              onClick={() => {
                const newTask = getNewTask();
                if (newTask) editTask(newTask);
              }}
              startIcon={<SaveIcon />}
              disabled={loadingEditTask}
              sx={{ width: "8rem" }}
            >
              {loadingEditTask ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
