import React from "react";

import { Box, Button, Modal, IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

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
import CaseModel from "./caseModel";
import CaseCustomField from "./caseCustomField";
import EditCaseCustomField from "./editCaseCustomField";
import PaymentsPopup from "./paymentPopup";
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
  Edit,
  Sms,
  Download,
  Refresh,
  LocalAtm,
  Phone,
  Sync,
  CompareArrows,
  Save,
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
import DebtorContacts from "./caseDetail/debtorContacts";
import UploadFilePopup from "./caseDetail/uploadFilePopup";
import ScrollbarStyles from "./../components/customScroll";
import SettlementPayment from "./settlementPlan";
import SendEmailCase from "./caseDetail/sendEmailCase";
import DownloadPDF from "./caseDetail/downloadPDF";
import SendEmailJustification from "./sendEmailJustifications";
import ExtractFieldPopup from "./caseDetail/extractFieldPopup";
import TextEditor from "./textEditor";
import PaynoteForm from "./caseDetail/paynoteForm";
import CommissionDetails from "./caseDetail/commissionDetails";
import Strategy3choices from "./strategy3choices";
import DebtorPlan from "./debtorPlan";
import TransactionHistory from "./transactionHistory";
import PaymentCardPopup from "./paymentCardPopup";
import DialPad from "./dialPad";
import EditContractInformation from "./settlementRange/editContractInformation";
import CreditorSync from "./caseDetail/creditorSync";
import UpdateWeeklyBudget from "./settlementRange/updateWeeklyBudget";
import BouncePayments from "./caseDetail/bouncePayments";
import GetTransactionDetails from "./caseDetail/getTransactionDetails";
import SeeCheckDetails from "./caseDetail/seeCheckDetails";
import ClientSync from "./caseDetail/ClientSync";
import AttorneyPaymentPlan from "./attorneyPaymentPlan";
import EditAttorneyDetails from "./editAttorneyDetails";
import CreateSignature from "./settingsScreen/createSignature";
import CreateSignatures from "./settingsScreen/createSignature";
import SaveVoiceCase from "./saveVoiceCase";

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
  setCaseData,
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
  selectedRoleData,
  setSelectedRole,
  getAllCaseTasks,
  GetCasePaymentDetails,
  title,
  settlementRange,
  weeksTillPaid,
  caseId,
  remainingAmount,
  closePopup,
  commissionRange,
  getFields,
  connectPayment,
  setConnectPayment,
  payableAmount,
  debtorInfo,
  creditorInfo,
  headerName,
  caseDataId,
  GetLogsById,
  disabled,
  selectedCreditor,
  lumpSump,
  fullProfit,
  paymentData,
  setPaymentChanged,
  allData,
  lumpSumpData,
  selectedFiles,
  setSelectedFiles,
  replyButton,
  from,
  to,
  content,
  emailSubject,
  buttonIcon,
  popUpDebtorData,
  getAllRanges,
  selectedOption,
  setSelectedOption,
  strategy,
  commission,
  replyCheck,
  debtorId,
  verifiedSenders,
  scoresBackend,
  compose,
  amount,
  creditorDetails,
  selectedCreditorDetails,
  selectedCreditorDetailsKey,
  fetchCalls,
  transactionId,
  paymentPlatform,
  getAllInboxData,
  emailOrCompose,
  updateDraft,
  draftId,
  attachment,
  threadId,
  loginUser,
  cc,
  ccData,
  type,
  attorneyId,
  getAttorneyData,
  GetAllSignaturesData,
  editSignature,
  signatureData,
  accountsExist,
}) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (show === "textEditor") {
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
    ...ScrollbarStyles,
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
          buttonText={buttonText}
          backgroundColor={Colors.SKY_BLUE}
        />
      ) : show === "dialPad" ? (
        <IconButton
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            handleOpen();
          }}
        >
          <Phone
            sx={{
              color: Colors.SKY_BLUE,
              cursor: "pointer",
              fontSize: "16px",
            }}
          />
        </IconButton>
      ) : show === "editField" ? (
        <IconButton
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            handleOpen();
          }}
        >
          <CreateIcon
            sx={{
              color: Colors.DARK_GRAY,
              cursor: "pointer",
              fontSize: "16px",
            }}
          />
        </IconButton>
      ) : show === "debtorContacts" ? (
        <IconButton
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            handleOpen();
          }}
        >
          <AddIcon
            sx={{
              color: Colors.DARK_GRAY,
              cursor: "pointer",
              fontSize: "16px",
            }}
          />
        </IconButton>
      ) : buttonIcon === "settlementRangeReload" ? (
        <IconButton
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            handleOpen();
          }}
        >
          <Refresh
            sx={{
              color: Colors.SKY_BLUE,
              cursor: "pointer",
              fontSize: "2rem",
            }}
          />
        </IconButton>
      ) : show === "editDebtorContacts" ? (
        <IconButton
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            handleOpen();
          }}
        >
          <Edit
            sx={{
              color: Colors.DIM_LIGHT_GRAY,
              cursor: "pointer",
              fontSize: "13px",
            }}
          />
        </IconButton>
      ) : show === "editSignature" ? (
        <IconButton
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            handleOpen();
          }}
        >
          <Edit
            sx={{
              color: Colors.DIM_LIGHT_GRAY,
              cursor: "pointer",
              fontSize: "1.3rem",
            }}
          />
        </IconButton>
      ) : show === "editCreditorContacts" ? (
        <IconButton
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            handleOpen();
          }}
        >
          <Edit
            sx={{
              color: Colors.DIM_LIGHT_GRAY,
              cursor: "pointer",
              fontSize: "13px",
            }}
          />
        </IconButton>
      ) : show === "creditorContacts" ? (
        <IconButton
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            handleOpen();
          }}
        >
          <AddIcon
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
      ) : show === "showCreditorSync" ? (
        <Tooltip title="Sync Paynote Creditor" placement="top-end">
          <Sync
            onClick={() => {
              handleOpen();
            }}
            sx={{
              cursor: "pointer",
              color: Colors.DARK_GRAY,
              fontSize: iconSize || "16px",
            }}
          />
        </Tooltip>
      ) : show === "showClientSync" ? (
        <Tooltip
          title={`Sync ${
            paymentPlatform === "Seamlesschex merchant"
              ? "Seamlesschex Merchant"
              : "Easypay Direct"
          } Client`}
          placement="top-end"
        >
          <IconButton
            onClick={() => {
              handleOpen();
            }}
          >
            <Sync sx={{ color: Colors.DARK_GRAY }} />
          </IconButton>
        </Tooltip>
      ) : show === "saveCallInCase" ? (
        <Tooltip title="save voice message in a case" placement="top">
          <IconButton
            disabled={disabled}
            onClick={() => {
              handleOpen();
            }}
          >
            <Save sx={{ color: Colors.SKY_BLUE }} />
          </IconButton>
        </Tooltip>
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
      ) : show === "addCase" || show === "uploadFile" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <AddIcon
            sx={{ fontSize: "16px", color: Colors.BLACK, cursor: "pointer" }}
          />
        </IconButton>
      ) : show === "deleteFile" ? (
        <IconButton onClick={() => handleOpen()} color="error">
          <Delete />
        </IconButton>
      ) : show === "CaseCustomField" || buttonName === "payments" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <AddIcon
            sx={{ fontSize: "16px", color: Colors.WHITE, cursor: "pointer" }}
          />
        </IconButton>
      ) : show === "editStatus" || show === "editAttorney" ? (
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
      ) : show === "editSettlementContractCard" ? (
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
      ) : show === "getTransactionDetails" ? (
        <Tooltip title="Revert Transaction" placement="top-start">
          <IconButton
            onClick={() => {
              handleOpen();
            }}
          >
            <CompareArrows
              sx={{
                fontSize: "1.2rem",
                color: Colors.DARK_GRAY,
                cursor: "pointer",
              }}
            />
          </IconButton>
        </Tooltip>
      ) : buttonName === "sendEmail" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <Email
            onClick={() => {
              handleOpen();
            }}
            sx={{
              fontSize: "1.2rem",
              color: Colors.DIM_LIGHT_GRAY,
              cursor: "pointer",
            }}
          />
        </IconButton>
      ) : buttonName === "sendSms" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <Sms
            onClick={() => {
              handleOpen();
            }}
            sx={{
              fontSize: "1.2rem",
              color: Colors.DIM_LIGHT_GRAY,
              cursor: "pointer",
            }}
          />
        </IconButton>
      ) : show === "updateWeeklyBudget" || buttonName === "draft" ? (
        <IconButton
          onClick={() => {
            handleOpen();
          }}
        >
          <EditIcon
            sx={{ fontSize: "16px", color: Colors.BLACK, cursor: "pointer" }}
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
      ) : show === "AddPayments" ? (
        <TextButton
          buttonText="Manual Payments"
          height="2.5rem"
          width="10rem"
          onClick={handleOpen}
          disabled={disabled}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      ) : show === "SeeCheckDetails" ? (
        <TextButton
          buttonText="Check Details"
          height="2.5rem"
          width="8rem"
          onClick={handleOpen}
          disabled={disabled}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      ) : show === "bouncePayments" ? (
        <TextButton
          buttonText="Bounce Payments"
          height="2.5rem"
          width="10rem"
          onClick={handleOpen}
          disabled={disabled}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
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
      ) : buttonName === "Get Settlement Range" ? (
        <TextButton
          buttonText="Get Settlement Range"
          height="2.5rem"
          width="12rem"
          onClick={handleOpen}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      ) : show === "TransactionHistory" ? (
        <TextButton
          buttonText="Transaction History"
          height="2.5rem"
          width="100%"
          onClick={handleOpen}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      ) : buttonName === "setPaymentPlan" ? (
        <TextButton
          buttonText="Set Payment Plan"
          height="2rem"
          width="12rem"
          onClick={handleOpen}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      ) : buttonName === "extractFiles" ? (
        <TextButton
          buttonText="Extract Files"
          height="2rem"
          width="8rem"
          onClick={handleOpen}
          disabled={disabled}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      ) : button === "paynoteForm" ? (
        <TextButton
          buttonText={accountsExist ? "Update Bank Info" : "Add Bank Info"}
          height="2rem"
          width="10rem"
          onClick={handleOpen}
          disabled={disabled}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      ) : show === "downloadPDF" ? (
        <TextButton
          buttonText={"Download PDF"}
          boxShadow="none"
          height={"2.5rem"}
          width={extraSmallScreen ? "2rem" : "10rem"}
          backgroundColor={Colors.SKY_BLUE}
          fontColor={Colors.WHITE}
          hoverColor={Colors.SKY_BLUE}
          border={`1px solid ${Colors.SKY_BLUE}`}
          onClick={handleOpen}
          borderRadius="5px"
          disabled={disabled}
        />
      ) : buttonName === "sendEmailCase" ||
        buttonName === "composeEmail" ||
        buttonName === "replyAll" ? (
        <TextButton
          disabled={disabled}
          buttonText={
            buttonName === "replyAll"
              ? "Reply All"
              : replyButton
              ? "Reply"
              : buttonName === "composeEmail"
              ? "Compose Email"
              : buttonName === "draft"
              ? "Edit"
              : "Send Email"
          }
          height="2.5rem"
          width={
            buttonName === "replyAll" ? "8rem" : replyButton ? "5rem" : "9rem"
          }
          onClick={handleOpen}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      ) : buttonName === "sendSmsCase" ? (
        <TextButton
          buttonText="Send SMS"
          height="2.5rem"
          width="9rem"
          onClick={handleOpen}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
      ) : buttonName === "createSignature" ? (
        <TextButton
          buttonText="Create Signature"
          height="2.5rem"
          width="10rem"
          onClick={handleOpen}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
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
      ) : show === "textEditor" ? (
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
      ) : show === "sendEmail" || show === "sendEmailJustification" ? (
        <TextButton
          buttonText={show === "sendEmail" ? "Send Agreement" : "Send Email"}
          boxShadow="none"
          height={"2.5rem"}
          width={show === "sendEmail" ? "10rem" : "9rem"}
          backgroundColor={Colors.SKY_BLUE}
          fontColor={Colors.WHITE}
          hoverColor={Colors.SKY_BLUE}
          onClick={handleOpen}
          disabled={disabled}
        />
      ) : show === "settlmentPayment" ||
        buttonName === "settlmentPayment" ||
        show === "payments" ||
        show === "attorneyPaymentPlan" ? (
        <TextButton
          buttonText="Choose Plan"
          boxShadow="none"
          height="2.5rem"
          width="9rem"
          backgroundColor={Colors.SKY_BLUE}
          fontColor={Colors.WHITE}
          hoverColor={Colors.SKY_BLUE}
          onClick={handleOpen}
        />
      ) : show === "debtorPaymentPlan" ? (
        <TextButton
          buttonText="Choose Client Plan"
          boxShadow="none"
          height="2.5rem"
          width="12rem"
          backgroundColor={Colors.SKY_BLUE}
          fontColor={Colors.WHITE}
          hoverColor={Colors.SKY_BLUE}
          onClick={handleOpen}
        />
      ) : (
        <Button onClick={handleOpen}>{buttonName}</Button>
      )}
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {show === "addTask" ? (
            <AddTask
              data={data}
              show={show}
              field={field}
              caseData={caseData}
              buttonName={buttonName}
              handleClose={handleClose}
              getAllCaseTasks={getAllCaseTasks}
            />
          ) : show === "editTask" ? (
            <AddTask
              data={data}
              show={show}
              buttonName={buttonName}
              handleClose={handleClose}
              caseData={caseData}
              getAllCaseTasks={getAllCaseTasks}
            />
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
              getFields={getFields}
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
              getAllRanges={getAllRanges}
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
            <>
              <EditDebtorDetails
                show={show}
                handleClose={handleClose}
                caseData={caseData}
                GetCaseDetails={GetCaseDetails}
                connectPayment={connectPayment}
                setConnectPayment={setConnectPayment}
                showFields={false}
              />
            </>
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
          ) : show === "textEditor" ? (
            <TextEditor
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
          ) : show === "sendEmailCase" ? (
            <SendEmailCase
              caseData={caseData}
              verifiedSenders={verifiedSenders}
              buttonText={buttonText}
              handleClose={handleClose}
              buttonName={buttonName}
              headerName={headerName}
              compose={compose}
              caseDataId={caseDataId}
              GetLogsById={GetLogsById}
              from={from}
              to={to}
              content={content}
              emailSubject={emailSubject}
              replyCheck={replyCheck}
              data={data}
              getAllInboxData={getAllInboxData}
              emailOrCompose={emailOrCompose}
              updateDraft={updateDraft}
              draftId={draftId}
              attachment={attachment}
              threadId={threadId}
              loginUser={loginUser}
              cc={cc}
              ccData={ccData}
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
          ) : show === "debtorContacts" ? (
            <DebtorContacts
              caseData={caseData?.debtor?.contacts || []}
              setCaseData={setCaseData}
              handleClose={handleClose}
              show="Debtor"
              caseId={caseData?._id}
              GetCaseDetails={GetCaseDetails}
              cc={cc}
            />
          ) : show === "editDebtorContacts" ? (
            <DebtorContacts
              caseData={caseData}
              setCaseData={setCaseData}
              handleClose={handleClose}
              item={item}
              show="EditDebtor"
              caseId={caseData?._id}
              GetCaseDetails={GetCaseDetails}
            />
          ) : show === "creditorContacts" ? (
            <DebtorContacts
              caseData={caseData?.creditor?.contacts || []}
              setCaseData={setCaseData}
              handleClose={handleClose}
              show="Creditor"
              caseId={caseData?.creditor?._id}
              GetCaseDetails={GetCaseDetails}
              cc={cc}
            />
          ) : show === "editCreditorContacts" ? (
            <DebtorContacts
              caseData={caseData}
              setCaseData={setCaseData}
              handleClose={handleClose}
              show="EditCreditor"
              item={item}
              caseId={caseData?.creditor?._id}
              GetCaseDetails={GetCaseDetails}
            />
          ) : show === "sendEmail" ? (
            <SendEmail
              handleClose={handleClose}
              payableAmount={payableAmount}
              debtorInfo={debtorInfo}
              creditorInfo={creditorInfo}
              data={data}
              selectedCreditor={selectedCreditor}
              lumpSump={lumpSump}
              fullProfit={fullProfit}
              caseId={caseId}
              paymentData={paymentData}
              debtorId={debtorId}
              to={to}
            />
          ) : show === "createSignature" || show === "editSignature" ? (
            <CreateSignatures
              handleClose={handleClose}
              GetAllSignaturesData={GetAllSignaturesData}
              editSignature={editSignature}
              signatureData={signatureData}
            />
          ) : show === "uploadFile" ? (
            <UploadFilePopup
              handleClose={handleClose}
              GetCaseDetails={GetCaseDetails}
            />
          ) : show === "payments" ? (
            <PaymentsPopup
              data={data}
              handleClose={handleClose}
              closePopup={closePopup}
              GetCaseDetails={GetCaseDetails}
              GetCasePaymentDetails={GetCasePaymentDetails}
              settlementRange={settlementRange}
              weeksTillPaid={weeksTillPaid}
              caseId={caseId}
              remainingAmount={remainingAmount}
              commissionRange={commissionRange}
              setPaymentChanged={setPaymentChanged}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              strategy={strategy}
              commission={commission}
              getAttorneyData={getAttorneyData}
            />
          ) : show === "attorneyPaymentPlan" ? (
            <AttorneyPaymentPlan
              attorneyId={attorneyId}
              data={data}
              caseData={caseData}
              handleClose={handleClose}
              GetCaseDetails={GetCaseDetails}
              getAttorneyData={getAttorneyData}
              remainingAmount={remainingAmount}
            />
          ) : show === "settlmentPayment" ? (
            <SettlementPayment
              title={title}
              handleClose={handleClose}
              settlementRange={settlementRange}
              weeksTillPaid={weeksTillPaid}
              caseId={caseId}
              remainingAmount={remainingAmount}
              commissionRange={commissionRange}
              setPaymentChanged={setPaymentChanged}
              commission={commission}
            />
          ) : show === "strategy3choices" ? (
            <Strategy3choices
              title={title}
              handleClose={handleClose}
              settlementRange={settlementRange}
              weeksTillPaid={weeksTillPaid}
              caseId={caseId}
              remainingAmount={remainingAmount}
              commissionRange={commissionRange}
              setPaymentChanged={setPaymentChanged}
              commission={commission}
              scoresBackend={scoresBackend}
            />
          ) : show === "sendEmailJustification" ? (
            <SendEmailJustification
              handleClose={handleClose}
              data={data}
              caseId={caseId}
              debtorId={debtorId}
              cc={cc}
            />
          ) : show === "WeeklyBudget" ? (
            <CommissionDetails
              handleClose={handleClose}
              data={caseData}
              caseId={caseId}
              popUpDebtorData={popUpDebtorData}
              getAllRanges={getAllRanges}
            />
          ) : show === "downloadPDF" ? (
            <DownloadPDF
              allData={allData}
              lumpSumpData={lumpSumpData}
              fullProfit={fullProfit}
              handleClose={handleClose}
            />
          ) : show === "paynoteForm" ? (
            <PaynoteForm
              accountsExist={accountsExist}
              type={type}
              attorneyId={attorneyId}
              handleClose={handleClose}
              caseData={caseData}
            />
          ) : show === "AddPayments" ? (
            <PaymentCardPopup
              handleClose={handleClose}
              caseId={caseId}
              debtorId={debtorId}
              GetCaseDetails={GetCaseDetails}
            />
          ) : show === "bouncePayments" ? (
            <BouncePayments handleClose={handleClose} debtorId={debtorId} />
          ) : show === "extractFiles" ? (
            <ExtractFieldPopup
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              handleClose={handleClose}
              caseDataId={caseDataId}
              data={caseData}
              GetCaseDetails={GetCaseDetails}
              connectPayment={connectPayment}
              setConnectPayment={setConnectPayment}
              show={show}
              maxHeight={maxHeight}
            />
          ) : show === "debtorPaymentPlan" ? (
            <DebtorPlan
              caseData={caseData}
              handleClose={handleClose}
              GetCaseDetails={GetCaseDetails}
            />
          ) : show === "editSettlementContractCard" ? (
            <EditContractInformation
              handleClose={handleClose}
              creditorDetails={creditorDetails}
              caseId={caseId}
              selectedCreditorDetails={selectedCreditorDetails}
              selectedCreditorDetailsKey={selectedCreditorDetailsKey}
              getAllRanges={getAllRanges}
            />
          ) : show === "TransactionHistory" ? (
            <TransactionHistory handleClose={handleClose} data={data} />
          ) : show === "dialPad" ? (
            <DialPad
              caseId={caseId}
              data={data}
              handleClose={handleClose}
              fetchCalls={fetchCalls}
            />
          ) : show === "showCreditorSync" ? (
            <CreditorSync
              attorneyId={attorneyId}
              type={type}
              handleClose={handleClose}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
            />
          ) : show === "showClientSync" ? (
            <ClientSync
              handleClose={handleClose}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
              paymentPlatform={paymentPlatform}
            />
          ) : show === "updateWeeklyBudget" ? (
            <UpdateWeeklyBudget
              handleClose={handleClose}
              data={data}
              popUpDebtorData={popUpDebtorData}
              getAllRanges={getAllRanges}
            />
          ) : show === "getTransactionDetails" ? (
            <GetTransactionDetails
              handleClose={handleClose}
              GetCaseDetails={GetCaseDetails}
              caseData={caseData}
              transactionId={transactionId}
            />
          ) : show === "SeeCheckDetails" ? (
            <SeeCheckDetails
              handleClose={handleClose}
              GetCaseDetails={GetCaseDetails}
              caseData={caseData}
            />
          ) : show === "editAttorney" ? (
            <EditAttorneyDetails
              data={data}
              attorneyId={attorneyId}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
              getAttorneyData={getAttorneyData}
              handleClose={handleClose}
            />
          ) : show === "saveCallInCase" ? (
            <SaveVoiceCase handleClose={handleClose} data={data} />
          ) : (
            ""
          )}
        </Box>
      </Modal>
    </div>
  );
}
