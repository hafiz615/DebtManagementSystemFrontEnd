import React, { useEffect, useState } from "react";
import { Grid, Box, Button, Checkbox } from "@mui/material";
import { Colors } from "../../config/default";
import MuiModels from "../models";
import { RemoveRedEye } from "@mui/icons-material";
import ScrollbarStyles from "../customScroll";
import { handleDeleteFile } from "../../services/services";
import { useToast } from "../../toast/toastContext";
import Prompt from "../prompt";

function CaseFileCard({
  caseData,
  GetCaseDetails,
  caseDataId,
  lawfirmCancelPlan,
  lawfirmIntervals,
  getAttorneyData,
}) {
  const [url, setUrl] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { showToast } = useToast();
  const [fileToDelete, setFileToDelete] = useState(null);
  const bankDocuments = caseData?.debtor?.bankStatementDocuments || [];
  const mcaDocuments = caseData?.debtor?.mcaDocuments || [];
  const otherDocuments = caseData?.debtor?.otherDocuments || [];
  const lawsuitDocuments = caseData?.debtor?.lawsuitDocuments || [];

  const handleFileView = (url) => {
    setUrl(url);
    setIsViewerOpen(true);
  };

  const deleteHandler = async (type) => {
    const fileType =
      type === "Bank Statements"
        ? "bankStatementDocuments"
        : type === "MCA's"
        ? "mcaDocuments"
        : type === "Lawsuit"
        ? "lawsuitDocuments"
        : "otherDocuments";
    const response = await handleDeleteFile(
      fileToDelete?.key,
      caseDataId,
      fileType
    );
    if (response.status === 200) {
      GetCaseDetails(caseDataId);
      showToast(response?.data?.message, "success");
    } else {
      showToast("An error occurred while deleting the file", "error");
    }
  };

  const handleCloseViewer = () => {
    setUrl("");
    setIsViewerOpen(false);
  };

  const handleFileSelect = (item) => {
    setSelectedFiles((prevSelected) => {
      if (prevSelected.some((file) => file?.key === item?.key)) {
        return prevSelected.filter((file) => file?.key !== item?.key);
      } else {
        return [
          ...prevSelected,
          { key: item?.key, originalFileName: item?.originalFileName },
        ];
      }
    });
  };

  const renderFiles = (files, label) => (
    <>
      {files?.length > 0 && (
        <>
          <p
            style={{
              fontWeight: "600",
              fontSize: "13px",
              fontFamily: "Nunito",
              margin: "0.5rem 0",
              color: Colors.DARK_GRAY,
            }}
          >
            {label}
          </p>
          {files?.map((item, index) => (
            <Grid
              item
              xs={12}
              container
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: index % 2 === 0 ? Colors.WHITE : Colors.VIOLET,
                paddingRight: ".2rem",
                paddingLeft: ".2rem",
                height: "2rem",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: Colors.DIM_LIGHT_GRAY,
                  fontWeight: "700",
                  fontFamily: "Nunito",
                  fontSize: "11px",
                }}
              >
                {item?.originalFileName}
              </span>
              <Grid item sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  sx={{
                    "&.Mui-checked": {
                      color: Colors.SKY_BLUE,
                    },
                    color: Colors.DIM_LIGHT_GRAY,
                    padding: "0",
                    marginRight: "0.5rem",
                  }}
                  checked={selectedFiles.some((file) => file.key === item?.key)}
                  onChange={() => handleFileSelect(item)}
                />
                <RemoveRedEye
                  sx={{ color: Colors.SKY_BLUE, cursor: "pointer" }}
                  onClick={() => handleFileView(item?.url)}
                />
                <Prompt
                  text="Are you sure you want to delete this file"
                  heading="Delete File"
                  deleting="delete File"
                  deleteHandler={() => deleteHandler(label)}
                  item={item}
                  setFileToDelete={setFileToDelete}
                />
              </Grid>
            </Grid>
          ))}
        </>
      )}
    </>
  );

  const hasNoFiles =
    bankDocuments?.length === 0 &&
    mcaDocuments?.length === 0 &&
    otherDocuments?.length === 0 &&
    lawsuitDocuments?.length === 0;

  return (
    <Grid
      item
      xs={12}
      sx={{
        backgroundColor: Colors.WHITE,
        borderRadius: "10px",
        padding: "0px 10px",
        height: "14rem",
        marginBottom: "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontWeight: "600",
            fontSize: "13px",
            fontFamily: "Nunito",
          }}
        >
          Files
        </p>
        <Box sx={{ marginTop: "0.5rem" }}>
          <MuiModels
            show="uploadFile"
            height="max-content"
            GetCaseDetails={GetCaseDetails}
            lawfirmCancelPlan={lawfirmCancelPlan}
            lawfirmIntervals={lawfirmIntervals}
            getAttorneyData={getAttorneyData}
          />
        </Box>
      </div>
      <Grid
        container
        sx={{
          overflowY: "auto",
          ...ScrollbarStyles,
          height: "10rem",
        }}
      >
        {renderFiles(mcaDocuments, "MCA's")}
        {renderFiles(bankDocuments, "Bank Statements")}
        {renderFiles(lawsuitDocuments, "Lawsuit")}
        {renderFiles(otherDocuments, "Others")}

        {hasNoFiles && (
          <Grid item xs={12} sx={{ textAlign: "center", marginTop: "2rem" }}>
            <p
              style={{
                color: Colors.DIM_LIGHT_GRAY,
                fontFamily: "Nunito",
                fontSize: "13px",
              }}
            >
              No files available.
            </p>
          </Grid>
        )}

        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: ".8rem",
            marginTop: ".8rem",
            position: "sticky",
            bottom: 0,
            zIndex: 1,
          }}
        >
          <MuiModels
            show="extractFiles"
            buttonName="extractFiles"
            height="80vh"
            width="80vw"
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            caseDataId={caseDataId}
            caseData={caseData}
            GetCaseDetails={GetCaseDetails}
            disabled={hasNoFiles}
          />
        </Grid>
      </Grid>

      {isViewerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <Button
            onClick={handleCloseViewer}
            style={{
              position: "fixed",
              top: "5rem",
              right: "1rem",
              backgroundColor: "white",
              border: "none",
              borderRadius: "4px",
              padding: "0.5rem",
              cursor: "pointer",
              zIndex: 1100,
            }}
          >
            Close
          </Button>
          {url ? (
            <iframe
              title="document"
              src={url}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                position: "relative",
              }}
            />
          ) : (
            <p style={{ color: "white" }}>Loading...</p>
          )}
        </div>
      )}
    </Grid>
  );
}

export default CaseFileCard;
