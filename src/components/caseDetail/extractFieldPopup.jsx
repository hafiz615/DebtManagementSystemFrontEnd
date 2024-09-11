import React, { useEffect } from "react";
import { useState } from "react";
import { ExtractedCaseFields } from "../../services/services";
import { useToast } from "../../toast/toastContext";
import { CircularProgress, Grid } from "@mui/material";
import { Colors } from "../../config/default";
import EditDebtorDetails from "./../editDebtorDetails";

function ExtractFieldPopup({
  selectedFiles,
  setSelectedFiles,
  caseDataId,
  data,
  GetCaseDetails,
  connectPayment,
  setConnectPayment,
  handleClose,
}) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [showComponent, setShowComponent] = useState(true);
  const [caseData, setCaseData] = useState({});
  const ExtractFields = async () => {
    setLoading(true);
    const params = {
      documents: selectedFiles,
    };
    const extractRes = await ExtractedCaseFields(caseDataId, params);

    if (extractRes?.status === 200) {
      showToast(extractRes?.data?.message, "success");
      setCaseData(extractRes?.data?.data?.extracted_fields[0]);
    } else {
      showToast(
        extractRes?.response?.data?.message || extractRes?.data?.message,
        "error"
      );
    }
    setLoading(false);
  };
  useEffect(() => {
    ExtractFields();
  }, []);
  return (
    <div>
      {loading ? (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
          }}
        >
          <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : (
        <>
          {showComponent ? (
            <EditDebtorDetails
              handleClose={handleClose}
              caseData={caseData}
              GetCaseDetails={GetCaseDetails}
              connectPayment={connectPayment}
              setConnectPayment={setConnectPayment}
              data={data}
              showFields={true}
              showComponent={showComponent}
              setShowComponent={setShowComponent}
            />
          ) : (
            <div>hello</div>
          )}
        </>
      )}
    </div>
  );
}

export default ExtractFieldPopup;
