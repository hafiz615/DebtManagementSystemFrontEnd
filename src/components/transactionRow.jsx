import React from "react";
import { isEmpty } from "lodash";
import { Colors } from "../config/default";
import { Typography } from "@mui/material";
import { formatDollarAmount } from "../common";

function TransactionRow({ data, heading }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };
  const typographyStyle = {
    fontSize: "11px",
    fontFamily: "Nunito",
    fontWeight: "500",
    width: "25%",
  };
  return (
    <>
      {!isEmpty(data) && heading && (
        <Typography
          sx={{
            color: Colors.BLACK,
            fontWeight: "700",
            fontFamily: "Nunito",
          }}
        >
          {heading}
        </Typography>
      )}
      {data?.map((item, index) => {
        const colorScheme =
          item?.type === "authorization" && item?.authorized === "Failed"
            ? Colors.ORANGE_COLOR
            : item?.type === "payment" && item?.captured === "Failed"
            ? Colors.ORANGE_COLOR
            : Colors.SKY_BLUE;
        return (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: heading ? Colors.BLACK : colorScheme,
            }}
          >
            <p style={typographyStyle}>{formatDate(item?.dueDate) || "-"}</p>
            <p style={typographyStyle}>
              {formatDollarAmount(item?.totalDebt) || "-"}
            </p>
            <p style={typographyStyle}>
              {heading ? item?.status || "-" : item?.type || "-"}
            </p>
          </div>
        );
      })}
    </>
  );
}

export default TransactionRow;
