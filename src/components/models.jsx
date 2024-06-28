import * as React from "react";

import { Box, Button, Modal, IconButton } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import EditIcon from "@mui/icons-material/Edit";
import useMediaQuery from "@mui/material/useMediaQuery";

import AddTask from "./addTask";
import EditField from "./editField";
import AddCustomField from "./addCustomField";
import { Colors } from "../config/default";
import TextButton from "./button";
import EditCreditorDetail from "./editCreditorDetail";
import EditDebtorDetails from "./editDebtorDetails";
import FroalaEditor from "./froalaEditor";
import CaseModel from "./caseModel";
import CaseCustomField from "./caseCustomField";
import EditCaseCustomField from "./editCaseCustomField";
import EditAbout from "./editAbout";
import { isEmpty } from "lodash";
import { Add, Delete } from "@mui/icons-material";
import { FONT_SIZE_XL } from "../constants/appConstants";
import EditPipeline from "./settingsScreen/editPipeline";
import DeletePipeline from "./settingsScreen/deletePipeline";
import EditMainPipeline from "./editMainPipeline";
import DeleteMainPipeline from "./deleteMainPipeline";
import AddPipeline from "./settingsScreen/addPipeline";

export default function MuiModels({
  buttonName,
  show,
  button,
  froalaEditorButton,
  froalaEditor,
  setFroalaEditor,
  iconSize,
  field,
  data,
  width,
  height,
  caseData,
  handleModalClose,
  GetCaseDetails,
  customFieldsData,
  templateType,
  disabled,
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const smallScreen = useMediaQuery("(min-width:900px) and (max-width:1200px)");
  const extraSmallScreen = useMediaQuery(
    "(min-width:300px) and (max-width:900px)"
  );
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: extraSmallScreen ? "90%" : smallScreen ? "70vw" : width || "50vw",
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    p: 3,
    height: height || "auto",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#E5E5E5",
      borderRadius: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: Colors.WHITE,
      borderRadius: "8px",
      marginTop: ".5rem",
      marginBottom: ".5rem",
    },
  };

  return (
    <div>
      {button === "icon" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <AddIcon sx={{ color: Colors.WHITE, fontSize: "16px" }} />
        </IconButton>
      ) : button === "customField" ? (
        <TextButton
          onClick={() => {
            handleOpen();
          }}
          startIcon={<AddIcon />}
          buttonText="New Custom Field"
          backgroundColor={Colors.SKY_BLUE}
        />
      ) : show === "editField" ? (
        <IconButton sx={{ display: "flex", alignItems: "center" }}>
          <CreateIcon
            onClick={() => {
              handleOpen();
            }}
            sx={{
              color: Colors.DARK_GRAY,
              cursor: "pointer",
              fontSize: "16px",
            }}
          />
        </IconButton>
      ) : button === "create" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <EditIcon
            sx={{ color: Colors.DARK_GRAY, fontSize: iconSize || "16px" }}
          />
        </IconButton>
      ) : show === "editAbout" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <EditIcon
            sx={{ color: Colors.WHITE, fontSize: iconSize || "16px" }}
          />
        </IconButton>
      ) : show === "addCase" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <AddIcon
            sx={{ fontSize: "16px", color: Colors.BLACK, cursor: "pointer" }}
          />
        </IconButton>
      ) : show === "CaseCustomField" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <AddIcon
            sx={{ fontSize: "16px", color: Colors.WHITE, cursor: "pointer" }}
          />
        </IconButton>
      ) : show === "EditCaseCustomField" ? (
        <IconButton
          disabled={isEmpty(customFieldsData)}
          onClick={() => {
            handleOpen();
          }}
        >
          <EditIcon
            sx={{ fontSize: "16px", color: Colors.WHITE, cursor: "pointer" }}
          />
        </IconButton>
      ) : button === "delete" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <Delete
            sx={{
              fontSize: FONT_SIZE_XL,
              color: Colors.DARK_GRAY,
              cursor: "pointer",
            }}
          />
        </IconButton>
      ) : show === "addPipeline" ? (
        <TextButton
          buttonText="Add Pipelines"
          height="2.5rem"
          width={smallScreen ? "100%" : "10rem"}
          marginTop={smallScreen && "1rem"}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          onClick={handleOpen}
          startIcon={<Add />}
        />
      ) : show === "froalaEditor" ? (
        <Button
          onClick={handleOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            border: `2px solid ${Colors.SKY_BLUE}`,
            height: "2rem",
            borderRadius: "10px",
            color: Colors.SKY_BLUE,
            fontWeight: "600",
            marginRight: ".5rem",
          }}
        >
          <AddIcon sx={{ fontSize: ".9rem" }} />
          {froalaEditorButton}
        </Button>
      ) : (
        <Button onClick={handleOpen}>{buttonName}</Button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {show === "addTask" ? (
            <AddTask
              data={data}
              show={show}
              field={field}
              handleClose={handleClose}
            />
          ) : show === "task" ? (
            <AddTask show={show} handleClose={handleClose} />
          ) : show === "editField" ? (
            <EditField
              show={show}
              handleClose={handleClose}
              data={data}
              handleModalClose={handleModalClose}
            />
          ) : show === "addCustomField" ? (
            <AddCustomField
              show={show}
              handleClose={handleClose}
              handleModalClose={handleModalClose}
            />
          ) : show === "CaseCustomField" ? (
            <CaseCustomField
              show={show}
              handleClose={handleClose}
              customFieldsData={customFieldsData}
              GetCaseDetails={GetCaseDetails}
            />
          ) : show === "EditCaseCustomField" ? (
            <EditCaseCustomField
              show={show}
              handleClose={handleClose}
              customFieldsData={customFieldsData}
              GetCaseDetails={GetCaseDetails}
              caseData={caseData}
            />
          ) : show === "creditorDetail" ? (
            <EditCreditorDetail
              show={show}
              handleClose={handleClose}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
            />
          ) : show === "editAbout" ? (
            <EditAbout
              show={show}
              GetCaseDetails={GetCaseDetails}
              handleClose={handleClose}
              data={data}
            />
          ) : show === "addCase" ? (
            <CaseModel
              show={show}
              handleClose={handleClose}
              caseData={caseData}
            />
          ) : show === "debtorDetail" ? (
            <EditDebtorDetails
              show={show}
              handleClose={handleClose}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
            />
          ) : show === "froalaEditor" ? (
            <FroalaEditor
              froalaEditor={froalaEditor}
              setFroalaEditor={setFroalaEditor}
              templateType={templateType}
            />
          ) : show === "editPipeline" ? (
            <EditPipeline handleClose={handleClose} />
          ) : show === "deletePipeline" ? (
            <DeletePipeline handleClose={handleClose} />
          ) : show === "editMainPipeline" ? (
            <EditMainPipeline handleClose={handleClose} />
          ) : show === "deleteMainPipeline" ? (
            <DeleteMainPipeline handleClose={handleClose} />
          ) : show === "addPipeline" ? (
            <AddPipeline handleClose={handleClose} />
          ) : (
            ""
          )}
        </Box>
      </Modal>
    </div>
  );
}
