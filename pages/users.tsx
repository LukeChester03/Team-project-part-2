import { Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { IUser } from "../types/User.d";
import UserAvatar from "../components/user/UserAvatar";
import ControlledModal from "components/misc/ControlledModal";
import ManageProfile from "components/profile/ManageProfile";

/**
 * @author Tom Whitticase
 *
 * @description This page displays all users in a table format. It allows admins to edit users details.
 */

const getRoleChip = (role: string) => {
  switch (role) {
    case "admin": {
      return (
        <Chip
          sx={{
            color: "white",
            backgroundColor: "red",
          }}
          label={role}
        />
      );
    }
    case "manager": {
      return (
        <Chip
          sx={{
            color: "white",
            backgroundColor: "orange",
          }}
          label={role}
        />
      );
    }
    case "employee": {
      return (
        <Chip
          sx={{
            color: "white",
            backgroundColor: "green",
          }}
          label={role}
        />
      );
    }
    default: {
      return (
        <Chip
          sx={{
            color: "black",
            backgroundColor: "white",
          }}
          label={role}
        />
      );
    }
  }
};
export default function Users() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch all users
  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await axios.get("/api/users/getUsers");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    setEditUserOpen(false);
    setUserToEdit(null);
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "profileImage",
      headerName: "Image",
      renderCell: (params) => (
        <UserAvatar clickable={false} user={params.row} />
      ),
    },
    { field: "name", headerName: "Name", minWidth: 200 },

    { field: "userId", headerName: "Email Address", minWidth: 250 },

    {
      field: "role",
      headerName: "Role",
      minWidth: 150,
      renderCell: (params) => getRoleChip(params.value),
    },
  ];
  return (
    <>
      <ControlledModal
        open={editUserOpen}
        setOpen={setEditUserOpen}
        title={"Edit User"}
      >
        <>
          {userToEdit && (
            <ManageProfile
              user={userToEdit}
              reloadUserData={() => {
                fetchUsers();
              }}
              loading={loading}
            />
          )}
        </>
      </ControlledModal>
      <div style={{ height: "100%", width: "100%" }}>
        <DataGrid
          getRowId={(row) => row.userId}
          hideFooter
          rows={users}
          columns={columns}
          onRowClick={(row) => {
            setUserToEdit(row.row as IUser);
            setEditUserOpen(true);
          }}
          getRowClassName={(params) => "cursor-pointer"}
        />
      </div>
    </>
  );
}
