import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Divider,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Close,
  ExpandMore,
  ExpandLess,
  Edit,
  Delete,
} from "@mui/icons-material";
import {
  DeleteCheckDetails,
  GetCheckDetails,
  UpdateCheckIds,
} from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { Colors } from "../../config/default";
import { isEmpty } from "lodash";
import { formatDollarAmount } from "../../common";
import ScrollbarStyles from "../customScroll";
import Button from "../button";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_SMALL,
  FONT_SIZE_XL,
  REACT_APP_SECURITY_KEY,
} from "../../constants/appConstants";
import Prompt from "../prompt";
import { encrypt } from "n-krypta";

const textFieldStyling = {
  backgroundColor: Colors.BG_LIGHT_GRAY,
  height: "2.5rem",
  color: Colors.DIM_LIGHT_GRAY,
  paddingLeft: "1rem",
  outline: "none",
  border: "1px solid transparent",
  borderRadius: "5px",
  marginBottom: "1rem",
  width: "100%",
  fontFamily: "Nunito",
};

export default function SeeCheckDetails({
  handleClose,
  GetCaseDetails,
  caseData,
}) {
  const [checkedPayments, setCheckedPayments] = useState(null);
  const [checkDetailsPayements, setCheckDetailsPayements] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedIndices, setExpandedIndices] = useState();
  const [expandEdit, setExpandEdit] = useState({});

  const [paymentDetails, setPaymentDetails] = useState([]);

  const { showToast } = useToast();

  const GetCheckDetailsPayements = async () => {
    setCheckDetailsPayements(true);
    const response = await GetCheckDetails(caseData?.debtor?._id);
    if (response?.status === 200) {
      setCheckedPayments(response?.data?.data);
    } else if (response?.response?.status === 400) {
      const errorMessage = response?.response?.data?.message;
      showToast(errorMessage, "error");
    }
    setCheckDetailsPayements(false);
  };

  useEffect(() => {
    GetCheckDetailsPayements();
  }, []);

  const toggleExpand = () => {
    setExpandedIndices(!expandedIndices);
  };
  const toggleUpdateExpand = (index) => {
    setExpandEdit((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const handleUpdate = async (checkId, index) => {
    const { firstName, lastName, bankAccount, bankRouting } =
      paymentDetails[index];

    const params = {
      checkId: checkId,
    };
    const checkParams = {
      firstName: firstName || "--",
      lastName: lastName || "--",
      bankAccount: bankAccount || "--",
      bankRouting: bankRouting || "--",
    };

    const encryptedData = encrypt(checkParams, REACT_APP_SECURITY_KEY);
    params.data = encryptedData;

    try {
      setLoading(true);
      const AddCheckPaymentRes = await UpdateCheckIds(
        params,
        caseData?.debtor?._id
      );

      if (AddCheckPaymentRes?.status === 200) {
        showToast(AddCheckPaymentRes?.data?.message, "success");
        handleClose();
        GetCaseDetails(caseData?._id);
      } else if (AddCheckPaymentRes?.response?.status === 400) {
        const errorMessage = AddCheckPaymentRes?.response?.data?.message;
        showToast(errorMessage, "error");
      }
      setLoading(false);
    } catch (error) {
      showToast(
        "An error occurred while updating the payment details.",
        "error"
      );
    }
  };

  const isPaymentFormValid = (index) => {
    const isBankAccountValid =
      paymentDetails[index]?.bankAccount?.length === 4 ||
      (paymentDetails[index]?.bankAccount?.length > 4 &&
        paymentDetails[index]?.bankAccount?.length <= 17);

    const isBankRoutingValid = paymentDetails[index]?.bankRouting?.length === 9;
    return (
      paymentDetails[index]?.firstName &&
      paymentDetails[index]?.lastName &&
      paymentDetails[index]?.bankAccount &&
      paymentDetails[index]?.bankRouting &&
      isBankAccountValid &&
      isBankRoutingValid
    );
  };

  return (
    <>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontFamily: "Nunito", mb: "1rem", fontWeight: "600" }}
        >
          Check Details
        </Typography>
        <Close onClick={handleClose} />
      </Grid>
      {checkDetailsPayements ? (
        <Grid
          xs={12}
          sx={{
            height: "15rem",
            alignItems: "center",
            justifyContent: "center",
          }}
          container
          item
        >
          <CircularProgress sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : (
        <Grid
          sx={{
            overflowY: "auto",
            ...ScrollbarStyles,
          }}
        >
          {Object?.entries(checkedPayments || {})?.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Nunito",
                  color: Colors.BLACK,
                  fontWeight: "600",
                }}
              >
                No Data Available
              </Typography>
            </div>
          ) : (
            Object?.entries(checkedPayments || {})?.map(
              ([key, payment], index) => (
                <div key={key}>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontFamily: "Nunito" }}
                    >{`Payment ID: ${key}`}</Typography>

                    <div>
                      <IconButton>
                        <Edit
                          sx={{ fontSize: FONT_SIZE_XL }}
                          onClick={() => toggleUpdateExpand(index)}
                        />
                      </IconButton>
                      <Prompt
                        text="Are you sure you want to delete this check"
                        heading="Delete File"
                        deleting="checkIds"
                        checkId={payment?.checkInfo?.checkId}
                        GetCaseDetails={GetCaseDetails}
                        caseData={caseData}
                      />
                      <IconButton onClick={() => toggleExpand()}>
                        {expandedIndices ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </div>
                  </Grid>

                  <Grid xs={12} container sx={{ m: "10px 0px" }}>
                    <Grid item xs={3}>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_MEDIUM,
                        }}
                      >
                        <strong>Basic Verification:</strong>{" "}
                        {payment?.checkInfo?.basicVerification || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_MEDIUM,
                        }}
                      >
                        <strong>Fund Confirmation Reason</strong>{" "}
                        {payment?.checkInfo?.fcReason || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_MEDIUM,
                        }}
                      >
                        <strong>Funds Confirmation:</strong>{" "}
                        {payment?.checkInfo?.fundsConfirmation || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography
                        sx={{
                          fontFamily: "Nunito",
                          fontSize: FONT_SIZE_MEDIUM,
                        }}
                      >
                        <strong>Status:</strong>{" "}
                        {payment?.checkInfo?.status || "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                  {expandEdit[index] && (
                    <Grid
                      container
                      item
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          width: "48%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <label
                          htmlFor="firstName"
                          style={{
                            fontFamily: "Nunito",
                            fontSize: FONT_SIZE_LARGE,
                          }}
                        >
                          First Name*
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={paymentDetails[index]?.firstName || ""}
                          onChange={(e) =>
                            setPaymentDetails((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                firstName: e.target.value,
                              },
                            }))
                          }
                          placeholder="Enter First Name"
                          style={textFieldStyling}
                        />
                      </div>
                      <div
                        style={{
                          width: "48%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <label
                          htmlFor="lastName"
                          style={{
                            fontFamily: "Nunito",
                            fontSize: FONT_SIZE_LARGE,
                          }}
                        >
                          Last Name*
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          value={paymentDetails[index]?.lastName || ""}
                          onChange={(e) =>
                            setPaymentDetails((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                lastName: e.target.value,
                              },
                            }))
                          }
                          placeholder="Enter Last Name"
                          style={textFieldStyling}
                        />
                      </div>
                      <div
                        style={{
                          width: "48%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <label
                          htmlFor="bankAccount"
                          style={{
                            fontFamily: "Nunito",
                            fontSize: FONT_SIZE_LARGE,
                          }}
                        >
                          Bank Account*
                        </label>
                        <input
                          id="bankAccount"
                          type="text"
                          value={paymentDetails[index]?.bankAccount || ""}
                          onChange={(e) =>
                            setPaymentDetails((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                bankAccount: e.target.value,
                              },
                            }))
                          }
                          placeholder="Enter Bank Account"
                          style={textFieldStyling}
                        />
                        {paymentDetails[index]?.bankAccount &&
                          !(
                            paymentDetails[index]?.bankAccount?.length === 4 ||
                            (paymentDetails[index]?.bankAccount?.length > 4 &&
                              paymentDetails[index]?.bankAccount?.length <= 17)
                          ) && (
                            <Typography
                              sx={{
                                color: "red",
                                fontSize: FONT_SIZE_SMALL,
                                fontFamily: "Nunito",
                                marginBottom: "0.5rem",
                              }}
                            >
                              Bank Account must be between 4 and 17 characters.
                            </Typography>
                          )}
                      </div>
                      <div
                        style={{
                          width: "48%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <label
                          htmlFor="bankRouting"
                          style={{
                            fontFamily: "Nunito",
                            fontSize: FONT_SIZE_LARGE,
                          }}
                        >
                          Bank Routing*
                        </label>
                        <input
                          id="bankRouting"
                          type="text"
                          value={paymentDetails[index]?.bankRouting || ""}
                          onChange={(e) =>
                            setPaymentDetails((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                bankRouting: e.target.value,
                              },
                            }))
                          }
                          placeholder="Enter Bank Routing"
                          style={textFieldStyling}
                        />
                        {paymentDetails[index]?.bankRouting &&
                          paymentDetails[index]?.bankRouting.length !== 9 && (
                            <Typography
                              sx={{
                                color: "red",
                                fontSize: FONT_SIZE_SMALL,
                                fontFamily: "Nunito",
                                marginBottom: "0.5rem",
                              }}
                            >
                              Bank Routing must be 9 characters.
                            </Typography>
                          )}
                      </div>
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          buttonText="Update"
                          width="8rem"
                          onClick={() =>
                            handleUpdate(payment?.checkInfo?.checkId, index)
                          }
                          backgroundColor={Colors.SKY_BLUE}
                          hoverColor={Colors.SKY_BLUE}
                          disabled={!isPaymentFormValid(index)}
                        />
                      </Grid>
                    </Grid>
                  )}

                  {expandedIndices && (
                    <Grid direction="row">
                      {payment?.payments?.length > 0 ? (
                        payment?.payments?.map((row, rowIndex) => (
                          <Grid key={rowIndex} container>
                            <Grid item xs={3}>
                              <Typography
                                sx={{
                                  fontFamily: "Nunito",
                                  fontSize: FONT_SIZE_MEDIUM,
                                }}
                              >
                                <strong>Amount:</strong>{" "}
                                {formatDollarAmount(row?.amount) || "-"}
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography
                                sx={{
                                  fontFamily: "Nunito",
                                  fontSize: FONT_SIZE_MEDIUM,
                                }}
                              >
                                <strong>Transaction Type:</strong>{" "}
                                {row?.transactionType || "--"}
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography
                                sx={{
                                  fontFamily: "Nunito",
                                  fontSize: FONT_SIZE_MEDIUM,
                                }}
                              >
                                <strong>Due Date:</strong>{" "}
                                {new Date(row?.dueDate)?.toLocaleDateString() ||
                                  "--"}
                              </Typography>
                            </Grid>
                          </Grid>
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Nunito",
                            color: Colors.BLACK,
                            mt: 1,
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                          }}
                        >
                          No more data
                        </Typography>
                      )}
                    </Grid>
                  )}

                  <Divider sx={{ my: 2 }} />
                </div>
              )
            )
          )}
        </Grid>
      )}
    </>
  );
}
