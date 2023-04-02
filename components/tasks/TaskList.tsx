import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { ITask } from "../../types/Task.d";
import UserCircle from "../user/UserAvatar";
import ProgressCircle from "../misc/ProgressCircle";
import { ISubTask } from "../../types/SubTask.d";
import LoadingPage from "../misc/LoadingPage";
import ProjectChip from "components/projects/ProjectChip";
import EditTask from "./forms/EditTask";
import EditIcon from "@mui/icons-material/Edit";
import ControlledModal from "components/misc/ControlledModal";

/**
 * @author Tom Whitticase
 *
 * @description TaskList component. Used for displaying a list of tasks in a table
 *
 * @param tasks - Array of tasks
 * @param loadingEditTask - boolean to indicate if the edit task request is loading
 * @param editTask - function to edit a task
 * @param loadingDeleteTask - boolean to indicate if the delete task request is loading
 * @param deleteTask - function to delete a task
 *
 *
 * @returns JSX.Element
 *
 */

interface ITaskListProps {
  tasks: ITask[];
  loadingEditTask: boolean;
  editTask: (task: ITask) => void;
  loadingDeleteTask: boolean;
  deleteTask: (id: number) => void;
}
export default function TaskList({
  tasks,
  loadingEditTask,
  editTask,
  loadingDeleteTask,
  deleteTask,
}: ITaskListProps) {
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const rows: ITask[] = tasks;
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      hide: true,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      width: 250,
      minWidth: 250,
      renderCell: (params) => <div className="mr-1">{params.value}</div>,
    },

    {
      field: "deadline",
      headerName: "Deadline",
      type: "dateTime",
      width: 100,
      renderCell: (params) => {
        return <div>{new Date(params.value).toLocaleDateString()}</div>;
      },
    },
    {
      field: "user",
      headerName: "Assigned to",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center w-full">
            <UserCircle user={params.value} />
          </div>
        );
      },
    },
    {
      field: "manHours",
      headerName: "Man Hours",
      type: "number",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center w-full">
            {params.value}
          </div>
        );
      },
    },
    {
      field: "subTasks",
      headerName: "Sub-tasks",
      type: "string",
      width: 100,
      valueGetter: (params) => {
        // Compute the progress value based on the subtasks
        return getSubTaskProgress(params.value);
      },
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center w-full">
            {
              // show progress circle if there are subtasks
              params.value !== -1 && <ProgressCircle value={params.value} />
            }
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      type: "string",
      renderCell: (params) => {
        switch (params.value) {
          case "to-do": {
            return (
              <div className="flex justify-center items-center w-full">
                <div className="bg-red-500 w-full text-white rounded text-center p-2 m-2">
                  To-do
                </div>
              </div>
            );
          }
          case "in-progress": {
            return (
              <div className="bg-blue-500 w-full text-white rounded text-center p-2 m-2">
                In-progress
              </div>
            );
          }
          case "review": {
            return (
              <div className="bg-amber-500 w-full text-white rounded text-center p-2 m-2">
                Review
              </div>
            );
          }
          case "completed": {
            return (
              <div className="bg-green-500 w-full text-white rounded text-center p-2 m-2">
                Completed
              </div>
            );
          }
        }
      },
      sortComparator: (v1, v2, param1, param2) => {
        if (v1 === "to-do") {
          return -1;
        } else if (v2 === "to-do") {
          return 1;
        } else if (v1 === "in-progress") {
          return -1;
        } else if (v2 === "in-progress") {
          return 1;
        } else if (v1 === "review") {
          return -1;
        } else if (v2 === "review") {
          return 1;
        } else if (v1 === "completed") {
          return -1;
        } else if (v2 === "completed") {
          return 1;
        } else {
          return 0;
        }
      },
    },
    {
      field: "projectName",
      headerName: "Project",
      type: "string",
      width: 200,
      renderCell: (params) => {
        return (
          params.value &&
          params.value !== "" && <ProjectChip projectName={params.value} />
        );
      },
    },
    //this column should be aligned to the right
    {
      field: "edit",
      headerName: "Edit",
      width: 10,
      flex: 0.1,
      renderCell: (params) => (
        <div className="h-full w-full flex items-center justify-center">
          <EditIcon className="cursor-pointer" />
        </div>
      ),
    },
  ];

  const getSubTaskProgress = (subTasks: ISubTask[]) => {
    if (!subTasks) return -1;
    if (subTasks.length < 1) return -1;
    let completedCount = 0;
    for (let i = 0; i < subTasks.length; i++) {
      if (subTasks[i].completed) {
        completedCount++;
      }
    }
    return Math.round((completedCount / subTasks.length) * 100);
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      {loading ? (
        <LoadingPage variant={"table"} />
      ) : (
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            //display edit task on row click
            onRowClick={(params) => {
              const task = params.row as ITask;
              setSelectedTask(task);
              setEditTaskOpen(true);
            }}
            getRowClassName={(params) => {
              return "cursor-pointer";
            }}
            rows={rows}
            columns={columns}
            style={{ border: 0 }}
            hideFooter
          />
          <ControlledModal
            title={"Edit Task"}
            open={editTaskOpen}
            setOpen={setEditTaskOpen}
          >
            <>
              {selectedTask && (
                <EditTask
                  task={selectedTask}
                  loadingEditTask={loadingEditTask}
                  loadingDeleteTask={loadingDeleteTask}
                  deleteTask={deleteTask}
                  editTask={editTask}
                />
              )}
            </>
          </ControlledModal>
        </div>
      )}
    </>
  );
}
