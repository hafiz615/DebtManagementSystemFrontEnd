import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import { Colors } from "../../config/default";
import Dropdown from "./../dropdown";

export default function PaymentSettlement({
  newDataList,
  setNewDataList,
  remainingAmount,
  totalAmount,
}) {
  const menuItems = [
    { label: "Custom", value: "Custom" },
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Fortnightly", value: "Fortnightly" },
    { label: "Monthly", value: "Monthly" },
  ];

  const handleAddNewData = () => {
    const newItem = {
      amount: "",
      timePeriod: "Custom", // Default value for time period
      startDate: "",
      frequency: 1,
    };
    setNewDataList([...newDataList, newItem]);
  };

  const handleRemoveNewData = (index) => {
    const updatedList = [...newDataList];
    updatedList.splice(index, 1); // Remove item at the specified index
    setNewDataList(updatedList);
  };

  const handleInputChange = (index, field, value) => {
    const updatedList = [...newDataList];
    if (field === "timePeriod" && value === "Custom") {
      updatedList[index].frequency = 1;
    }
    updatedList[index][field] = value;
    setNewDataList(updatedList);
  };
  const handleNumberInput = (e) => {
    const invalidChars = ["e", "E", ".", "+", "-"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };
  const today = new Date().toISOString().split("T")[0];
  return (
    <>
      <Typography
        sx={{
          fontFamily: "Nunito",
          fontWeight: "600",
        }}
      >
        Settlement Plan Automation
      </Typography>

      <Grid
        container
        item
        sx={{
          marginTop: "1rem",
          alignItems: "center",
        }}
      >
        {newDataList?.map((item, index) => (
          <>
            <Grid
              container
              item
              xs={12}
              md={6}
              lg={3}
              sx={{
                display: "flex",
                justifyContent: { xs: "space-between", md: "center" },
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "500",
                  marginRight: ".5rem",
                  color: Colors.DARK_GRAY,
                }}
              >
                Debt
              </Typography>
              <input
                type="number"
                placeholder="$ Debt Amount"
                value={item?.amount}
                onChange={(e) =>
                  handleInputChange(index, "amount", parseInt(e.target.value))
                }
                onKeyDown={handleNumberInput}
                min="0"
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "60%",
                }}
              />
            </Grid>

            <Grid
              container
              item
              xs={12}
              md={6}
              lg={3}
              sx={{
                display: "flex",
                justifyContent: { xs: "space-between", md: "center" },
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "500",
                  marginRight: ".5rem",
                  color: Colors.DARK_GRAY,
                }}
                gutterBottom
              >
                Time Period
              </Typography>
              <Dropdown
                // placeholder="Choose Time Period"
                initialValue={item?.timePeriod}
                menuItems={menuItems}
                backgroundColor={Colors.BG_LIGHT_GRAY}
                width="60%"
                value={item?.timePeriod}
                onChange={(value) =>
                  handleInputChange(index, "timePeriod", value)
                }
              />
            </Grid>

            <Grid
              container
              item
              xs={12}
              md={6}
              lg={3}
              sx={{
                display: "flex",
                justifyContent: { xs: "space-between", md: "center" },
                alignItems: "center",
                mt: { xs: "0.5rem", md: "0" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "500",
                  marginRight: ".5rem",
                  color: Colors.DARK_GRAY,
                }}
              >
                Date
              </Typography>
              <input
                type="date"
                placeholder="4/1/2024"
                value={item?.startDate}
                onChange={(e) =>
                  handleInputChange(index, "startDate", e.target.value)
                }
                max={today}
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: "60%",
                }}
              />
            </Grid>

            <Grid
              container
              item
              xs={12}
              md={6}
              lg={3}
              sx={{
                display: "flex",
                justifyContent: { xs: "space-between", md: "flex-start" },
                alignItems: "center",
              }}
            >
              {item?.timePeriod !== "Custom" && (
                <>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      marginRight: ".5rem",
                      color: Colors.DARK_GRAY,
                    }}
                  >
                    Frequency
                  </Typography>
                  <input
                    type="text"
                    value={item.frequency}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "frequency",
                        e.target.value ? parseInt(e.target.value) : ""
                      )
                    }
                    style={{
                      backgroundColor: Colors.BG_LIGHT_GRAY,
                      height: "2.5rem",
                      color: Colors.DIM_LIGHT_GRAY,
                      paddingLeft: "1rem",
                      border: "none",
                      outline: "none",
                      borderRadius: "5px",
                      width: "20%",
                      marginRight: "0.5rem",
                    }}
                  />
                </>
              )}

              <AddCircleIcon
                sx={{ color: Colors.SKY_BLUE }}
                onClick={handleAddNewData}
              />
              {index !== 0 && (
                <>
                  <RemoveCircleIcon
                    sx={{ color: Colors.ORANGE_COLOR }}
                    onClick={() => handleRemoveNewData(index)}
                  />
                </>
              )}
            </Grid>
            {index === newDataList?.length - 1 &&
              remainingAmount !== totalAmount && (
                <Typography
                  sx={{ color: "red", marginLeft: "2rem", fontSize: "10px" }}
                >
                  Total debt must be equal to remaining amount
                </Typography>
              )}
          </>
        ))}
      </Grid>
    </>
  );
}
