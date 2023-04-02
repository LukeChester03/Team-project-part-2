import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SubHeader from "components/layout/SubHeader";
import LoadingPage from "components/misc/LoadingPage";
import { useProjects } from "hooks/useProjects";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProjectMembersInput from "components/projects/forms/ProjectMembersInput";
import { ITask } from "types/Task.d";
import KanbanBoard from "components/tasks/KanbanBoard";
import { useTasks } from "hooks/useTasks";
import { IProject } from "types/Project.d";
import AvatarList from "components/user/AvatarList";
// import ProjectUserList from "components/projects/ProjectUserList";

/**
 * @author Luke Chester, Ben Pritchard and Tom Whitticase
 *
 * @description This page displays a project data. accessible to project leader and managers/admins only.
 */

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<IProject>();
  const [projectTasks, setProjectTasks] = useState<ITask[]>([]);

  const {
    tasks,
    editTask,
    loadingEditTask,
    deleteTask,
    loadingDeleteTask,
    createTask,
    loadingCreateTask,
  } = useTasks({ all: true });

  // Get the project data from the hook
  const {
    loading,
    projects,
    editProject,
    loadingEditProject,
    deleteProject,
    loadingDeleteProject,
  } = useProjects(parseInt(id as string));

  //find the project that matches the id in the url
  useEffect(() => {
    setProject(
      projects?.find((project) => project.id === parseInt(id as string))
    );
  }, [id, projects]);

  //filter out any tasks that don't belong to the project
  useEffect(() => {
    if (project) {
      setProjectTasks(
        tasks.filter((task) => task.projectName === project.name)
      );
    }
  }, [tasks, project]);

  //projectTasks is the list of tasks that belong to the project, tasks is the list of all tasks
  //DO NOT USE TASKS IN THE KANBAN BOARD OR ANY OTHER COMPONENTS, USE PROJECTTASKS INSTEAD

  const projectPage = (
    <>
      {projects && !loading && (
        <>
          <SubHeader>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Link href="/projects">
                <IconButton>
                  <ArrowBackIcon />
                </IconButton>
              </Link>
              <Button
                variant={"contained"}
                disabled={loadingDeleteProject}
                onClick={() => deleteProject(parseInt(id as string))}
              >
                {loadingDeleteProject ? "Deleting..." : "Delete Project"}
              </Button>
            </Box>
          </SubHeader>
          <Box className="flex flex-row justify-center mobile-only:flex-col">
            <Card
              elevation={2}
              className="w-full border-t-8 border-amber-500 p-1 mobile-only:w-[90%] "
              sx={{ m: 2 }}
            >
              <CardContent>
                <Typography
                  className="py-3 font-semibold"
                  variant={"h5"}
                  sx={{ marginLeft: 2 }}
                >
                  {project?.name} Information
                </Typography>
                <Divider />
                <Typography
                  className="py-3"
                  variant={"subtitle1"}
                  sx={{ marginLeft: 2 }}
                  gutterBottom
                >
                  {project?.description}
                </Typography>

                <Box className="flex flex-col  gap-8 py-1">
                  <Typography
                    className="flex flex-row justify-start gap-4"
                    variant={"h5"}
                    sx={{ marginLeft: 2 }}
                  >
                    Project leader
                    {project && <AvatarList userIds={[project?.leaderId]} />}
                  </Typography>
                  <Typography
                    variant={"h5"}
                    sx={{ marginLeft: 2 }}
                    className="flex flex-row justify-start gap-4"
                  >
                    Members
                    <Typography className="justify-right">
                      {project && <AvatarList userIds={project?.userIds} />}
                    </Typography>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            {/* <Card
              elevation={2}
              className="w-2/3 border-t-8 border-amber-500 p-1 mobile-only:w-[90%] "
              sx={{ m: 2 }}
            >
              <CardContent>
                <Typography variant={"h5"} sx={{ marginLeft: 2 }} className="">
                  {project?.name} Progress
                </Typography>
                <Divider />
                <Typography
                  variant={"subtitle1"}
                  sx={{ marginLeft: 2 }}
                ></Typography>
                <Typography variant={"h5"} sx={{ marginLeft: 2, m: 2 }}>
                  PROGRESS BAR FOR PROJECT
                </Typography>
                <Box className="flex flex-row justify-between">
                  <Typography>Past due</Typography>
                  <Typography>Due this week</Typography>
                  <Typography>Remaining</Typography>
                </Box>
              </CardContent>
            </Card> */}
          </Box>
          <Typography variant={"h4"} sx={{ marginLeft: 2 }}>
            Tasks
          </Typography>
          <KanbanBoard
            tasks={projectTasks}
            editTask={editTask}
            loadingEditTask={loadingEditTask}
            deleteTask={deleteTask}
            loadingDeleteTask={loadingDeleteTask}
          />
        </>
      )}
    </>
  );
  return (
    <>
      {loading || !project ? <LoadingPage variant={"spinner"} /> : projectPage}
    </>
  );
}
