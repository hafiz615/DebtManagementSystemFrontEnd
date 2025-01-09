// Asd123<>?
import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Colors } from "../../config/default";
import { Grid } from "@mui/material";

import { styled } from "@mui/material/styles";
import TransactionDetails from "../caseDetail/transactionDetail";
import { GetAllTransactions } from "../../services/services";
const StyledAccordion = styled(Accordion)({
  "&:before": {
    display: "none",
  },
  width: "100%",
  borderRadius: "1rem !important",
  backgroundColor: Colors.WHITE,
  marginTop: "1rem",
  boxShadow: "none",
});
const StyledAccordionSummary = styled(AccordionSummary)({
  fontFamily: "Nunito",
  fontWeight: "600",
  borderTopRightRadius: "1rem",
  borderTopLeftRadius: "1rem",
  borderBottomLeftRadius: "1rem",
  borderBottomRightRadius: "1rem",
  borderBottom: "1px solid #EAEBEB",
});

const StyledAccordionDetails = styled(AccordionDetails)({
  borderTop: "none",
});
export default function TransactionAccordion() {
  const [paymentDetails, setPaymentDetails] = useState({});
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const [totalPaymentPage, setTotalPaymentPage] = useState();

  const getCommissionPayments = async () => {
    setIsPaymentLoading(true);
    const response = await GetAllTransactions(currentPaymentPage);
    if (response?.status === 200) {
      setPaymentDetails(response?.data?.data);
      let totalPage = Math.ceil(
        response?.data?.data?.transactions?.totalCount / 10
      );
      setTotalPaymentPage(totalPage);
    } else if (
      response?.response?.status === 401 ||
      response?.response?.status === 403
    ) {
      localStorage.clear();
      navigate("/");
    }
    setIsPaymentLoading(false);
  };

  useEffect(() => {
    getCommissionPayments();
  }, [currentPaymentPage]);

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Transactions
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <TransactionDetails
          loading={isPaymentLoading}
          paymentDetails={paymentDetails}
          getCommissionPayments={getCommissionPayments}
          hideTransferPayment={true}
          currentPaymentPage={currentPaymentPage}
          setCurrentPaymentPage={setCurrentPaymentPage}
          totalPaymentPage={totalPaymentPage}
        />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
