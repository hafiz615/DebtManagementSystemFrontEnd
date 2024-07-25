import React from "react";

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
import Delete from "@mui/icons-material/Delete";
import EditStatus from "./settingsScreen/editStatus";
import DeleteStatus from "./settingsScreen/deleteStatus";
import {
  ExitToApp,
  MoreHorizOutlined,
  Email,
  Difference,
} from "@mui/icons-material";
import { Add } from "@mui/icons-material";
import EditPipeline from "./settingsScreen/editPipeline";
import EditMainPipeline from "./editMainPipeline";
import AddPipeline from "./settingsScreen/addPipeline";
import EditPipelineCase from "./pipelines/editPipelineCase";
import ExportPipeline from "./pipelines/exportPipeline";
import { FONT_SIZE_XL } from "../constants/appConstants";
import SendEmail from "./sendEmail";
import CreateRole from "./settingsScreen/createRole";

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
  text,
  arrayStatus,
  statusId,
  GetStatuses,
  GetPipelines,
  pipelineId,
  item,
  getSettings,
  row,
  maxHeight,
  buttonText,
  loading,
  setLoading,
  GetAllPipelineDetail,
  GetRoles,
  selectedRole,
  selectedData,
  rolesId,
  selectedRoleData,
  setSelectedRole,
}) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (show === "froalaEditor") {
      setFroalaEditor("");
    }

    setOpen(false);
  };

  const smallScreen = useMediaQuery("(min-width:900px) and (max-width:1200px)");
  const extraSmallScreen = useMediaQuery(
    "(min-width:300px) and (max-width:900px)"
  );
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: extraSmallScreen ? "90%" : smallScreen ? "65vw" : width || "50vw",
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    maxHeight: maxHeight,
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
      ) : show === "editStatus" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <EditIcon
            sx={{
              fontSize: "1.2rem",
              color: Colors.DARK_GRAY,
              cursor: "pointer",
            }}
          />
        </IconButton>
      ) : show === "duplicateRole" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <Difference
            sx={{
              fontSize: "20px",
              color:
                selectedRole === selectedData?.name
                  ? Colors.WHITE
                  : Colors.DARK_GRAY,
              cursor: "pointer",
            }}
          />
        </IconButton>
      ) : show === "deleteStatus" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <Delete
            sx={{
              fontSize: "1.2rem",
              color: Colors.DARK_GRAY,
              cursor: "pointer",
            }}
          />
        </IconButton>
      ) : show === "moreStatus" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <MoreHorizOutlined
            sx={{
              fontSize: "1.2rem",
              color: Colors.DARK_GRAY,
              cursor: "pointer",
            }}
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
              fontSize: iconSize,
              color: Colors.DARK_GRAY,
              cursor: "pointer",
            }}
          />
        </IconButton>
      ) : show === "createRole" ? (
        <TextButton
          buttonText={extraSmallScreen ? <Add /> : "Create Role"}
          height={extraSmallScreen ? "2rem" : "2.5rem"}
          width={extraSmallScreen ? "2rem" : "10rem"}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          onClick={handleOpen}
          startIcon={extraSmallScreen ? "" : <Add />}
        />
      ) : show === "addPipeline" ? (
        <TextButton
          buttonText={extraSmallScreen ? <Add /> : "Add Pipelines"}
          height={extraSmallScreen ? "2rem" : "2.5rem"}
          width={extraSmallScreen ? "2rem" : "10rem"}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          onClick={handleOpen}
          startIcon={extraSmallScreen ? "" : <Add />}
        />
      ) : button === "exportButton" ? (
        <TextButton
          buttonText={
            extraSmallScreen ? (
              <ExitToApp
                sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }}
              />
            ) : (
              "Export"
            )
          }
          boxShadow="none"
          height={"2.5rem"}
          width={extraSmallScreen ? "2rem" : "6rem"}
          backgroundColor={Colors.BG_LIGHT_GRAY}
          fontColor={Colors.BLACK}
          hoverColor={Colors.BG_LIGHT_GRAY}
          onClick={handleOpen}
          startIcon={
            extraSmallScreen ? (
              ""
            ) : (
              <ExitToApp
                sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }}
              />
            )
          }
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
      ) : show === "sendEmail" ? (
        <TextButton
          buttonText={"Send Email"}
          boxShadow="none"
          height={"2.5rem"}
          width={extraSmallScreen ? "2rem" : "9rem"}
          backgroundColor={Colors.BG_LIGHT_GRAY}
          fontColor={Colors.BLACK}
          hoverColor={Colors.BG_LIGHT_GRAY}
          onClick={handleOpen}
          startIcon={
            extraSmallScreen ? (
              ""
            ) : (
              <Email sx={{ color: Colors.DARK_GRAY, fontSize: FONT_SIZE_XL }} />
            )
          }
        />
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
              maxHeight={maxHeight}
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
          ) : show === "editStatus" ? (
            <EditStatus
              show={show}
              handleClose={handleClose}
              text={text}
              statusId={statusId}
              GetStatuses={GetStatuses}
            />
          ) : show === "deleteStatus" ? (
            <DeleteStatus
              show={show}
              handleClose={handleClose}
              arrayStatus={arrayStatus}
              text={text}
              statusId={statusId}
              GetStatuses={GetStatuses}
            />
          ) : show === "froalaEditor" ? (
            <FroalaEditor
              // emailTemplate={emailTemplate}
              // setEmailTemplate={setEmailTemplate}
              // smsTemplate={smsTemplate}
              // setSmsTemplate={setSmsTemplate}
              froalaEditor={froalaEditor}
              setFroalaEditor={setFroalaEditor}
              templateType={templateType}
              handleClose={handleClose}
              getSettings={getSettings}
              row={row}
              buttonText={buttonText}
              loading={loading}
              setLoading={setLoading}
            />
          ) : show === "editPipeline" ? (
            <EditPipeline
              handleClose={handleClose}
              GetPipelines={GetPipelines}
              pipelineId={pipelineId}
              item={item}
            />
          ) : show === "editMainPipeline" ? (
            <EditMainPipeline
              GetPipelines={GetPipelines}
              item={item}
              handleClose={handleClose}
            />
          ) : show === "addPipeline" ? (
            <AddPipeline
              handleClose={handleClose}
              GetPipelines={GetPipelines}
            />
          ) : show === "editPipelineCase" ? (
            <EditPipelineCase
              item={item}
              GetAllPipelineDetail={GetAllPipelineDetail}
              handleClose={handleClose}
            />
          ) : show === "createRole" ? (
            <CreateRole handleClose={handleClose} GetRoles={GetRoles} />
          ) : show === "duplicateRole" ? (
            <CreateRole
              handleClose={handleClose}
              GetRoles={GetRoles}
              selectedRoleData={selectedRoleData}
              setSelectedRole={setSelectedRole}
              show={show}
            />
          ) : show === "exportPipeline" ? (
            <ExportPipeline handleClose={handleClose} data={data} />
          ) : show === "sendEmail" ? (
            <SendEmail handleClose={handleClose} />
          ) : (
            ""
          )}
        </Box>
      </Modal>
    </div>
  );
}
