import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import Dropdown from "./dropdown";
import { Colors } from "../config/default";
import TextButton from "./button";
import { useToast } from "../toast/toastContext";
import { EditCustomFieldsByTarget } from "../services/services";
import { isEmpty } from "lodash";

export default function EditCaseCustomField({
  handleClose,
  customFieldsData,
  caseData,
}) {
  const { id } = useParams();
  const { showToast } = useToast();
  const menuItems =
    customFieldsData &&
    customFieldsData?.map((field) => ({
      label: field?.name,
      value: field?.name,
      type: field?.type,
    }));

  const [fields, setFields] = useState(
    caseData?.customFields?.map((field) => ({
      ...field,
      type:
        customFieldsData?.find((item) => item?.name === field?.name)?.type ||
        "text",
    }))
  );
  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    if (key === "name") {
      const selectedField = customFieldsData?.find(
        (item) => item?.name === value
      );
      updatedFields[index].type = selectedField?.type || "text";
      updatedFields[index].value = "";
    }
    setFields(updatedFields);
  };
  const isButtonDisabled = fields?.some((field) => !field.name || !field.value);
  const handleSubmit = async () => {
    const params = {
      customFields: fields.map((field) => ({
        name: field.name,
        value: field.value,
      })),
    };
    const editCustomField = await EditCustomFieldsByTarget("case", params, id);
    if (editCustomField?.status === 200) {
      showToast(editCustomField?.data?.message, "success");
    } else {
      showToast(
        editCustomField?.response?.data?.message ||
          editCustomField?.data?.message,
        "error"
      );
    }
    handleClose();
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
          }}
        >
          Edit Custom Fields
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
        {fields?.map((item, index) => {
          return (
            <Grid
              key={index}
              container
              item
              xs={10}
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                mt: ".5rem",
              }}
            >
              <Grid
                container
                item
                xs={5}
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
                  selectedValue={item?.name}
                  setSelectedValue={(value) =>
                    handleFieldChange(index, "name", value)
                  }
                />
              </Grid>
              <Grid
                container
                item
                xs={5}
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
                  type={item?.type?.toLowerCase()}
                  placeholder="Input Value"
                  value={item?.value}
                  onChange={(e) =>
                    handleFieldChange(index, "value", e.target.value)
                  }
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
          );
        })}

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
              disabled={isButtonDisabled}
              onClick={handleSubmit}
              buttonText="UPDATE"
              height="2rem"
              width="8rem"
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
