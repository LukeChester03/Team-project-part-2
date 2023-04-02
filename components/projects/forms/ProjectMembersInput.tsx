import {
  Autocomplete,
  Box,
  Chip,
  Fab,
  FormHelperText,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { IUser } from "types/User.d";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import UserAvatar from "components/user/UserAvatar";

/**
 * @author Tom Whitticase
 *
 * @description Provides UI for adding users to a project.
 */

interface IProps {
  options: IUser[];
  selectedOptions: IUser[];
  setSelectedOptions: any;
  error?: boolean;
}
export default function ProjectMembersInput({
  options,
  selectedOptions,
  setSelectedOptions,
  error = false,
}: IProps) {
  const [autocompleteValue, setAutocompleteValue] = useState<IUser | null>(
    null
  );
  const addValue = (newValue: IUser | null) => {
    if (
      newValue &&
      !selectedOptions.find((user) => user.userId === newValue.userId)
    ) {
      setSelectedOptions([...selectedOptions, newValue]);
    }
    setAutocompleteValue(null);
  };

  const removeUser = (email: string) => {
    const newSelectedOptions = selectedOptions.filter(
      (user) => user.userId !== email
    );
    setSelectedOptions(newSelectedOptions);
  };
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: "5px",
        padding: 1,
        display: "flex",
        gap: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Autocomplete
          size={"small"}
          options={options.filter(
            (user) =>
              !selectedOptions.find(
                (selectedUser) => selectedUser.userId === user.userId
              )
          )}
          value={autocompleteValue}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                sx={{ minWidth: 140 }}
                {...params}
                label="Assigned to"
                variant="standard"
                error={error}
              />

              <Fab
                sx={{ width: 50 }}
                size={"small"}
                color={"primary"}
                onClick={() => addValue(autocompleteValue)}
              >
                <AddIcon />
              </Fab>
            </Box>
          )}
          onChange={(event, newValue) => setAutocompleteValue(newValue)}
          onBlur={() => setAutocompleteValue(null)}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
          gap: 1,
        }}
      >
        {selectedOptions.map((user, i) => (
          <Chip
            avatar={<UserAvatar user={user} />}
            key={i}
            label={user.name}
            onDelete={() => removeUser(user.userId)}
          />
        ))}
        {selectedOptions.length === 0 && (
          <Typography>No users added</Typography>
        )}
      </Box>
    </Box>
  );
}
