/* a select dropdown for task status */
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

/**
 * @author Tom Whitticase
 *
 * @description provides ui for changing the status of a task with a dropdown
 *
 * @param status - Status of the task
 * @param setStatus - Function to set the status of the task
 *
 * @returns JSX.Element
 */

interface IProps {
  status: "to-do" | "in-progress" | "review" | "completed";
  setStatus: Dispatch<
    SetStateAction<"to-do" | "in-progress" | "review" | "completed">
  >;
}
export default function SelectStatus({ status, setStatus }: IProps) {
  return (
    <FormControl fullWidth>
      <InputLabel id="status-select-label">Status</InputLabel>
      <Select
        sx={{ padding: 0, margin: 0 }}
        labelId="status-select-label"
        value={status}
        label="Status"
        onChange={(e) => {
          setStatus(
            e.target.value as "to-do" | "in-progress" | "review" | "completed"
          );
        }}
      >
        <MenuItem value={"to-do"}>
          <div className="bg-red-500 w-min text-white rounded text-center px-4 py-1 ">
            To-do
          </div>
        </MenuItem>
        <MenuItem value={"in-progress"}>
          <div className="bg-blue-500 w-min text-white rounded text-center px-4 py-1 ">
            In-progress
          </div>
        </MenuItem>
        <MenuItem value={"review"}>
          <div className="bg-amber-500 w-min text-white rounded text-center px-4 py-1 ">
            Review
          </div>
        </MenuItem>
        <MenuItem value={"completed"}>
          <div className="bg-green-500 w-min text-white rounded text-center px-4 py-1 ">
            Completed
          </div>
        </MenuItem>
      </Select>
    </FormControl>
  );
}
