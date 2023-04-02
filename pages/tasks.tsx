import Head from "next/head";
import React, { useEffect, useState } from "react";
import { ITask } from "../types/Task.d";
import KanbanBoard from "../components/tasks/KanbanBoard";
import SubHeader from "../components/layout/SubHeader";
import TaskList from "../components/tasks/TaskList";
import {
  Box,
  Fab,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import TaskFilter from "../components/tasks/TaskFilter";
import LoadingPage from "../components/misc/LoadingPage";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import TableRowsIcon from "@mui/icons-material/TableRows";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTasks } from "hooks/useTasks";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import NewTask from "components/tasks/forms/NewTask";
import ControlledModal from "components/misc/ControlledModal";
import useUserStore from "stores/userStore";

/**
 * @author Tom Whitticase
 *
 * @description This page displays all tasks in a kanban board or table format.
 */

export default function Tasks() {
  const { user } = useUserStore();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState({ project: "", userId: "" });
  const [activeTab, setActiveTab] = useState("board");
  const {
    loading,
    tasks,
    editTask,
    loadingEditTask,
    createTask,
    loadingCreateTask,
    deleteTask,
    loadingDeleteTask,
  } = useTasks({
    all: user?.role === "admin" || user?.role === "manager",
    belongingToMyProjects: true,
  });

  const [filteredTasks, setFilteredTasks] = useState<undefined | ITask[]>();

  //new task modal state
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  //close new task modal when task is created
  useEffect(() => {
    setNewTaskOpen(false);
  }, [loadingCreateTask]);

  //filter tasks
  useEffect(() => {
    let filtered = tasks;
    if (filter) {
      filtered =
        tasks &&
        tasks.filter(
          (task) =>
            (!filter.project || task.projectName === filter.project) &&
            (!filter.userId || task.user.userId === filter.userId)
        );
    }
    setFilteredTasks(filtered || []);
  }, [filter, tasks]);

  const displayTasks = () => {
    if (loading) {
      return <LoadingPage variant={"grid"} />;
    } else if (filteredTasks) {
      switch (activeTab) {
        case "board":
          return (
            <KanbanBoard
              loadingDeleteTask={loadingDeleteTask}
              editTask={editTask}
              loadingEditTask={loadingEditTask}
              deleteTask={deleteTask}
              tasks={filteredTasks}
            />
          );
        case "list":
          return (
            <TaskList
              tasks={filteredTasks}
              loadingEditTask={loadingEditTask}
              editTask={editTask}
              deleteTask={deleteTask}
              loadingDeleteTask={loadingDeleteTask}
            />
          );
        default:
          return null;
      }
    }
  };

  return (
    <>
      <Head>
        <title>Make-it-All | Tasks</title>
      </Head>
      <div className="flex h-full flex-col w-full">
        <SubHeader>
          <div className="flex justify-between w-full h-full items-center">
            <div className="flex gap-4">
              <ToggleButtonGroup
                sx={{ height: 32 }}
                color="primary"
                value={activeTab}
                exclusive
                onChange={(
                  event: React.MouseEvent<HTMLElement>,
                  value: string
                ) => {
                  if (value) {
                    setActiveTab(value);
                  }
                }}
                aria-label="Platform"
              >
                <ToggleButton value="board">
                  <Tooltip title={"Kanban board"}>
                    <ViewKanbanIcon />
                  </Tooltip>
                </ToggleButton>

                <ToggleButton value="list">
                  <Tooltip title={"Table"}>
                    <TableRowsIcon />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <ToggleButton
              sx={{ height: 32, display: "flex", gap: 1 }}
              value="check"
              selected={filterOpen}
              onChange={() => {
                setFilterOpen(!filterOpen);
                setFilter({ project: "", userId: "" });
              }}
            >
              <FilterListIcon />
              Filter
            </ToggleButton>
            <ControlledModal
              open={newTaskOpen}
              setOpen={setNewTaskOpen}
              title="new task"
              button={
                <div className="z-[100] fixed bottom-8 mobile-only:bottom-20 right-8">
                  <Fab color="primary" aria-label="add" variant={"extended"}>
                    New Task <PlaylistAddIcon sx={{ marginLeft: 1 }} />
                  </Fab>
                </div>
              }
            >
              <NewTask
                loadingCreateTask={loadingCreateTask}
                createTask={createTask}
              />
            </ControlledModal>
          </div>
        </SubHeader>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",

            flexGrow: 1,
          }}
        >
          {filterOpen && <TaskFilter tasks={tasks} setFilter={setFilter} />}
          {displayTasks()}
        </Box>
      </div>
    </>
  );
}
