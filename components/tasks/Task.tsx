import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Typography,
  Tooltip,
  Grid,
  LinearProgress,
  Box,
  Checkbox,
  Divider,
} from "@mui/material";
import { ITask } from "../../types/Task.d";
import UserAvatar from "../user/UserAvatar";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ISubTask } from "../../types/SubTask.d";
import Modal from "../misc/Modal";
import EditTask from "./forms/EditTask";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";
import ProjectChip from "components/projects/ProjectChip";
import DoneIcon from "@mui/icons-material/Done";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

/**
 * @author Tom Whitticase
 *
 * @description User interface component to display a task
 *
 * @param task the task to display
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
const getSubTaskProgress = (subTasks: ISubTask[]) => {
  if (subTasks.length < 1) return 100;

  let completedCount = 0;
  for (let i = 0; i < subTasks.length; i++) {
    if (subTasks[i].completed) {
      completedCount++;
    }
  }
  return Math.round((completedCount / subTasks.length) * 100);
};

const getDisplayDate = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString("en-GB");
};

const getDeadlineColor = (deadline: Date): string => {
  const deadlineDate = new Date(deadline);
  const today = new Date();

  if (deadlineDate > today) {
    return "green";
  } else if (deadlineDate.toDateString() === today.toDateString()) {
    return "orange";
  } else {
    return "red";
  }
};

const getDeadlineSubheader = (task: ITask) => {
  return (
    <div style={{ color: getDeadlineColor(task.deadline) }}>
      {"Due " + getDisplayDate(task.deadline)}
    </div>
  );
};

export default function Task({
  task,
  editTask,
  loadingEditTask,
  deleteTask,
  loadingDeleteTask,
}: IProps) {
  const moveLeft = () => {
    interface IMapStatus {
      [key: string]: "to-do" | "in-progress" | "review" | "completed";
    }
    const mapStatus: IMapStatus = {
      completed: "review",
      review: "in-progress",
      "in-progress": "to-do",
    };

    //create a new task with the same values as the current task but with previous status
    const newTask = {
      ...task,
      status: mapStatus[task.status],
    };

    editTask(newTask);
  };
  const moveRight = () => {
    interface IMapStatus {
      [key: string]: "to-do" | "in-progress" | "review" | "completed";
    }
    const mapStatus: IMapStatus = {
      "to-do": "in-progress",
      "in-progress": "review",
      review: "completed",
    };

    //create a new task with the same values as the current task but with next status
    const newTask = {
      ...task,
      status: mapStatus[task.status],
    };

    editTask(newTask);
  };

  const card = (
    <Card className="relative" elevation={2}>
      <Box
        sx={{
          opacity: "0%",
          "&:hover": { opacity: loadingEditTask ? "50%" : "100%" },
        }}
        className="bg-black/40 text-white absolute top-0 right-0 w-full h-full z-[10] flex items-center justify-between"
      >
        {task.status !== "to-do" && (
          <button
            onClick={loadingEditTask ? undefined : moveLeft}
            className="h-full  bg-white/20 p-4 flex items-center justify-center"
          >
            <ArrowBackIosNewIcon />
          </button>
        )}

        <Modal
          title="edit task"
          button={
            <div className="h-full w-full p-4 flex items-center justify-center">
              <EditIcon />
            </div>
          }
        >
          <EditTask
            task={task}
            loadingEditTask={loadingEditTask}
            loadingDeleteTask={loadingDeleteTask}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        </Modal>
        {task.status !== "completed" && (
          <button
            onClick={loadingEditTask ? undefined : moveRight}
            className="h-full bg-white/20 p-4 flex items-center justify-center"
          >
            <ArrowForwardIosIcon />
          </button>
        )}
      </Box>

      <CardHeader
        avatar={<UserAvatar user={task.user} />}
        title={task.name}
        subheader={getDeadlineSubheader(task)}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Chip
          icon={<AccessTimeIcon />}
          label={task.manHours + "mh"}
          variant="outlined"
        />

        {task.projectName && <ProjectChip projectName={task.projectName} />}
      </CardActions>

      {task.subTasks.length > 0 && (
        <div className="flex gap-2 items-center justify-venter px-2">
          <Grid spacing={1} container>
            <Grid xs item>
              <LinearProgress
                color="success"
                value={getSubTaskProgress(task.subTasks)}
                variant="determinate"
                title="test"
              />
            </Grid>
          </Grid>
          <div>{getSubTaskProgress(task.subTasks) + "%"}</div>
        </div>
      )}
      {task.subTasks.map((subTask, i) => (
        <>
          <div key={i} className="w-full px-4 flex justify-left items-center">
            <Checkbox color={"success"} checked={subTask.completed} />
            {subTask.name}
          </div>
          {/* <Divider /> */}
        </>
      ))}
    </Card>
  );

  return card;
}
