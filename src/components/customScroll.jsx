import { Colors } from "../config/default";

const ScrollbarStyles = {
  "&::-webkit-scrollbar": {
    width: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#E5E5E5",
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-track": {
    marginTop: ".8rem",
    marginBottom: ".8rem",
    backgroundColor: Colors.WHITE,
    borderRadius: "8px",
  },
};

export default ScrollbarStyles;
