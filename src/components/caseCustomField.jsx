import React, { useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import Dropdown from "./dropdown";
import { Colors } from "../config/default";
import TextButton from "./button";
import { AddCustomFieldsByTarget } from "../services/services";
import { useToast } from "../toast/toastContext";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash";
import { removeDuplicates } from "../common";
import MuiModels from "../../src/components/models";

export default function CaseCustomField({
  handleClose,
  customFieldsData,
  GetCaseDetails,
  getFields,
}) {
  const { id } = useParams();
  const { showToast } = useToast();
  const ItemsArray =
    customFieldsData &&
    customFieldsData?.map((field) => ({
      label: field?.name,
      value: field?.name,
      type: field?.type,
    }));
  const menuItems = removeDuplicates(ItemsArray);
  const [selectedField, setSelectedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const handleSubmit = async () => {
    setLoading(true);
    const params = {
      name: selectedField?.value,
      value: selectedField?.type === "number" ? Number(inputValue) : inputValue,
    };
    const addFields = await AddCustomFieldsByTarget("case", params, id);
    if (addFields?.status === 200) {
      showToast(addFields?.data?.message, "success");
      GetCaseDetails(id);
      handleClose();
    } else {
      showToast(
        addFields?.response?.data?.message || addFields?.data?.message,
        "error"
      );
    }
    setLoading(false);
  };
  const handleDropdownChange = (value) => {
    const selected = menuItems.find((item) => item.value === value);
    setSelectedField(selected);
  };
  return (
    <Grid container>
      <Grid
        container
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            color: Colors.BLACK,
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          Add Custom Fields
          <span style={{ marginLeft: "1rem" }}>
            <MuiModels
              buttonName="Add Custom Fields"
              show="addCustomField"
              button="customField"
              buttonText="Add Title"
              handleModalClose={getFields}
            />
          </span>
        </Typography>

        <Box
          onClick={handleClose}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Close />
        </Box>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        <Grid
          container
          item
          xs={10}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <Grid
            container
            item
            xs={12}
            sm={5}
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "500",
                color: Colors.BLACK,
                fontSize: "1rem",
              }}
            >
              Title
            </Typography>
            <Dropdown
              disabled={isEmpty(menuItems)}
              menuItems={menuItems}
              placeholder="Title"
              backgroundColor={Colors.BG_LIGHT_GRAY}
              hoverColor={Colors.BG_LIGHT_GRAY}
              width="75%"
              selectedValue={selectedField?.value}
              setSelectedValue={handleDropdownChange}
            />
          </Grid>
          <Grid
            container
            item
            xs={12}
            sm={5}
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "500",
                color: Colors.BLACK,
                fontSize: "1rem",
              }}
            >
              Value
            </Typography>
            <input
              type={selectedField?.type?.toLowerCase()}
              placeholder="Input Value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                backgroundColor: Colors.BG_LIGHT_GRAY,
                height: "2.5rem",
                color: Colors.DIM_LIGHT_GRAY,
                paddingLeft: "1rem",
                border: "none",
                outline: "none",
                borderRadius: "5px",
                width: "75%",
              }}
            />
          </Grid>
        </Grid>
        <Grid container item xs={10}>
          <Grid
            container
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "right",
              marginTop: "2rem",
            }}
          >
            <TextButton
              disabled={selectedField?.value === "" || inputValue === ""}
              buttonText="SAVE"
              height="2rem"
              width="8rem"
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
              onClick={handleSubmit}
              loading={loading}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
