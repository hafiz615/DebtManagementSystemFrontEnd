import React, { useEffect, useState } from "react";
import { useToast } from "./toastContext";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import "./customToaster.css";
import { IconButton } from "@mui/material";
import { Colors } from "../config/default";

const CustomToaster = () => {
  const { toast, hideToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let timer;
    if (toast && !isHovered) {
      timer = setTimeout(() => {
        hideToast();
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [toast, hideToast, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (!toast) {
    return null;
  }

  const toastClass = toast.variant;

  const handleRemove = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`custom-toaster ${toastClass}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`custom-toaster-content ${toastClass}`}>
        {toastClass === "error" && (
          <ErrorOutlineIcon sx={{ color: "#ffff", fontSize: "1.35em" }} />
        )}
        {toastClass === "success" && (
          <CheckIcon sx={{ color: "#ffff", fontSize: "1.25em" }} />
        )}
      </div>

      <span className="custom-toaster-message">{toast.message}</span>
      <IconButton
        onClick={() => {
          hideToast();
          handleRemove();
        }}
        sx={{
          position: "absolute",
          right: 0,
          transform: "translate(1.8em,0px)",
          cursor: "pointer",
        }}
      >
        <CloseIcon sx={{ color: Colors.WHITE, fontSize: "1em" }} />
      </IconButton>
    </div>
  );
};

export default CustomToaster;
