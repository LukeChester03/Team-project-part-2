import { Chip } from "@mui/material";
import generateColour from "utils/generateColour";
import { FaProjectDiagram } from "react-icons/fa";

/**
 * @author Tom Whitticase
 *
 * @description project chip component. used to display project name and colour tag
 *
 * @param {string} projectName - project name used to generate colour tag and display name
 *
 * @returns JSX.Element
 */

interface IProps {
  projectName: string;
}
export default function ProjectChip({ projectName }: IProps) {
  return (
    <Chip
      sx={{
        backgroundColor: generateColour(projectName as string),
        color: "white",
      }}
      label={projectName}
      variant="filled"
      icon={<FaProjectDiagram color="white" />}
    />
  );
}
