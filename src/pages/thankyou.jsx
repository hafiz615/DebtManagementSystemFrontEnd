import React, { useState } from "react";
import { Dialog, Typography, Box, Button, Fade } from "@mui/material";
import { VerifiedOutlined } from "@mui/icons-material";
import { Colors } from "../config/default";

export default function Thankyou() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Fade}
      maxWidth="sm"
      fullWidth
      onClose={() => setIsOpen(false)}
      PaperProps={{
        sx: {
          borderRadius: "24px",
          px: { xs: 4, sm: 6 },
          py: { xs: 6, sm: 10 },
          overflowX: "hidden",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)",
          border: "3px solid",
          borderColor: Colors.SKY_BLUE,
        },
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        width="100%"
      >
        <Box
          sx={{
            background: Colors.SKY_BLUE,
            borderRadius: "50%",
            padding: "16px",
            mb: 3,
            boxShadow: `0 0 25px ${Colors.SKY_BLUE}`,
          }}
        >
          <VerifiedOutlined sx={{ fontSize: "5rem", color: "#fff" }} />
        </Box>

        <Typography
          sx={{
            fontFamily: "Nunito",
            fontSize: "2.25rem",
            fontWeight: 700,
            color: "#333",
            mb: 1,
          }}
        >
          Thank You!
        </Typography>

        <Typography
          sx={{
            fontFamily: "Nunito",
            fontSize: "1.125rem",
            fontWeight: 500,
            color: "#666",
            maxWidth: "80%",
            mb: 4,
          }}
        >
          Your payment information has been successfully added.
        </Typography>
      </Box>
    </Dialog>
  );
}
