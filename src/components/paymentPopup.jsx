import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Grid, Typography } from "@mui/material";

import PaymentDetails from "./caseCreation/paymentDetails";
import PaymentProcess from "./radioPayment";
import TextButton from "./button";
import { Colors } from "../config/default";
import { GetWeeklyAndTotalCommission, UpdateCase } from "../services/services";
import { useToast } from "../toast/toastContext";
import { calculateNextWeek } from "../common";
import { FONT_SIZE_LARGE, FONT_SIZE_XL } from "../constants/appConstants";

export default function PaymentPopup({
  data,
  handleClose,
  GetCaseDetails,
  GetCasePaymentDetails,
  settlementRange,
  weeksTillPaid,
  caseId,
  remainingAmount,
  closePopup,
  commissionRange,
}) {
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [totalCommission, setTotalCommission] = useState("");
  const [commission, setCommission] = useState("");
  const [commissionPercentage, setCommissionPercentage] = useState("");
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [feePayment, setFeePayment] = useState(data?.feePayment || "toPay");
  const [totalAmount, setTotalAmount] = useState();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { id } = useParams();
  const today = new Date().toISOString().split("T")[0];
  const [isExempt, setIsExempt] = useState(data?.isExempt || false);
  const [newDataList, setNewDataList] = useState([
    {
      amount: settlementRange || "",
      startDate: weeksTillPaid ? calculateNextWeek() : today,
      timePeriod: weeksTillPaid ? "Weekly" : "Custom",
      frequency: weeksTillPaid || 1,
    },
  ]);

  const calculateTotalAmount = (data) => {
    let total = 0;
    data.forEach((item) => {
      const frequency = item.frequency || 1;
      total += item.amount * frequency;
    });
    return total;
  };

  useEffect(() => {
    const newTotal = calculateTotalAmount(newDataList);
    setTotalAmount(newTotal);
  }, [newDataList]);

  useEffect(() => {
    if (data && data?.intervals?.length !== 0) {
      const filteredData = data.intervals.map(({ _id, ...rest }) => rest);
      setNewDataList(filteredData);
    }
  }, [data]);

  const calculateTotalCommission = async () => {
    setCommissionLoading(true);
    if (feePayment === "toPay") {
      const payload = {
        intervals: newDataList,
      };
      const updateCaseId = caseId || data?._id;
      const response = await GetWeeklyAndTotalCommission(payload, updateCaseId);
      if (response?.status === 200) {
        showToast(response?.data?.message, "success");
        setTotalCommission(response?.data?.data?.totalCommission);
        setCommissionPercentage(response?.data?.data?.commissionPercentage);
        if (commissionRange) {
          setCommission(commissionRange);
        } else {
          setCommission(response?.data?.data?.commission);
        }
        setSaveDisabled(true);
      } else {
        const errorMessage = response?.response?.data?.message;
        showToast(errorMessage, "error");
        setSaveDisabled(false);
      }
    }
    setCommissionLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const params = {
      intervals: newDataList,
      feePayment: feePayment,
      isExempt: isExempt,
      totalCommission: feePayment === "toPay" ? totalCommission : 0,
      commission: feePayment === "toPay" ? commission : 0,
    };
    const updateCaseId = caseId || data?._id;
    const resCaseUpdate = await UpdateCase(params, updateCaseId);
    if (resCaseUpdate?.status === 200) {
      showToast(resCaseUpdate?.data?.message, "success");
      GetCaseDetails && GetCaseDetails(id);
      GetCasePaymentDetails && GetCasePaymentDetails(id);
      handleClose();
      closePopup && closePopup();
    } else {
      const errorMessage = resCaseUpdate?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  let remaining =
    remainingAmount && remainingAmount.replace("$", "").replace(",", "");

  const inputStyling = {
    backgroundColor: Colors.BG_LIGHT_GRAY,
    height: "2.5rem",
    color: Colors.DIM_LIGHT_GRAY,
    paddingLeft: "1rem",
    border: "none",
    outline: "none",
    borderRadius: "5px",
    width: "12rem",
  };

  return (
    <div>
      <Typography
        sx={{
          fontFamily: "Nunito",
          fontWeight: "600",
        }}
      >
        Settlement Plan Automation
      </Typography>
      <Typography
        sx={{
          fontSize: FONT_SIZE_LARGE,
          fontFamily: "Nunito",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        Total amount after given interval: $
        {isNaN(totalAmount) ? 0 : totalAmount?.toFixed(2)}
      </Typography>
      {saveDisabled && feePayment === "toPay" && (
        <Typography
          sx={{
            fontSize: FONT_SIZE_LARGE,
            fontFamily: "Nunito",
            marginRight: "10px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          Commission is calculated using this percentage:
          {commissionPercentage}%
        </Typography>
      )}

      <PaymentDetails
        remainingAmount={remaining || data?.remaining}
        newDataList={newDataList}
        setNewDataList={setNewDataList}
        totalAmount={totalAmount}
        isExempt={isExempt}
      />
      {saveDisabled && feePayment === "toPay" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginLeft: "4%",
            marginTop: "10px",
          }}
        >
          <Typography
            sx={{
              fontSize: FONT_SIZE_XL,
              fontFamily: "Nunito",
              marginRight: "10px",
            }}
          >
            Total Commission
          </Typography>
          <input
            type="text"
            placeholder="Total Commission"
            style={inputStyling}
            value={
              totalCommission !== null && totalCommission !== undefined
                ? `$${totalCommission}`
                : "$0"
            }
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, "");
              setTotalCommission(value);
            }}
          />
          <Typography
            sx={{
              fontSize: FONT_SIZE_XL,
              fontFamily: "Nunito",
              marginRight: "10px",
            }}
          >
            Weekly Commission
          </Typography>
          <input
            type="text"
            placeholder="Commission"
            style={inputStyling}
            value={
              commission !== null && commission !== undefined
                ? `$${commission}`
                : "$0"
            }
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, "");
              setCommission(value);
            }}
          />
        </div>
      )}

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <input
          type="checkbox"
          checked={isExempt}
          onChange={() => setIsExempt(!isExempt)}
          style={{ appearance: "radio" }}
        />
        <Typography
          sx={{
            fontSize: FONT_SIZE_LARGE,
            fontFamily: "Nunito",
            fontWeight: "700",
          }}
        >
          Exempt
        </Typography>
      </div>
      <PaymentProcess feePayment={feePayment} setFeePayment={setFeePayment} />

      <Grid container sx={{ mt: "1rem", justifyContent: "right", gap: "10px" }}>
        {feePayment === "toPay" && (
          <TextButton
            buttonText="Calculate Commission"
            height="2rem"
            width="14rem"
            onClick={calculateTotalCommission}
            backgroundColor={Colors.SKY_BLUE}
            hoverColor={Colors.SKY_BLUE}
            loading={commissionLoading}
          />
        )}

        <TextButton
          buttonText="Save"
          height="2rem"
          width="8rem"
          onClick={handleUpdate}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
          disabled={!saveDisabled && feePayment === "toPay"}
        />
      </Grid>
    </div>
  );
}
