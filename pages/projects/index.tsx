import { Box, Card, Fab, Typography } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import LoadingPage from "../../components/misc/LoadingPage";
import { useRouter } from "next/router";
import NewProject from "components/projects/forms/NewProject";
import { useProjects } from "hooks/useProjects";
import ProjectList from "components/projects/ProjectList";
import { useEffect, useState } from "react";
import ControlledModal from "components/misc/ControlledModal";
import useUserStore from "stores/userStore";
import SubHeader from "components/layout/SubHeader";

/**
 * @author Tom Whitticase and Ben Pritchard
 *
 * @description This page displays a list of projects being managed by the user. When a project is selected it will redirect to the project page.
 *
 */

export default function Projects() {
  const { user } = useUserStore();

  const { loading, projects, createProject, loadingCreateProject } =
    useProjects();

  //modal state for new project
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  //close new project modal when project is created
  useEffect(() => {
    setNewProjectOpen(false);
  }, [loadingCreateProject]);

  // Router hook for redirecting to a project page
  const router = useRouter();
  const openProject = (id: number) => {
    router.push(`/projects/${id}`);
  };

  return (
    <>
      <SubHeader>
        <Typography variant="h6">Project Management Dashboard</Typography>
      </SubHeader>
      {user && (user.role === "admin" || user.role === "manager") && (
        <ControlledModal
          open={newProjectOpen}
          setOpen={setNewProjectOpen}
          title="new project"
          button={
            <div className="z-[100] fixed bottom-12 mobile-only:bottom-20 mobile-only:left-8 desktop-only:right-8">
              <Fab color="primary" aria-label="add" variant={"extended"}>
                New Project <PlaylistAddIcon sx={{ marginLeft: 1 }} />
              </Fab>
            </div>
          }
        >
          <>
            <NewProject
              loadingCreateProject={loadingCreateProject}
              createProject={createProject}
            />
          </>
        </ControlledModal>
      )}

      {loading ? (
        <LoadingPage variant={"table"} />
      ) : (
        projects && (
          <div className="w-full h-full">
            <Card elevation={0} className="w-full h-full">
              <Box sx={{ width: "100%", height: "100%" }}>
                <ProjectList projects={projects} />
              </Box>
            </Card>
          </div>
        )
      )}
    </>
  );
}

// add table, new page for displaying project details
// <pre>{JSON.stringify(tasks, undefined, 2)}</pre>
