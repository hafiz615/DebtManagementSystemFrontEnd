import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import TextButton from "./../../components/button";
import { Colors } from "../../config/default";

const lineStyle = {
  width: "100%",
  height: "1px",
  backgroundColor: "#EAEBEB",
  margin: "1rem 0",
};

export default function ExportPipeline({ handleClose, data }) {
  const [selectedFormat, setSelectedFormat] = useState("csv/excel");
  const [selectedField, setSelectedField] = useState("All Fields");

  const handleChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const handleFieldChange = (event) => {
    setSelectedField(event.target.value);
  };

  const handleDownload = () => {
    let dataConvert = "";
    let fileName = "";

    if (selectedFormat === "csv/excel") {
      dataConvert = convertToCSV(data);
      fileName = "Pipeline_Data.csv";

      handleClose();
    } else if (selectedFormat === "json") {
      dataConvert = JSON.stringify(data, null, 2);
      fileName = "Pipeline_Data.txt";

      handleClose();
    }

    const blob = new Blob([dataConvert], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (data) => {
    let csvContent = "";

    const statusNames = Object.keys(data);

    csvContent +=
      "Status, Case Name, Annualized Value, Debtor Name, Debtor Company Name, Debtor Business Category, Debtor Address, Debtor EIN, Debtor City, Debtor Phone, Debtor State, Debtor Zip Code, Creditor Name, Creditor Company Name, Creditor Business Category, Last Payment Date, Paid Amount, Remaining, Total Debt, Confidence, Manager, Negotiator, Status\n";

    statusNames.forEach((statusName) => {
      data[statusName].cases.forEach((caseItem) => {
        const caseName = caseItem.caseCode || "";
        const annualizedValue = caseItem.totalDebt || "";
        const debtorName = caseItem.debtor?.basicInformation?.fullName || "";
        const debtorCompanyName =
          caseItem.debtor?.businessInformation?.companyName || "";
        const debtorBusinessCategory =
          caseItem.debtor?.businessInformation?.businessCategory || "";
        const debtorAddress =
          caseItem.debtor?.businessInformation?.address || "";
        const debtorEIN = caseItem.debtor?.businessInformation?.EIN || "";
        const debtorCity = caseItem.debtor?.businessInformation?.city || "";
        const debtorPhone = caseItem.debtor?.businessInformation?.phone || "";
        const debtorState = caseItem.debtor?.businessInformation?.state || "";
        const debtorZipCode =
          caseItem.debtor?.businessInformation?.zipCode || "";
        const creditorName =
          caseItem.creditor?.basicInformation?.fullName || "";
        const creditorCompanyName =
          caseItem.creditor?.businessInformation?.companyName || "";
        const creditorBuisnessCategory =
          caseItem.creditor?.businessInformation?.businessCategory || "";
        const lastPaymentDate = caseItem.lastPaymentDate || "";
        const paidAmount = caseItem.paidAmount || "";
        const remaining = caseItem.remaining || "";
        const totalDebt = caseItem.totalDebt || "";
        const confidence = caseItem.confidence || "0";
        const manager = caseItem.manager || "";
        const negotiator = caseItem.negotiator || "";
        const status = caseItem.status || "";

        csvContent += `${statusName}, ${caseName}, ${annualizedValue}, ${debtorName},${debtorCompanyName},${debtorBusinessCategory},${debtorAddress},${debtorEIN},${debtorCity},${debtorPhone},${debtorState},${debtorZipCode}, ${creditorName},${creditorCompanyName},${creditorBuisnessCategory}, ${lastPaymentDate}, ${paidAmount}, ${remaining}, ${totalDebt} , ${confidence} ,${manager} , ${negotiator},${status} \n`;
      });
    });

    return csvContent;
  };

  return (
    <>
      <Grid item>
        <Typography
          sx={{ fontWeight: "500", fontFamily: "Nunito", color: Colors.BLACK }}
        >
          Export
        </Typography>
        <Box sx={lineStyle} />
      </Grid>
      <Box>
        <p
          style={{
            fontWeight: "700",
            fontFamily: "Nunito",
            color: Colors.BLACK,
          }}
        >
          Choose what you’d like to export
        </p>
        <Box sx={lineStyle} />
        <div>
          <FormControl component="fieldset">
            <p
              style={{
                fontWeight: "700",
                fontFamily: "Nunito",
                color: Colors.BLACK,
              }}
            >
              Choose The Format
            </p>
            <RadioGroup
              aria-label="format"
              name="format"
              value={selectedFormat}
              onChange={handleChange}
            >
              <FormControlLabel
                value="csv/excel"
                control={<Radio />}
                label="CSV/Excel"
              />
              <FormControlLabel value="json" control={<Radio />} label="JSON" />
            </RadioGroup>
          </FormControl>
        </div>
        <FormControl component="fieldset">
          <p
            style={{
              fontWeight: "700",
              fontFamily: "Nunito",
              color: Colors.BLACK,
            }}
          >
            What Should The Export Include
          </p>
          <RadioGroup
            aria-label="format"
            name="format"
            value={selectedField}
            onChange={handleFieldChange}
          >
            <FormControlLabel
              value="All Fields"
              control={<Radio />}
              label="All Fields"
            />
            <FormControlLabel
              value="Common Fields"
              control={<Radio />}
              label="Common Fields"
            />
          </RadioGroup>
        </FormControl>

        <Box sx={lineStyle} />
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
      >
        <TextButton
          buttonText="CANCEL"
          height="2rem"
          marginRight="1rem"
          width="6rem"
          onClick={handleClose}
          backgroundColor={Colors.ORANGE_COLOR}
          hoverColor={Colors.ORANGE_COLOR}
        />
        <TextButton
          buttonText="EXPORT"
          height="2rem"
          width="6rem"
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          onClick={handleDownload}
        />
      </Box>
    </>
  );
}
