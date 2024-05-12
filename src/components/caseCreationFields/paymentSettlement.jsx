import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import { Colors } from "../../config/default";
import Dropdown from "./../dropdown";

export default function PaymentSettlement({ newDataList, setNewDataList }) {
  const menuItems = [
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Fortnightly", value: "Fortnightly" },
    { label: "Monthly", value: "Monthly" },
  ];
  console.log(newDataList, "kkkk");
  const [selectedValue, setSelectedValue] = useState("Custom");

  const handleAddNewData = () => {
    const newItem = {
      amount: "",
      timePeriod: "", // Default value for time period
      startDate: "",
      frequency: "",
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
    updatedList[index][field] = value;
    setNewDataList(updatedList);
  };

  return (
    <>
      <Typography
        sx={{
          fontFamily: "Nunito",
          fontWeight: "600",
        }}
        gutterBottom
      >
        Settlement Plan Automation
      </Typography>
      {/* <Grid container item>
        <Grid
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "center",
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
            Debt
          </Typography>
          <input
            type="text"
            placeholder="$2000"
            value={debtValue}
            onChange={(e) => setDebtValue(e.target.value)}
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
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "center",
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
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            menuItems={menuItems}
            defaultSelectedItem={"Customer"}
            backgroundColor={Colors.BG_LIGHT_GRAY}
            width="60%"
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "center",
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
            Date
          </Typography>
          <input
            type="text"
            placeholder="4/1/2024"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
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
          lg={3}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <AddCircleIcon
            sx={{ color: Colors.SKY_BLUE }}
            onClick={handleAddNewData}
          />
        </Grid>
      </Grid> */}
      <Grid container item sx={{ marginTop: "1rem" }}>
        {newDataList?.map((item, index) => (
          <>
            <Grid
              container
              item
              xs={12}
              lg={3}
              sx={{
                display: "flex",
                justifyContent: "center",
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
                gutterBottom
              >
                Debt
              </Typography>
              <input
                type="text"
                placeholder="$2000"
                value={item?.debt}
                onChange={(e) =>
                  handleInputChange(index, "amount", e.target.value)
                }
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
              lg={3}
              sx={{
                display: "flex",
                justifyContent: "center",
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
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
                menuItems={menuItems}
                defaultSelectedItem={"Customer"}
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
              lg={3}
              sx={{
                display: "flex",
                justifyContent: "center",
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
                Date
              </Typography>
              <input
                type="date"
                placeholder="4/1/2024"
                value={item?.date}
                onChange={(e) =>
                  handleInputChange(index, "startDate", e.target.value)
                }
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
              lg={3}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {index !== 0 && (
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
                    placeholder="5"
                    value={item.frequency}
                    onChange={(e) =>
                      handleInputChange(index, "frequency", e.target.value)
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
          </>
        ))}
      </Grid>
    </>
  );
}
