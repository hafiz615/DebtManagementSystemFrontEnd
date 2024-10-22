import React from "react";
import { Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorIcon from "../assets/Error.png";
import { Colors } from "../config/default";
import TextButton from "./button";
export default function FallBack() {
  const navigate = useNavigate();
  const handleHomeNavigation = () => {
    navigate("/home");
    location.reload();
  };
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.BG_LIGHT_GRAY,
      }}
    >
      <Card
        sx={{
          width: { xs: "70vw", md: "50vw" },
          backgroundColor: Colors.WHITE,
          borderRadius: "16px",
          textAlign: "center",
          padding: "2em",
        }}
      >
        <img
          style={{ marginTop: "2em", height: "10em" }}
          src={ErrorIcon}
          alt="Error"
        />
        <Typography
          sx={{
            fontFamily: "Nunito",
            color: Colors.BLACK,
            fontSize: "2rem",
            mt: "1em",
            mb: "1em",
          }}
        >
          Oops! Something went wrong.
        </Typography>
        <TextButton
          onClick={handleHomeNavigation}
          buttonText="Go to Home"
          variant="contained"
          width="max-content"
          radius="10px"
          fontColor={Colors.WHITE}
          hoverColor={Colors.SKY_BLUE}
          backgroundColor={Colors.SKY_BLUE}
        />
      </Card>
    </div>
  );
}
