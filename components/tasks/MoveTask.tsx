import { List, ListItem, ListItemButton } from "@mui/material";

//DELETE THIS
interface IProps {
  status: "to-do" | "in-progress" | "review" | "completed";
  setStatus: any;
}
export default function MoveTask({ status, setStatus }: IProps) {
  return (
    <></>
    // <List>
    //   <ListItem disablePadding>
    //     <ListItemButton
    //       disabled={status === "to-do"}
    //       onClick={() => setStatus("to-do")}
    //     >
    //       <div className="bg-red-500 w-full text-white rounded text-center p-2">
    //         To-do
    //       </div>
    //     </ListItemButton>
    //   </ListItem>
    //   <ListItem disablePadding>
    //     <ListItemButton
    //       disabled={status === "in-progress"}
    //       onClick={() => setStatus("in-progress")}
    //     >
    //       <div className="bg-blue-500 w-full text-white rounded text-center p-2">
    //         In-progress
    //       </div>
    //     </ListItemButton>
    //   </ListItem>
    //   <ListItem disablePadding>
    //     <ListItemButton
    //       disabled={status === "review"}
    //       onClick={() => setStatus("review")}
    //     >
    //       <div className="bg-amber-500 w-full text-white rounded text-center p-2">
    //         Review
    //       </div>
    //     </ListItemButton>
    //   </ListItem>
    //   <ListItem disablePadding>
    //     <ListItemButton
    //       disabled={status === "completed"}
    //       onClick={() => setStatus("completed")}
    //     >
    //       <div className="bg-green-500 w-full text-white rounded text-center p-2">
    //         Completed
    //       </div>
    //     </ListItemButton>
    //   </ListItem>
    // </List>
  );
}
