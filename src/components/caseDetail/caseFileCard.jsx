import React, { useEffect, useState } from "react";
import { Grid, Box, Button, Checkbox } from "@mui/material";
import { Colors } from "../../config/default";
import MuiModels from "../models";
import { RemoveRedEye } from "@mui/icons-material";
import ScrollbarStyles from "../customScroll";
import { handleDeleteFile } from "../../services/services";
import { useToast } from "../../toast/toastContext";
import Prompt from "../prompt";

function CaseFileCard({ caseData, GetCaseDetails, caseDataId }) {
  const [url, setUrl] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { showToast } = useToast();
  const [documents, setDocuments] = useState(caseData?.debtor?.documents);
  const [fileToDelete, setFileToDelete] = useState(null);

  const handleFileView = (url) => {
    setUrl(url);
    setIsViewerOpen(true);
  };

  useEffect(() => {}, [documents.length]);
  const deleteHandler = async () => {
    const response = await handleDeleteFile(fileToDelete?.key, caseDataId);

    if (response.status === 200) {
      const filterDoc = documents.filter(
        (doc) => doc?.key !== fileToDelete?.key
      );
      setDocuments(filterDoc);
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

  const mcaFiles = documents?.filter((doc) =>
    doc?.originalFileName?.toLowerCase().includes("mca")
  );
  const bankStatements = documents?.filter(
    (item) => !item?.originalFileName?.toLowerCase().includes("mca")
  );

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
                {/* <IconButton
                  onClick={() => handleClickOpen(item)} 
                  color="error"
                >
                  <Delete />
                  
                </IconButton> */}
                <Prompt
                  text="Are you sure you want to delete this file"
                  heading="Delete File"
                  deleting="delete File"
                  deleteHandler={() => deleteHandler()}
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

  const hasFiles = documents.length > 0;

  return (
    <Grid
      item
      xs={12}
      sx={{
        backgroundColor: Colors.WHITE,
        borderRadius: "10px",
        padding: "0px 10px",
        height: "13rem",
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
        {renderFiles(mcaFiles, "MCA Files")}
        {renderFiles(bankStatements, "Bank Statements")}

        {documents?.length === 0 && (
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
            disabled={!hasFiles}
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
