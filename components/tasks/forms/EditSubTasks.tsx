/* a component that is basically a to-do list. used for dislaying and editing a task's subtasks*/
import {
  Checkbox,
  Fab,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { ISubTask } from "../../../types/SubTask.d";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * @author Tom Whitticase
 *
 * @description Used for dislaying and editing a task's subtasks
 *
 * @param subTasks the subtasks to display
 * @param setSubTasks function to set the subtasks
 *
 * @returns JSX.Element
 */

interface IProps {
  subTasks: ISubTask[];
  setSubTasks: Dispatch<SetStateAction<ISubTask[]>>;
}
export default function EditSubTasks({ subTasks, setSubTasks }: IProps) {
  const [invalidNewSubTaskName, setInvalidNewSubTaskName] = useState(false);
  const [newSubTaskName, setNewSubTaskName] = useState("");
  const toggleComplete = (id: number) => {
    const updatedSubTasks = subTasks.map((subTask) => {
      if (subTask.id === id) {
        return {
          ...subTask,
          completed: !subTask.completed,
        };
      }
      return subTask;
    });
    setSubTasks(updatedSubTasks);
  };
  const newSubTask = () => {
    //check if new subtask name is valid
    if (newSubTaskName === "") {
      setInvalidNewSubTaskName(true);
      return;
    }
    setInvalidNewSubTaskName(false);
    // add new subtask using the value from the textfield
    setNewSubTaskName("");
    setSubTasks([
      ...subTasks,
      {
        id: getNewSubTaskId(subTasks),
        name: newSubTaskName,
        completed: false,
      },
    ]);
  };
  const deleteSubTask = (id: number) => {
    // delete subtask with given id
    const updatedSubTasks = subTasks.filter((subTask) => subTask.id !== id);
    setSubTasks(updatedSubTasks);
  };
  const SubTaskButton = ({ subTask }: { subTask: ISubTask }) => {
    return (
      <>
        <ListItemButton
          disableGutters
          onClick={() => toggleComplete(subTask.id)}
        >
          <ListItemIcon>
            <Checkbox color={"success"} checked={subTask.completed} />
          </ListItemIcon>
          <ListItemText primary={subTask.name} />
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              deleteSubTask(subTask.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemButton>
      </>
    );
  };
  return (
    <>
      <div>
        <div className="flex p-2 gap-2">
          <TextField
            value={newSubTaskName}
            error={invalidNewSubTaskName}
            helperText={invalidNewSubTaskName ? "Enter a new sub task" : ""}
            size="small"
            variant={"standard"}
            sx={{ flex: 1 }}
            label="New Sub-task"
            onChange={(e) => setNewSubTaskName(e.target.value)}
          />
          <Fab size="small" color="primary" onClick={newSubTask}>
            <AddIcon />
          </Fab>
        </div>
        {subTasks &&
          subTasks.map((subTask) => (
            <SubTaskButton key={subTask.id} subTask={subTask} />
          ))}
      </div>
    </>
  );
}
function getNewSubTaskId(subTasks: ISubTask[]) {
  let newId = 1;
  while (subTasks.some((subTask) => Number(subTask.id) === newId)) {
    newId++;
  }
  return newId;
}
