import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { IProject } from "../../types/Project.d";
import LoadingPage from "../misc/LoadingPage";
import AvatarList from "components/user/AvatarList";
import { useRouter } from "next/router";
import ProjectChip from "./ProjectChip";

/**
 * @author Ben Pritchard
 *
 * @description Creates a list of projects to be displayed in a table
 */

interface IProjectListProps {
  projects: IProject[];
}
export default function ProjectList({ projects }: IProjectListProps) {
  const router = useRouter();
  const openProject = (id: number) => {
    router.push(`/projects/${id}`);
  };

  const rows: IProject[] = projects;
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, hide: true },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => {
        return <ProjectChip projectName={params.value} />;
      },
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "leaderId",
      headerName: "Leader",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return <AvatarList userIds={[params.value]} />;
      },
    },
    {
      field: "userIds",
      headerName: "Assigned Users",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return <AvatarList userIds={params.value} />;
      },
    },
  ];

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      {loading ? (
        <LoadingPage variant="table" />
      ) : (
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            sx={{ border: "none" }}
            rows={rows}
            columns={columns}
            pageSize={10}
            getRowClassName={(params) => {
              return "cursor-pointer";
            }}
            onRowClick={(getRowIdFromRowModel) => {
              openProject(getRowIdFromRowModel.row.id);
            }}
          />
        </div>
      )}
    </>
  );
}
