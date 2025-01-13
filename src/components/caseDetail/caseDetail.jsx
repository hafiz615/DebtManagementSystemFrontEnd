import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { Grid, Typography, Tabs, Tab, Tooltip, styled } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Colors } from "../../config/default";
import {
  FONT_SIZE_SMALL,
  PAGE_HEIGHT,
  UserListPage,
} from "../../constants/appConstants";

import {
  AddNotesCase,
  AddSenderIdentity,
  GetAllSenders,
  GetCaseById,
  GetCasePaymentById,
  GetDailyCashFlow,
  GetLogs,
  GetLumpSumAmount,
  GetMcaByMonth,
  GetSettlementRangeWithScores,
  GetStatementSummary,
  PausePayments,
} from "../../services/services.js";
import { isEmpty } from "lodash";
import MuiModels from "../models.jsx";
import ScrollbarStyles from "../customScroll.jsx";
import TextButton from "../button.jsx";
import { setCaseCreditorId, setCaseId } from "../../redux/action/action.js";
import { useToast } from "../../toast/toastContext.jsx";
import CaseById from "./caseById.jsx";
import SettlementRange from "../settlementRange/settlementRange.jsx";
import { Download } from "@mui/icons-material";
import { generatePdfFromApiData } from "../../common.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: Colors.SKY_BLUE,
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
      fontSize: "14px !important",
    },
    [theme.breakpoints.up("xs")]: {
      fontSize: FONT_SIZE_SMALL,
    },
    fontWeight: "500",
    color: Colors.DARK_GRAY,
    fontFamily: ["Nunito"].join(","),
    "&:hover": {
      color: Colors.SKY_BLUE,
      opacity: 1,
    },
    "&.Mui-selected": {
      color: Colors.SKY_BLUE,
      fontWeight: "500",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  })
);

function CaseDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const { showToast } = useToast();
  const [value, setValue] = React.useState("Debtor");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const { AUTHORITY_TEXT } = UserListPage;
  const [loading, setLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [caseData, setCaseData] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const [addTaskModal, setAddTaskModal] = useState("");
  const [verifiedSenders, setVerified] = useState([]);
  const [caseHistoryTabs, setCaseHistoryTabs] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  //settlement States
  const [settlementloading, setSettlementLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [creditorNames, setCreditorNames] = useState([]);
  const [allCreditorNames, setAllCreditorsNames] = useState([]);
  const [scores, setScores] = useState(null);
  const [debtor, setDebtor] = useState({});
  const [debtorInfo, setDebtorInfo] = useState({});
  const [commissionPercentage, setCommissionPercentage] = useState("");
  const [summaryAmount, setSummaryAmount] = useState({});
  const [allData, setAllData] = useState();
  const [verifiedSender, setVerifiedSender] = useState([]);
  const [statementSummaries, setStatementSummaries] = useState();
  const [lumpSumpData, setLumpSumpData] = useState({});
  const [scoresBackend, setScoresBackend] = useState(false);
  const [optionStats, setOptionStats] = useState();
  const [cashFlow, setCashFlow] = useState();
  const [cashFlowLoading, setCashFlowLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [paymentData, setPaymentData] = useState();
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const [totalPaymentPage, setTotalPaymentPage] = useState();
  const [statementSummariesLoading, setStatementSummariesLoading] =
    useState(false);
  const [mcaByMonth, setMcaByMonth] = useState();

  const [showEmail, setShowEmail] = useState(false);
  const [showEmailAgreement, setShowEmailAgreement] = useState(false);

  const scrollToComponent = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleShowEmail = () => {
    if (!showEmail) {
      setShowEmail(true); // Make the component visible
      setTimeout(() => {
        scrollToComponent("targetComponent"); // Ensure scrolling happens after the component is rendered
      }, 0);
    } else {
      scrollToComponent("targetComponent"); // Scroll to the component if it is already visible
    }
  };

  const handleShowEmailAgreement = () => {
    if (!showEmailAgreement) {
      setShowEmailAgreement(true); // Make the component visible
      setTimeout(() => {
        scrollToComponent("targetComponent"); // Ensure scrolling happens after the component is rendered
      }, 0);
    } else {
      scrollToComponent("targetComponent"); // Scroll to the component if it is already visible
    }
  };
  const handleClose = () => {
    setShowEmail(false);
    if (setShowEmailAgreement) {
      setShowEmailAgreement(false);
    }
  };

  const { id } = useParams();

  const emailData = caseData?.debtor?.basicInformation;

  const tabs = ["All", "Email", "Sms", "Notes", "Case Logs", "Call Logs"];

  const filteredLogs = logs?.filter((item) => {
    if (caseHistoryTabs === 0) {
      return item?.Action;
    } else if (caseHistoryTabs === 1) {
      return item?.Action === "EMAIL";
    } else if (caseHistoryTabs === 2) {
      return item?.Action === "SMS";
    } else if (caseHistoryTabs === 3) {
      return item?.Action === "Add Notes";
    } else if (caseHistoryTabs === 4) {
      return item?.Action?.startsWith("Case");
    }
    return false;
  });

  const handleCloseNotes = () => setOpen(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpen = async () => {
    setOpen(true);
  };

  const GetCaseDetails = async (rowId) => {
    setLoading(true);
    const caseDetails = await GetCaseById(rowId);
    if (caseDetails?.status === 200) {
      GetLogsById(rowId);
      setCaseData(caseDetails?.data?.data);
      setIsChecked(caseDetails?.data?.data?.creditorPaymentsProceed);
      dispatch(setCaseId(id));
      dispatch(setCaseCreditorId(caseDetails?.data?.data?.creditor?._id));

      const senderRes = await GetAllSenders(
        caseDetails?.data?.data?.debtor?._id
      );
      if (senderRes?.status === 200) {
        setVerified(senderRes?.data?.data);
      }
    } else if (
      caseDetails?.response?.status === 401 ||
      caseDetails?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
    }
    setLoading(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const GetCasePaymentDetails = async (rowId, load) => {
    if (!load) {
      setIsPaymentLoading(true);
    }
    const casePayment = await GetCasePaymentById(currentPaymentPage, rowId);
    if (casePayment?.status === 200) {
      let totalPage = Math.ceil(
        casePayment?.data?.data?.transactions?.totalCount / 10
      );
      setPaymentDetails(casePayment?.data?.data);
      setTotalPaymentPage(totalPage);
    } else if (
      casePayment?.response?.status === 401 ||
      casePayment?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
    }
    setIsPaymentLoading(false);
  };

  const GetLogsById = async (id) => {
    const resLogs = await GetLogs(id);
    if (resLogs?.status === 200) {
      setLogs(resLogs?.data?.data);
    }
  };

  const handleChangeModal = (e) => {
    setAddTaskModal(e.target.value);
  };

  const handleClicked = async () => {
    setNotesLoading(true);
    if (addTaskModal === "") {
      setNotesLoading(false);
      showToast("The fields can't be empty, try again", "error");
    } else {
      const payload = {
        notes: addTaskModal,
      };
      const resposne = await AddNotesCase(id, payload);
      if (resposne?.status === 201) {
        setNotesLoading(false);
        GetLogsById(id);
      }
      setAddTaskModal("");
      handleCloseNotes();
    }
  };

  const AddSenderInformation = async () => {
    const params = {
      from_email: emailData?.email || "",
      from_name: emailData?.fullName || "",
      address: emailData?.address || "",
      city: emailData?.city || "",
    };
    const SenderInfoResponse = await AddSenderIdentity(
      params,
      caseData?.debtor?._id
    );
    if (SenderInfoResponse?.status === 200) {
      showToast(SenderInfoResponse?.data?.message, "success");
    } else if (SenderInfoResponse?.response?.status === 400) {
      const errorMessage = SenderInfoResponse?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  const handleToggle = async (check) => {
    setIsChecked(check);
    const res = await PausePayments(id, check);
    if (res?.status === 200) {
      showToast(res?.data?.message, "success");
    } else if (res?.response?.status === 400) {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  //settlement functions
  const getAllRanges = async (creditors, status) => {
    setSettlementLoading(true);
    try {
      if (id) {
        const settlementRangeData = await GetSettlementRangeWithScores(
          creditors,
          id,
          status
        );
        if (settlementRangeData?.status === 200) {
          setStatementSummariesLoading(true);
          setCashFlowLoading(true);
          setSettlementLoading(false);
          if (typeof settlementRangeData?.data?.data?.getScores === "string") {
            setScoresBackend(true);
            setScores({ message: settlementRangeData?.data?.data?.getScores });
          } else {
            setScoresBackend(false);
            setScores(settlementRangeData?.data?.data?.getScores);
          }
          setAllData(settlementRangeData?.data?.data);
          setDebtor(settlementRangeData?.data?.data?.debtor?.basicInformation);
          setDebtorInfo(
            settlementRangeData?.data?.data?.debtor?.businessInformation
          );
          setApiData(settlementRangeData?.data?.data?.settlementRange);
          setCommissionPercentage(
            settlementRangeData?.data?.data?.debtor?.commissionPercentage
          );
          setSummaryAmount(
            settlementRangeData?.data?.data?.creditorsContractDetailsSum
          );

          const allCreditors = settlementRangeData?.data?.data?.creditors;
          setCreditorNames(allCreditors);
          const creditorAccountTitles = allCreditors?.map(
            (item) => item?.creditorAccountTitle
          );
          if (!isEmpty(creditorAccountTitles)) {
            creditorAccountTitles.push("Summary");
          }
          if (!isEmpty(creditorAccountTitles)) {
            creditorAccountTitles.push("MCA By Month");
          }
          setAllCreditorsNames(creditorAccountTitles || []);
          setOptionStats(
            settlementRangeData?.data?.data?.settlementRange?.option_2_stats
          );
          showToast(settlementRangeData?.data?.message, "success");
          if (typeof settlementRangeData?.data?.data?.getScores !== "string") {
            getLumpSumAmountData();
          }
          const MCARes = await GetMcaByMonth(id);
          if (MCARes?.status === 200) {
            setMcaByMonth(MCARes?.data?.data);
          }

          const senderRes = await GetAllSenders(
            settlementRangeData?.data?.data?.debtor?._id
          );
          if (senderRes?.status === 200) {
            setVerifiedSender(senderRes?.data?.data);
          }
          const resStatementSummary = await GetStatementSummary(
            settlementRangeData?.data?.data?.debtor?._id
          );
          if (resStatementSummary?.status === 200) {
            setStatementSummaries(resStatementSummary?.data?.data);
            setStatementSummariesLoading(false);
          }
          const resCashFlow = await GetDailyCashFlow(
            settlementRangeData?.data?.data?.debtor?._id
          );
          if (resCashFlow?.status === 200) {
            setCashFlow(resCashFlow?.data?.data);
            setCashFlowLoading(false);
          }
        } else if (
          settlementRangeData?.response?.status === 401 ||
          settlementRangeData?.response?.status === 403
        ) {
          localStorage.clear();
          navigate("/");
        }
      }
    } catch (err) {
    } finally {
      setSettlementLoading(false);
    }
  };

  const getLumpSumAmountData = async () => {
    if (id) {
      const GetLumpSumDataRes = await GetLumpSumAmount(id);

      if (GetLumpSumDataRes?.status === 200) {
        setLumpSumpData(GetLumpSumDataRes?.data?.data);
      } else {
        const errorMessage = GetLumpSumDataRes?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    }
  };

  useEffect(() => {
    getAllRanges([], false);
    GetCaseDetails(id);
    GetCasePaymentDetails(id);
  }, [id]);

  useEffect(() => {
    GetCasePaymentDetails(id, true);
  }, [currentPaymentPage]);

  const currentCreditor = allCreditorNames[tabValue];

  const selectedCreditorDetails = creditorNames?.find(
    (item) => item?.creditorAccountTitle === currentCreditor
  );

  const handleGeneratePdf = () => {
    const credDetail =
      allCreditorNames[tabValue] === "Summary"
        ? "Summary"
        : selectedCreditorDetails?.name;

    const summaryPayable = summaryAmount?.payableAmount;

    generatePdfFromApiData(
      selectedCreditorDetails,
      credDetail,
      debtorInfo,
      summaryPayable
    );
  };

  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        paddingLeft: "2rem",
        paddingRight: "2rem",
        height: PAGE_HEIGHT,
        overflowY: "auto",
        ...ScrollbarStyles,
      }}
    >
      <Grid
        xs={12}
        item
        container
        sx={{ marginTop: "1.5rem", justifyContent: "space-between" }}
      >
        <Tooltip
          title={caseData?.debtor?.businessInformation?.companyName}
          placement="top"
        >
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "1.5rem",
              fontFamily: "Nunito",
              color: Colors.BLACK,
            }}
          >
            {caseData?.debtor?.businessInformation?.companyName}
          </Typography>
        </Tooltip>
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "500",
            color: Colors.DARK_GRAY,
          }}
        >
          {AUTHORITY_TEXT} <span>{role}</span>
        </Typography>
      </Grid>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "1.2%",
          marginTop: "1rem",
        }}
      >
        {activeTab === 0 && (
          <>
            <MuiModels
              show="downloadPDF"
              buttonName="downloadPDF"
              maxHeight="85vh"
              allData={allData}
              lumpSumpData={lumpSumpData}
              disabled={!apiData}
            />
            {/* <MuiModels
              show="sendEmail"
              to={caseData?.creditor?.basicInformation?.email}
              creditorInfo={
                allCreditorNames[tabValue] === "Summary"
                  ? "Summary"
                  : selectedCreditorDetails?.name
              }
              debtorInfo={debtorInfo}
              payableAmount={
                allCreditorNames[tabValue] === "Summary"
                  ? summaryAmount?.payableAmount
                  : selectedCreditorDetails?.contractDetails?.payable_amount
              }
              data={apiData}
              selectedCreditor={allCreditorNames[tabValue]}
              lumpSump={lumpSumpData}
              caseId={id}
              paymentData={paymentData}
              debtorId={verifiedSender}
            /> */}
            <TextButton
              id="scrollAgreementButton"
              buttonText="Send Agreement"
              height="2.5rem"
              width="12rem"
              onClick={handleShowEmailAgreement}
              backgroundColor={Colors.SKY_BLUE}
              hoverColor={Colors.SKY_BLUE}
            />
            <TextButton
              disabled={!apiData}
              buttonText={"Download Agreement"}
              boxShadow="none"
              height={"2.5rem"}
              width={"12rem"}
              backgroundColor={Colors.SKY_BLUE}
              fontColor={Colors.WHITE}
              hoverColor={Colors.SKY_BLUE}
              border={`1px solid ${Colors.SKY_BLUE}`}
              borderRadius="5px"
              onClick={handleGeneratePdf}
            />
          </>
        )}

        <TextButton
          buttonText="Sync Client Email"
          height="2.5rem"
          width="12rem"
          onClick={AddSenderInformation}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />

        {/* <MuiModels
          show="sendEmailCase"
          buttonName="sendEmailCase"
          iconColor={Colors.BLACK}
          maxHeight="78vh"
          from={caseData?.creditor?.basicInformation?.email}
          caseDataId={id}
          GetLogsById={GetLogsById}
          data={caseData}
          verifiedSenders={verifiedSenders}
        /> */}
        <TextButton
          id="scrollButton"
          buttonText="Send Email"
          height="2.5rem"
          width="9rem"
          onClick={handleShowEmail}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
        />
        <MuiModels
          show="sendEmailCase"
          buttonName="sendSmsCase"
          headerName={true}
          iconColor={Colors.BLACK}
          maxHeight="78vh"
          caseDataId={id}
          GetLogsById={GetLogsById}
          data={caseData}
        />
      </div>

      <AntTabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minWidth: "100%",
          backgroundColor: Colors.WHITE,
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          mt: "1rem",
        }}
      >
        <AntTab
          sx={{
            bgcolor: Colors.WHITE,
            width: "max-content",
            fontWeight: "600",
            height: "3.5rem",
          }}
          label="Settlement Range"
        />
        <AntTab
          sx={{
            bgcolor: Colors.WHITE,
            width: "max-content",
            fontWeight: "600",
            height: "3.5rem",
          }}
          label="Case Detail"
        />
      </AntTabs>

      <Grid xs={12}>
        {activeTab === 0 && (
          <SettlementRange
            id={id}
            getAllRanges={getAllRanges}
            settlementloading={settlementloading}
            setSettlementLoading={setSettlementLoading}
            creditorNames={creditorNames}
            setCreditorNames={setCreditorNames}
            allCreditorNames={allCreditorNames}
            setAllCreditorsNames={setAllCreditorsNames}
            apiData={apiData}
            setApiData={setApiData}
            scores={scores}
            setScores={setScores}
            debtor={debtor}
            setDebtor={setDebtor}
            debtorInfo={debtorInfo}
            setDebtorInfo={setDebtorInfo}
            commissionPercentage={commissionPercentage}
            setCommissionPercentage={setCommissionPercentage}
            summaryAmount={summaryAmount}
            setSummaryAmount={setSummaryAmount}
            allData={allData}
            setAllData={setAllData}
            verifiedSender={verifiedSender}
            statementSummaries={statementSummaries}
            statementSummariesLoading={statementSummariesLoading}
            getLumpSumAmountData={getLumpSumAmountData}
            lumpSumpData={lumpSumpData}
            scoresBackend={scoresBackend}
            setScoresBackend={setScoresBackend}
            optionStats={optionStats}
            setOptionStats={setOptionStats}
            cashFlow={cashFlow}
            cashFlowLoading={cashFlowLoading}
            tabValue={tabValue}
            setTabValue={setTabValue}
            setPaymentData={setPaymentData}
            selectedCreditorDetails={selectedCreditorDetails}
            caseData={caseData}
            mcaByMonth={mcaByMonth}
            setMcaByMonth={setMcaByMonth}
            to={caseData?.creditor?.basicInformation?.email}
            creditorInfo={
              allCreditorNames[tabValue] === "Summary"
                ? "Summary"
                : selectedCreditorDetails?.name
            }
            payableAmount={
              allCreditorNames[tabValue] === "Summary"
                ? summaryAmount?.payableAmount
                : selectedCreditorDetails?.contractDetails?.payable_amount
            }
            selectedCreditor={allCreditorNames[tabValue]}
            paymentData={paymentData}
            showEmailAgreement={showEmailAgreement}
            handleClose={handleClose}
          />
        )}
        {activeTab === 1 && (
          <CaseById
            id={id}
            loading={loading}
            caseData={caseData}
            GetCaseDetails={GetCaseDetails}
            handleOpen={handleOpen}
            style={style}
            handleClicked={handleClicked}
            notesLoading={notesLoading}
            caseHistoryTabs={caseHistoryTabs}
            setCaseHistoryTabs={setCaseHistoryTabs}
            tabs={tabs}
            filteredLogs={filteredLogs}
            value={value}
            handleChange={handleChange}
            verifiedSenders={verifiedSenders}
            GetLogsById={GetLogsById}
            isPaymentLoading={isPaymentLoading}
            paymentDetails={paymentDetails}
            handleClose={handleClose}
            addTaskModal={addTaskModal}
            handleChangeModal={handleChangeModal}
            open={open}
            isChecked={isChecked}
            handleToggle={handleToggle}
            GetCasePaymentDetails={GetCasePaymentDetails}
            currentPaymentPage={currentPaymentPage}
            setCurrentPaymentPage={setCurrentPaymentPage}
            totalPaymentPage={totalPaymentPage}
            showEmail={showEmail}
            from={caseData?.creditor?.basicInformation?.email}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default CaseDetail;
