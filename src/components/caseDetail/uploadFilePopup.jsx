import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Grid, Box, Typography, Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { styles } from "../caseCreation/FileUploadComponent/FileUploadComponent.styles";
import { InsertDriveFile, DeleteOutlineOutlined } from "@mui/icons-material";
import { Colors } from "../../config/default";
import TextButton from "../button";
import { isEmpty } from "lodash";
import { AddDocumentToDebtor, UploadFiles } from "../../services/services";
import { useParams } from "react-router-dom";
import { useToast } from "../../toast/toastContext";
import { FONT_SIZE_LARGE } from "../../constants/appConstants";

function UploadFilePopup({ handleClose, GetCaseDetails }) {
  const { showToast } = useToast();
  const [bankFiles, setBankFiles] = useState([]);
  const [mcaFiles, setMcaFiles] = useState([]);
  const [otherFiles, setOtherFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const handleDropForUploadBankFiles = async (acceptedFiles) => {
    setBankFiles(acceptedFiles);
  };
  const handleDropForUploadMcaFiles = async (acceptedFiles) => {
    setMcaFiles(acceptedFiles);
  };
  const handleDropForUploadOtherFiles = async (acceptedFiles) => {
    setOtherFiles(acceptedFiles);
  };

  const removeFile = (fileName, type) => {
    let filteredFile;
    if (type === "bank") {
      filteredFile = bankFiles?.filter((file) => file.name !== fileName);
      setBankFiles(filteredFile);
    } else if (type === "mca") {
      filteredFile = mcaFiles?.filter((file) => file.name !== fileName);
      setMcaFiles(filteredFile);
    } else {
      filteredFile = otherFiles?.filter((file) => file.name !== fileName);
      setOtherFiles(filteredFile);
    }
  };

  const {
    getRootProps: getBankRootPropsUpload,
    getInputProps: getBankPropsUpload,
  } = useDropzone({
    onDrop: handleDropForUploadBankFiles,
    noClick: true,
    noKeyboard: true,
    multiple: true,
  });

  const {
    getRootProps: getMcaRootPropsUpload,
    getInputProps: getMcaPropsUpload,
  } = useDropzone({
    onDrop: handleDropForUploadMcaFiles,
    noClick: true,
    noKeyboard: true,
    multiple: true,
  });

  const {
    getRootProps: getOtherRootPropsUpload,
    getInputProps: getOtherPropsUpload,
  } = useDropzone({
    onDrop: handleDropForUploadOtherFiles,
    noClick: true,
    noKeyboard: true,
    multiple: true,
  });

  const params = {
    bankStatementDocuments: [],
    mcaDocuments: [],
    otherDocuments: [],
  };

  const handleUpload = async () => {
    setLoading(true);
    if (bankFiles?.length > 0) {
      const result = await UploadFiles(bankFiles);
      if (result?.status === 200) {
        params.bankStatementDocuments = result?.data?.data;
      }
    }
    if (mcaFiles?.length > 0) {
      const result = await UploadFiles(mcaFiles);
      if (result?.status === 200) {
        params.mcaDocuments = result?.data?.data;
      }
    }
    if (otherFiles?.length > 0) {
      const result = await UploadFiles(otherFiles);
      if (result?.status === 200) {
        params.otherDocuments = result?.data?.data;
      }
    }
    uploadFileWithSignedUrl();
  };

  const uploadFileWithSignedUrl = async () => {
    const addDebtor = await AddDocumentToDebtor(id, params);
    if (addDebtor?.status === 200) {
      showToast(addDebtor?.data?.message, "success");
      handleClose();
      GetCaseDetails(id);
    } else {
      showToast(addDebtor?.response?.data?.message, "error");
    }
    setLoading(false);
  };

  return (
    <Grid container>
      <Grid container item xs={12}>
        <Typography sx={{ ...styles.headerText, marginBottom: "10px" }}>
          Upload Files
        </Typography>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {["Bank Statements", "MCA", "Other"]?.map((label, index) => (
            <Grid
              key={index}
              container
              item
              xs={10}
              md={12}
              lg={3.75}
              sx={styles.uploadContainer}
            >
              <Typography
                sx={{
                  ...styles.headerText,
                  textAlign: "center",
                  mb: "10px",
                }}
              >
                Upload {label}
              </Typography>

              <Box
                sx={styles.uploadBox}
                {...(label === "MCA"
                  ? getMcaRootPropsUpload()
                  : label === "Other"
                  ? getOtherRootPropsUpload()
                  : getBankRootPropsUpload())}
              >
                <input
                  {...(label === "MCA"
                    ? getMcaPropsUpload()
                    : label === "Other"
                    ? getOtherPropsUpload()
                    : getBankPropsUpload())}
                  type="file"
                  webkitdirectory=""
                  directory=""
                  multiple
                  style={{ display: "none" }}
                  id={`file-upload-${index}`}
                />
                <label htmlFor={`file-upload-${index}`}>
                  <UploadIcon sx={styles.uploadIcon} />
                  <Typography sx={styles.uploadText}>
                    Click or Drag to Upload
                  </Typography>
                </label>
              </Box>
            </Grid>
          ))}
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: ".5rem" }}>
        <Grid
          sx={{
            height: "8rem",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#E5E5E5",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: Colors.WHITE,
              borderRadius: "8px",
            },
          }}
        >
          {bankFiles?.length === 0 &&
          mcaFiles?.length === 0 &&
          otherFiles?.length === 0 ? (
            <Grid sx={{ textAlign: "center", color: Colors.DIM_LIGHT_GRAY }}>
              <h5>No Files</h5>
            </Grid>
          ) : (
            <>
              {bankFiles?.length > 0 && (
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    display: "flex",
                    alignItems: "center",
                    m: "10px 0px",
                  }}
                >
                  <InsertDriveFile /> Bank Statements
                </Typography>
              )}

              {bankFiles?.map((data, i) => (
                <Grid
                  item
                  key={`bank-${i}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "1rem",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid item sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2">{data?.name}</Typography>
                  </Grid>

                  {!bankFiles?.isUploading && (
                    <DeleteOutlineOutlined
                      sx={{ color: Colors.ORANGE_COLOR, cursor: "pointer" }}
                      onClick={() => removeFile(data?.name, "bank")}
                    />
                  )}
                </Grid>
              ))}
              {mcaFiles?.length > 0 && (
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    display: "flex",
                    alignItems: "center",
                    m: "10px 0px",
                  }}
                >
                  <InsertDriveFile /> MCA's
                </Typography>
              )}
              {mcaFiles?.map((data, i) => (
                <Grid
                  item
                  key={`mca-${i}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "1rem",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid item sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2">{data?.name}</Typography>
                  </Grid>

                  {!mcaFiles?.isUploading && (
                    <DeleteOutlineOutlined
                      sx={{ color: Colors.ORANGE_COLOR, cursor: "pointer" }}
                      onClick={() => removeFile(data?.name, "mca")}
                    />
                  )}
                </Grid>
              ))}
              {otherFiles?.length > 0 && (
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontFamily: "Nunito",
                    fontSize: FONT_SIZE_LARGE,
                    display: "flex",
                    alignItems: "center",
                    m: "10px 0px",
                  }}
                >
                  <InsertDriveFile /> Others
                </Typography>
              )}
              {otherFiles?.map((data, i) => (
                <Grid
                  item
                  key={`other-${i}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "1rem",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid item sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2">{data?.name}</Typography>
                  </Grid>

                  {!otherFiles?.isUploading && (
                    <DeleteOutlineOutlined
                      sx={{ color: Colors.ORANGE_COLOR, cursor: "pointer" }}
                      onClick={() => removeFile(data?.name, "other")}
                    />
                  )}
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TextButton
          disabled={
            loading ||
            (!bankFiles.length > 0 &&
              !mcaFiles.length > 0 &&
              !otherFiles.length > 0)
          }
          buttonText="Upload"
          height="2rem"
          width="8rem"
          onClick={handleUpload}
          backgroundColor={Colors.SKY_BLUE}
          hoverColor={Colors.SKY_BLUE}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
}

export default UploadFilePopup;
