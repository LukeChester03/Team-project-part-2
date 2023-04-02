import { Autocomplete, Button, FormHelperText, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import ClipLoader from "react-spinners/ClipLoader";
import useUserStore from "stores/userStore";
import { ICreateProject } from "types/Project.d";
import { IUser } from "types/User.d";
import ProjectMembersInput from "./ProjectMembersInput";

/**
 * @author Tom Whitticase and Luke Chester
 *
 * @description This component provides the UI for creating a new project.
 */

interface IProps {
  createProject: (project: ICreateProject) => void;
  loadingCreateProject: boolean;
}
export default function NewProject({
  createProject,
  loadingCreateProject,
}: IProps) {
  const { user: currentUser } = useUserStore();
  const [users, setUsers] = useState<IUser[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(true);

  async function getUsers() {
    try {
      const response = await axios.get("/api/users/getUsers");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoadingUsers(false);
  }
  useEffect(() => {
    getUsers();
  }, []);

  //Textfield entries
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectLeader, setProjectLeader] = useState<IUser | null>();
  const [assignedUsers, setAssignedUsers] = useState<IUser[]>([]);

  //validation use states
  const [titleError, setTitleError] = useState("");
  const [titleErrorStatus, setTitleErrorStatus] = useState(false);
  const [descError, setDescError] = useState("");
  const [descErrorStatus, setDescErrorStatus] = useState(false);
  const [assignedUsersError, setAssignedUsersError] = useState("");
  const [assignedUsersErrorStatus, setAssignedUsersErrorStatus] =
    useState(false);
  const [projectLeaderError, setProjectLeaderError] = useState("");
  const [projectLeaderErrorStatus, setProjectLeaderErrorStatus] =
    useState(false);

  const handleAddProject = () => {
    //reset errors
    setTitleErrorStatus(false);
    setDescErrorStatus(false);
    setDescError("");
    setTitleError("");
    setAssignedUsersError("");
    setAssignedUsersErrorStatus(false);
    setProjectLeaderError("");
    setProjectLeaderErrorStatus(false);

    if (title === "") {
      setTitleErrorStatus(true);
      setTitleError("Please enter a project title");
      return;
    }
    if (!title || title.length > 50) {
      setTitleErrorStatus(true);
      setTitleError("Project Title too long");
      return;
    }
    if (description === "") {
      setDescErrorStatus(true);
      setDescError("Please enter a description");
      return;
    }
    if (!description || description.length > 150) {
      setDescErrorStatus(true);
      setDescError("Description too long, 150 char max");
      return;
    }
    if (!projectLeader) {
      setProjectLeaderErrorStatus(true);
      setProjectLeaderError("Please select a project leader");
      return;
    }
    if (assignedUsers.length === 0) {
      setAssignedUsersErrorStatus(true);
      setAssignedUsersError("Please select at least one user");
      return;
    }

    if (title && description && projectLeader && assignedUsers) {
      const newProject: ICreateProject = {
        name: title,
        description,
        leaderId: projectLeader.userId,
        userIds: assignedUsers.map((user) => user.userId),
      };
      createProject(newProject);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 mobile-only:w-[14rem] h-full desktop-only:w-[25rem] min-h-[25rem]">
        {loadingUsers ? (
          <div className="w-full h-[25rem] flex items-center justify-center">
            <ClipLoader color={"#FFC107"} loading={loadingUsers} size={40} />
          </div>
        ) : (
          <>
            {" "}
            <div>
              <TextField
                label="Title"
                error={titleErrorStatus}
                multiline
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ width: "100%" }}
              />
              <FormHelperText className="text-left" error>
                {titleError}
              </FormHelperText>
            </div>
            <div>
              <TextField
                label="Description"
                size="small"
                error={descErrorStatus}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={6}
                sx={{ width: "100%" }}
              />
              <FormHelperText className="text-left" error>
                {descError}
              </FormHelperText>
            </div>
            <div>
              <Autocomplete
                size={"small"}
                options={users}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={projectLeaderErrorStatus}
                    label="Leader"
                    variant="outlined"
                  />
                )}
                value={projectLeader}
                onChange={(event, newValue) => setProjectLeader(newValue)}
              />
              <FormHelperText className="text-left" error>
                {projectLeaderError}
              </FormHelperText>
            </div>
            <div>
              <ProjectMembersInput
                options={users}
                error={assignedUsersErrorStatus}
                selectedOptions={assignedUsers}
                setSelectedOptions={setAssignedUsers}
              />
              <FormHelperText error>{assignedUsersError}</FormHelperText>
            </div>
            <div className="flex justify-end">
              {loadingCreateProject ? (
                <Button variant={"contained"} disabled>
                  <ContentLoader className="mr-1" />
                  Adding Task...
                </Button>
              ) : (
                <Button variant={"contained"} onClick={handleAddProject}>
                  Add Project
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
