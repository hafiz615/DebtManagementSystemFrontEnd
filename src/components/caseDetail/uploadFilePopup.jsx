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

function UploadFilePopup({ handleClose, GetCaseDetails }) {
  const { showToast } = useToast();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const handleDropForUploadFiles = async (acceptedFiles) => {
    setFiles(acceptedFiles);
  };
  const removeFile = (fileName) => {
    const filteredFile = files.filter((file) => file.name !== fileName);
    setFiles(filteredFile);
  };
  const {
    getRootProps: getRootPropsUpload,
    getInputProps: getInputPropsUpload,
  } = useDropzone({
    onDrop: handleDropForUploadFiles,
    noClick: true,
    noKeyboard: true,
    multiple: true, // Ensure multiple files can be handled
  });
  const handleUpload = async () => {
    setLoading(true);
    if (files) {
      const result = await UploadFiles(files);
      if (result?.status === 200) {
        const params = {
          documents: result?.data?.data,
        };
        const addDebtor = await AddDocumentToDebtor(id, params);
        if (addDebtor?.status === 200) {
          showToast(result?.data?.message, "success");
          handleClose();
          GetCaseDetails(id);
        } else {
          showToast(addDebtor?.response?.data?.message, "error");
        }
      } else {
        const errorMessage = result?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    }
    setLoading(false);
  };
  return (
    <Grid container>
      <Grid container item xs={12}>
        <Typography sx={{ ...styles.headerText, marginBottom: "1rem" }}>
          Upload Files
        </Typography>
        <Box sx={styles.uploadBox}>
          <Grid
            container
            item
            xs={12}
            sx={styles.dropzone}
            {...getRootPropsUpload()}
          >
            <input
              {...getInputPropsUpload()}
              type="file"
              multiple // Allow selecting multiple files/folders
              style={{ display: "none" }} // Hide the input element
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <UploadIcon sx={styles.uploadIcon} />
              <Typography sx={styles.uploadText}>
                Click or Drag to Upload
              </Typography>
            </label>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: ".5rem" }}>
        <Grid
          sx={{
            height: "8rem",
            overflowY: files?.length > 3 ? "scroll" : "",
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
          {files?.length === 0 ? (
            <Grid sx={{ textAlign: "center", color: Colors.DIM_LIGHT_GRAY }}>
              <h5>No Files</h5>
            </Grid>
          ) : (
            files &&
            files?.map((data, i) => (
              <Grid
                item
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "1rem",
                  justifyContent: "space-between",
                }}
              >
                <Grid item sx={{ display: "flex", alignItems: "center" }}>
                  <InsertDriveFile sx={{ color: Colors.NAVY_BLUE }} />
                  <Typography variant="body2">{data?.name}</Typography>
                </Grid>

                {!files?.isUploading && (
                  <DeleteOutlineOutlined
                    sx={{ color: Colors.ORANGE_COLOR, cursor: "pointer" }}
                    onClick={() => {
                      removeFile(data?.name);
                    }}
                  />
                )}
              </Grid>
            ))
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TextButton
          disabled={loading || isEmpty(files)}
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
