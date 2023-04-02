import { Box, LinearProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { ITask } from "../../types/Task.d";
import LoadingPage from "../misc/LoadingPage";
import Task from "./Task";

/**
 * @author Tom Whitticase
 *
 * @description KanbanBoard component
 *
 * @param tasks - Array of tasks
 * @param editTask - Function to edit a task
 * @param loadingEditTask - Boolean to show if edit task is loading
 * @param deleteTask - Function to delete a task
 * @param loadingDeleteTask - Boolean to show if delete task is loading
 *
 * @returns JSX.Element
 */

interface IKanbanBoardProps {
  tasks: ITask[];
  editTask: (task: ITask) => void;
  loadingEditTask: boolean;
  deleteTask: (id: number) => void;
  loadingDeleteTask: boolean;
}
export default function KanbanBoard({
  tasks,
  editTask,
  loadingEditTask,
  deleteTask,
  loadingDeleteTask,
}: IKanbanBoardProps) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  // Function to render a column
  function kanbanColumn(tasks: ITask[], headerColor: string, colTitle: string) {
    return (
      <Box
        sx={{
          display: "flex",
          width: "25%",
          minWidth: 300,
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            backgroundColor: headerColor,
            shadow: 1,
            borderRadius: 1,
            color: "white",
            padding: 1,
          }}
        >
          {colTitle}
        </Typography>
        {tasks.map((task, i) => (
          <Task
            key={i}
            task={task}
            editTask={editTask}
            deleteTask={deleteTask}
            loadingDeleteTask={loadingDeleteTask}
            loadingEditTask={loadingEditTask}
          />
        ))}
      </Box>
    );
  }
  return (
    <>
      {loading ? (
        <LoadingPage variant={"grid"} />
      ) : (
        <>
          <div className="relative w-full h-full overflow-auto pb-20 p-4">
            <ClipLoader
              className="absolute bottom-2 left-2"
              size={40}
              color="#eebe0e"
              loading={loadingDeleteTask || loadingEditTask}
            />
            <Box
              sx={{
                display: "flex",
                minWidth: 1000,
                gap: 2,
              }}
            >
              {kanbanColumn(
                tasks.filter((task) => task.status === "to-do"),
                "#f44336",
                "To-do"
              )}
              {kanbanColumn(
                tasks.filter((task) => task.status === "in-progress"),
                "#2196f3",
                "In-progress"
              )}
              {kanbanColumn(
                tasks.filter((task) => task.status === "review"),
                "#ffc107",
                "Review"
              )}
              {kanbanColumn(
                tasks.filter((task) => task.status === "completed"),
                "#4caf50",
                "Completed"
              )}
            </Box>
          </div>
        </>
      )}
    </>
  );
}
