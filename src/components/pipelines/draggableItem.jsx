import React from "react";
import { useDrag } from "react-dnd";
import { useSelector } from "react-redux";

import { IconButton, Typography } from "@mui/material";
import { Difference, RemoveRedEye } from "@mui/icons-material";

import { Colors } from "../../config/default";
import MuiModels from "../models";
import Prompt from "../prompt";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";
import { CreateCase, DeleteCase } from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { useNavigate } from "react-router-dom";
import { formatAmountValue } from "../../common";

const DraggableItem = ({ item, columnId, GetAllPipelineDetail }) => {
  const generalPermissions = useSelector(
    (state) => state?.permissions?.permissions?.generalPermissions
  );
  const { showToast } = useToast();

  const [{ isDragging }, drag] = useDrag({
    type: "ITEM",
    item: { ...item, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const debtorBasicInfoItem = item?.debtor?.basicInformation;
  const debtorbusinessInfoItem = item?.debtor?.businessInformation;
  const creditorBasicInfoItem = item?.creditor?.basicInformation;
  const creditorbusinessInfoItem = item?.creditor?.businessInformation;
  const modifiedIntervalArray = item?.intervals?.map(
    ({ _id, ...rest }) => rest
  );
  const allDocuments = item?.documents?.map((item) => item);
  const debtorContacts = item?.debtor?.contacts?.map((item) => item);

  const creditorContacts = item?.creditor?.contacts?.map((item) => item);

  const handleDuplicate = async () => {
    const params = {
      debtor: {
        basicInformation: {
          fullName: debtorBasicInfoItem?.fullName,
          email: debtorBasicInfoItem?.email,
          SSID: debtorBasicInfoItem?.SSID,
          status: debtorBasicInfoItem?.status,
          state: debtorBasicInfoItem?.state,
          city: debtorBasicInfoItem?.city,
          zipCode: debtorBasicInfoItem?.zipCode,
          phone: debtorBasicInfoItem?.phone,
          address: debtorBasicInfoItem?.address,
          weeklyBudget: debtorBasicInfoItem?.weeklyBudget || "",
        },
        businessInformation: {
          companyName: debtorbusinessInfoItem?.companyName,
          EIN: debtorbusinessInfoItem?.EIN,
          businessCategory: debtorbusinessInfoItem?.businessCategory,
          description: debtorbusinessInfoItem?.description,
          state: debtorbusinessInfoItem?.state,
          city: debtorbusinessInfoItem?.city,
          zipCode: debtorbusinessInfoItem?.zipCode,
          phone: debtorbusinessInfoItem?.phone,
          address: debtorbusinessInfoItem?.address,
        },
        contacts: debtorContacts,
      },
      // paymentToken: item?.paymentToken,
      // paymentType: item?.paymentType,
      creditor: {
        basicInformation: {
          fullName: creditorBasicInfoItem?.fullName,
          email: creditorBasicInfoItem?.email,
          phone: creditorBasicInfoItem?.phone,
        },
        businessInformation: {
          companyName: creditorbusinessInfoItem?.companyName,
          businessCategory: creditorbusinessInfoItem?.businessCategory,
        },
        notes: item?.creditor?.notes,
        creditorSecurityKey: item?.creditor?.creditorSecurityKey,
        lastFundedDate: item?.creditor?.lastFundedDate,
        historicalRange: {
          minimum: item?.creditor?.historicalRange?.minimum,
          maximum: item?.creditor?.historicalRange?.maximum,
        },
        contacts: creditorContacts,
      },
      status: item?.status,
      totalDebt: parseInt(item?.totalDebt),
      feePayment: item?.feePayment,
      lastPaymentDate: item?.lastPaymentDate,
      paidAmount: parseInt(item?.paidAmount),
      remaining: parseInt(item?.remaining),
      documents: allDocuments || [],
      intervals: modifiedIntervalArray || [],
      confidence: item?.confidence,
    };
    const resCreateCase = await CreateCase(params, false);
    if (resCreateCase?.status === 201) {
      GetAllPipelineDetail(false);
    }
  };

  const handleDelete = async () => {
    const DeleteRes = await DeleteCase(item?._id);
    if (DeleteRes?.status === 200) {
      showToast(DeleteRes?.data?.message, "success");
      GetAllPipelineDetail(true);
    } else {
      const errorMessage = DeleteRes?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  const opacity = isDragging ? 0.5 : 1;

  const navigate = useNavigate();
  const handleClick = (id) => {
    localStorage.setItem("route", "all-cases");
    navigate(`/all-cases/${id}`);
  };
  return (
    <div
      ref={drag}
      onClick={
        generalPermissions?.viewCaseDetails
          ? () => handleClick(item?._id)
          : null
      }
      style={{
        opacity,
        backgroundColor: isDragging ? Colors.LIGHT_BLUE_COLOR : Colors.WHITE,
        margin: "10px",
        padding: "10px",
        borderRadius: "10px",
        cursor: generalPermissions?.viewCaseDetails ? "pointer" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: FONT_SIZE_LARGE,
            fontFamily: "Nunito",
            fontWeight: "700",
          }}
        >
          {item?.caseCode}
        </Typography>
        <div onClick={(e) => e.stopPropagation()} style={{ display: "flex" }}>
          <MuiModels
            item={item}
            show="editPipelineCase"
            button="create"
            iconSize="1rem"
            GetAllPipelineDetail={GetAllPipelineDetail}
          />
          <Prompt
            heading="Delete Pipeline"
            text={`Are you sure you want to Delete ${item?.caseCode}?`}
            handleDelete={handleDelete}
            item={item?._id}
            iconSize="1rem"
          />
          <IconButton onClick={handleDuplicate}>
            <Difference sx={{ fontSize: "1rem" }} />
          </IconButton>
        </div>
      </div>
      <div>
        <Typography
          sx={{ fontSize: FONT_SIZE_LARGE, fontFamily: "Nunito", mb: "5px" }}
        >
          {item?.negotiator}
        </Typography>
      </div>

      <div>
        <Typography
          sx={{ fontSize: FONT_SIZE_LARGE, fontFamily: "Nunito", mb: "5px" }}
        >
          {debtorbusinessInfoItem?.companyName}
        </Typography>
      </div>
      <div>
        <Typography
          sx={{ fontSize: FONT_SIZE_LARGE, fontFamily: "Nunito", mb: "5px" }}
        >
          ${formatAmountValue(item?.remaining)}
        </Typography>
      </div>
      <div>
        <Typography
          sx={{ fontSize: FONT_SIZE_LARGE, fontFamily: "Nunito", mb: "5px" }}
        >
          {creditorBasicInfoItem?.fullName}
        </Typography>
      </div>
      {/* <div>
        <Typography
          sx={{
            fontSize: FONT_SIZE_LARGE,
            fontFamily: "Nunito",
            color: Colors.DIM_LIGHT_GRAY,
          }}
        >
          {item?.confidence}
        </Typography>
      </div> */}
    </div>
  );
};

export default DraggableItem;
