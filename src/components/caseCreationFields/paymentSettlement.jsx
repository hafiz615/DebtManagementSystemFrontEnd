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
import { FONT_SIZE_LARGE } from "../../constants/appConstants";

const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function PaymentSettlement({
  newDataList,
  setNewDataList,
  remainingAmount,
  totalAmount,
  isExempt,
  errorMessage,
  planExists,
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
      timePeriod: "Custom",
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

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  return (
    <>
      <Grid container>
        {newDataList?.map((item, index) => (
          <Grid
            key={index}
            xs={12}
            container
            sx={{ alignItems: "center", mb: "1rem" }}
          >
            <Grid xs={3}>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "500",
                  color: Colors.DARK_GRAY,
                  fontSize: FONT_SIZE_LARGE,
                }}
              >
                Payment Amount
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
                          fontSize: "10px",
                        }}
                      >
                        {errorMessage ||
                          "Payment Amount must be equal to remaining amount"}
                      </Typography>
                    )}
                </Hidden>
              )}
            </Grid>

            <Grid xs={3}>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "500",
                  color: Colors.DARK_GRAY,
                  fontSize: FONT_SIZE_LARGE,
                }}
              >
                Time Period
              </Typography>
              <Dropdown
                menuWidth="10rem"
                initialValue={item?.timePeriod}
                menuItems={menuItems}
                backgroundColor={Colors.BG_LIGHT_GRAY}
                width={smallScreen ? "100%" : "10rem"}
                height="2.5rem"
                value={item?.timePeriod}
                onChange={(value) =>
                  handleInputChange(index, "timePeriod", value)
                }
              />
            </Grid>

            <Grid xs={3}>
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "500",
                  fontSize: FONT_SIZE_LARGE,
                  color: Colors.DARK_GRAY,
                }}
              >
                Date
              </Typography>
              <input
                type="date"
                placeholder="DD/MM/YYYY"
                value={formatDateForInput(item?.startDate)}
                onChange={(e) =>
                  handleInputChange(
                    index,
                    "startDate",
                    formatDateForInput(e.target.value)
                  )
                }
                min={minDate}
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

            <Grid xs={3}>
              {item?.timePeriod !== "Custom" && (
                <>
                  <Typography
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: "500",
                      color: Colors.DARK_GRAY,
                      fontSize: FONT_SIZE_LARGE,
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
                      width: "4rem",
                      marginRight: "1rem",
                    }}
                  />
                </>
              )}
              {!planExists && (
                <AddCircleIcon
                  sx={{ color: Colors.SKY_BLUE }}
                  onClick={handleAddNewData}
                />
              )}

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
                        fontSize: "10px",
                        width: "100%",
                      }}
                    >
                      {errorMessage ||
                        "Payment Amount must be equal to remaining amount"}
                    </Typography>
                  )}
              </Hidden>
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
}
