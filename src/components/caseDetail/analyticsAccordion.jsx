import { Typography, Grid, CircularProgress, Paper, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Colors } from "../../config/default"; // your custom color config

export default function AnalyticsPanel({ loading, paymentDetails }) {
  const analyticsData = [
    {
      name: "Successful Authorizations",
      value: paymentDetails?.successAuthorizations || 0,
      icon: <CheckCircleIcon sx={{ color: Colors.SKY_BLUE, fontSize: 30 }} />,
      color: "#E8F4FD",
    },
    {
      name: "Successful Captures",
      value: paymentDetails?.successCaptures || 0,
      icon: <CheckCircleIcon sx={{ color: Colors.SKY_BLUE, fontSize: 30 }} />,
      color: "#E8F4FD",
    },
    {
      name: "Successful Payments",
      value: paymentDetails?.successPayments || 0,
      icon: <CheckCircleIcon sx={{ color: Colors.SKY_BLUE, fontSize: 30 }} />,
      color: "#E8F4FD",
    },
    {
      name: "Failed Authorizations",
      value: paymentDetails?.failedAuthorizations || 0,
      icon: <CancelIcon sx={{ color: Colors.ORANGE_COLOR, fontSize: 30 }} />,
      color: "#FFE8E8",
    },
    {
      name: "Failed Captures",
      value: paymentDetails?.failedCaptures || 0,
      icon: <CancelIcon sx={{ color: Colors.ORANGE_COLOR, fontSize: 30 }} />,
      color: "#FFE8E8",
    },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        backgroundColor: Colors.WHITE,
        mb: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Nunito",
          fontWeight: "700",
          color: Colors.SKY_BLUE,
          mb: 3,
        }}
      >
        Analytics Overview
      </Typography>

      {loading ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: "150px" }}
        >
          <CircularProgress size={50} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {analyticsData?.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  backgroundColor: item.color,
                  borderRadius: "12px",
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
              >
                {item?.icon}
                <Box ml={2}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "Nunito",
                      fontWeight: 600,
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    {item?.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: Colors.BLACK,
                      fontFamily: "Nunito",
                      mt: "2px",
                    }}
                  >
                    {item?.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}
