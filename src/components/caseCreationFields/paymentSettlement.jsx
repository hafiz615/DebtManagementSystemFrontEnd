import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import { Colors } from "../../config/default";
import Dropdown from "./../dropdown";
import AmountTextField from "../amountTextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import Hidden from "@mui/material/Hidden";

export default function PaymentSettlement({
  newDataList,
  setNewDataList,
  remainingAmount,
  totalAmount,
  isExempt,
}) {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:1240px)");
  const menuItems = [
    { label: "Custom", value: "Custom" },
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Fortnightly", value: "Fortnightly" },
    { label: "Monthly", value: "Monthly" },
  ];

  const calculateStartDate = (prevItem, timePeriod, frequency) => {
    if (!prevItem) return new Date().toISOString().split("T")[0]; // If no previous item, return today's date

    const prevDate = new Date(prevItem.startDate);
    let multiplier;

    switch (timePeriod) {
      case "Custom":
        multiplier = 1;
        break;
      case "Daily":
        multiplier = 1;
        break;
      case "Weekly":
        multiplier = 7;
        break;
      case "Fortnightly":
        multiplier = 14;
        break;
      case "Monthly":
        multiplier = 30;
        break;
      default:
        multiplier = 0;
    }

    const newDate = new Date(prevDate);
    newDate.setDate(newDate.getDate() + multiplier * (frequency || 1));
    return newDate.toISOString().split("T")[0];
  };
  const handleAddNewData = () => {
    const lastItem = newDataList[newDataList.length - 1];
    const newItem = {
      amount: "",
      timePeriod: "Custom", // Use previous item's timePeriod if available
      startDate: calculateStartDate(
        lastItem,
        lastItem?.timePeriod || "Custom",
        lastItem?.frequency || 1
      ),
      frequency: 1,
    };
    setNewDataList([...newDataList, newItem]);
  };

  const handleRemoveNewData = (index) => {
    const updatedList = [...newDataList];

    if (index < updatedList?.length - 1) {
      const removedStartDate = updatedList[index].startDate;
      updatedList[index + 1].startDate = removedStartDate;
    }
    updatedList.splice(index, 1);
    setNewDataList(updatedList);
  };

  const [isInteracted, setIsInteracted] = useState(false);

  const handleInputChange = (index, field, value) => {
    setIsInteracted(true);
    const updatedList = [...newDataList];
    updatedList[index][field] = value;

    for (let i = index; i < updatedList?.length - 1; i++) {
      updatedList[i + 1].startDate = calculateStartDate(
        updatedList[i],
        updatedList[i]?.timePeriod,
        updatedList[i]?.frequency
      );
    }

    setNewDataList(updatedList);
  };

  const handleNumberInput = (e) => {
    const invalidChars = ["e", "E", ".", "+", "-"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  // Calculate the first day of the current month
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

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
        }}
      >
        {newDataList?.map((item, index) => (
          <React.Fragment key={index}>
            <Grid
              container
              item
              xs={12}
              md={3}
              // lg={3}
              sx={{
                display: "flex",
                justifyContent: { xs: "space-between", md: "center" },
                alignItems: "center",
                mt: { xs: "0.5rem", md: ".5rem" },
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

              <AmountTextField
                width={smallScreen ? "100%" : "10rem"}
                value={item?.amount}
                onChange={(e) =>
                  handleInputChange(index, "amount", parseFloat(e.target.value))
                }
                onKeyDown={handleNumberInput}
              />
              {!isExempt && (
                <Hidden smUp>
                  {index === newDataList?.length - 1 &&
                    isInteracted &&
                    parseInt(remainingAmount) !== parseInt(totalAmount) && (
                      <Typography
                        sx={{
                          color: "red",
                          marginLeft: smallScreen ? "0rem" : "2rem",
                          fontSize: "10px",
                        }}
                      >
                        Total debt must be equal to remaining amount
                      </Typography>
                    )}
                </Hidden>
              )}
            </Grid>

            <Grid
              container
              item
              xs={12}
              md={3}
              // lg={3}
              sx={{
                display: "flex",
                justifyContent: { xs: "space-between", md: "center" },
                alignItems: "center",
                mt: { xs: "0.5rem", md: ".5rem" },
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
                Time Period
              </Typography>
              <Dropdown
                // placeholder="Choose Time Period"
                menuWidth="10rem"
                initialValue={item?.timePeriod}
                menuItems={menuItems}
                backgroundColor={Colors.BG_LIGHT_GRAY}
                width={smallScreen ? "100%" : "7rem"}
                height="2.5rem"
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
              md={3}
              // lg={3}
              sx={{
                display: "flex",
                justifyContent: { xs: "space-between", md: "center" },
                alignItems: "center",
                mt: { xs: "0.5rem", md: ".5rem" },
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
                min={minDate} // Set min date to the first day of the current month
                // max={today} // Set max date to today
                style={{
                  backgroundColor: Colors.BG_LIGHT_GRAY,
                  height: "2.5rem",
                  color: Colors.DIM_LIGHT_GRAY,
                  paddingLeft: "1rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  width: smallScreen ? "100%" : "10rem",
                }}
              />
            </Grid>

            <Grid
              container
              item
              xs={12}
              md={3}
              // lg={3}
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
                      width: "3rem",
                      marginRight: "0.5rem",
                    }}
                  />
                </>
              )}

              <AddCircleIcon
                sx={{ color: Colors.SKY_BLUE }}
                onClick={handleAddNewData}
              />
              {newDataList?.length > 1 && (
                <>
                  <RemoveCircleIcon
                    sx={{ color: Colors.ORANGE_COLOR }}
                    onClick={() => handleRemoveNewData(index)}
                  />
                </>
              )}
            </Grid>
            {!isExempt && (
              <Hidden smDown>
                {index === newDataList?.length - 1 &&
                  isInteracted &&
                  parseInt(remainingAmount) !== parseInt(totalAmount) && (
                    <Typography
                      sx={{
                        color: "red",
                        marginLeft: smallScreen ? "0rem" : "2rem",
                        fontSize: "10px",
                        width: "100%",
                      }}
                    >
                      Total debt must be equal to remaining amount
                    </Typography>
                  )}
              </Hidden>
            )}

            {/* <Grid xs={12} sx={{ mt: "1rem" }}>
              <TextButton
                buttonText="Exempt amount difference"
                height="2rem"
                width="16rem"
                // onClick={handleExemt}
                backgroundColor={Colors.SKY_BLUE}
                hoverColor={Colors.SKY_BLUE}
              />
            </Grid> */}
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
}
