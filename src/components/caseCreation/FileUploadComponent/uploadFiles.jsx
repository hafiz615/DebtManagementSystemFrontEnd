import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Grid,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import JSZip from "jszip";
import AlertDialog from "../editFileNamePopUp";
import { styles } from "./FileUploadComponent.styles";
import FileViewer from "./FileViewer";
import ScrollbarStyles from "../../customScroll";
import { Colors } from "../../../config/default";
import useMediaQuery from "@mui/material/useMediaQuery";
import { truncateText } from "../../../common";
import CircularProgressWithLabel from "./circularLabel";
import { isEmpty } from "lodash";
import { FONT_SIZE_LARGE } from "../../../constants/appConstants";
import { InsertDriveFile } from "@mui/icons-material";

const FileUploadComponent = ({
  files,
  setFiles,
  selectedFiles,
  setSelectedFiles,
  otherFiles,
  setOtherFiles,
  lawsuitFiles,
  setLawsuitFiles,
  progress,
  loading,
}) => {
  const [selectedFileForViewing, setSelectedFileForViewing] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const smallToMediumScreen = useMediaQuery(
    "(min-width:290px) and (max-width:1020px)"
  );
  const truncateValue = smallToMediumScreen ? 20 : 70;

  const handleDropForUploadFiles = useCallback(async (acceptedFiles) => {
    try {
      const processedFiles = await processFiles(acceptedFiles);
      setFiles((prevFiles) => [...prevFiles, ...processedFiles]);
    } catch (error) {
      console.error("Error processing uploaded files:", error);
    }
  }, []);

  const handleDropMcaFiles = useCallback(async (acceptedFiles) => {
    try {
      const processedFiles = await processFiles(acceptedFiles);
      setSelectedFiles((prevSelectedFiles) => [
        ...prevSelectedFiles,
        ...processedFiles,
      ]);
    } catch (error) {
      console.error("Error processing uploaded files:", error);
    }
  }, []);

  const handleDropOtherFiles = useCallback(async (acceptedFiles) => {
    try {
      const processedFiles = await processFiles(acceptedFiles);
      setOtherFiles((prevFiles) => [...prevFiles, ...processedFiles]);
    } catch (error) {
      console.error("Error processing uploaded files:", error);
    }
  }, []);

  const handleDropLawsuitFiles = useCallback(async (acceptedFiles) => {
    try {
      const processedFiles = await processFiles(acceptedFiles);
      setLawsuitFiles((prevFiles) => [...prevFiles, ...processedFiles]);
    } catch (error) {
      console.error("Error processing uploaded files:", error);
    }
  }, []);

  const processFiles = async (acceptedFiles) => {
    const processedFiles = [];
    await Promise.all(
      acceptedFiles?.map(async (file) => {
        if (file?.name === ".DS_Store") return;
        if (file?.type === "application/zip") {
          try {
            const zipFiles = await getFilesFromZip(file);
            processedFiles.push(...zipFiles);
          } catch (error) {
            console.error("Error extracting zip file:", error);
          }
        } else {
          processedFiles.push({
            name: file?.name,
            type: file?.type,
            path: file?.path,
            file,
          });
        }
      })
    );
    return processedFiles;
  };

  const getFilesFromZip = async (file) => {
    const zip = new JSZip();
    const zipFile = await zip.loadAsync(file);
    const filesArray = [];

    zipFile.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir) {
        filesArray.push({
          name: zipEntry?.name,
          type: zipEntry?.name?.split(".").pop(),
          path: relativePath,
          file: zipEntry?.async("uint8array"), // Convert zip entry to Uint8Array
        });
      }
    });

    return filesArray;
  };

  const handleEditFileName = useCallback(
    (index, newName, type) => {
      const file =
        type === "bank"
          ? files[index]
          : type === "mca"
          ? selectedFiles[index]
          : type === "lawsuit"
          ? lawsuitFiles[index]
          : otherFiles[index];
      const fileExtension = file?.name?.split(".").pop();
      const newFileName = `${newName}.${fileExtension}`;
      const newPath = file?.path?.replace(file?.name, newFileName);
      setFiles((prevFiles) =>
        prevFiles.map((f, i) =>
          i === index ? { ...f, name: newFileName, path: newPath } : f
        )
      );
    },
    [files]
  );

  const handleDeleteFile = useCallback((index, type) => {
    type === "bank"
      ? setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
      : type === "mca"
      ? setSelectedFiles((prevSelectedFiles) =>
          prevSelectedFiles.filter((_, i) => i !== index)
        )
      : type === "lawsuit"
      ? setLawsuitFiles((prevSelectedFiles) =>
          prevSelectedFiles.filter((_, i) => i !== index)
        )
      : setOtherFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  const { getRootProps: getRootPropsBank, getInputProps: getInputPropsBank } =
    useDropzone({
      onDrop: handleDropForUploadFiles,
      noClick: true,
      noKeyboard: true,
      multiple: true,
    });

  const { getRootProps: getRootPropsMca, getInputProps: getInputPropsMca } =
    useDropzone({
      onDrop: handleDropMcaFiles,
      noClick: true,
      noKeyboard: true,
      multiple: true,
    });

  const {
    getRootProps: getRootPropsOthers,
    getInputProps: getInputPropsOthers,
  } = useDropzone({
    onDrop: handleDropOtherFiles,
    noClick: true,
    noKeyboard: true,
    multiple: true,
  });

  const {
    getRootProps: getRootPropsLawsuit,
    getInputProps: getInputPropsLawsuit,
  } = useDropzone({
    onDrop: handleDropLawsuitFiles,
    noClick: true,
    noKeyboard: true,
    multiple: true,
  });

  const handleViewFile = useCallback((file) => {
    setSelectedFileForViewing(file);
    setIsViewerOpen(true);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setIsViewerOpen(false);
    setSelectedFileForViewing(null);
  }, []);

  const FileSection = ({ title, files, type }) => {
    if (!files?.length) return null;

    return (
      <>
        <Typography
          sx={{
            fontWeight: "600",
            fontFamily: "Nunito",
            fontSize: FONT_SIZE_LARGE,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            m: "10px",
          }}
        >
          <InsertDriveFile /> {title}
        </Typography>
        {files.map((file, index) => (
          <TableRow key={index}>
            <TableCell sx={styles.pathCell}>
              <Typography sx={styles.pathText} title={file?.type}>
                {truncateText(file?.type, truncateValue)}
              </Typography>
            </TableCell>
            <TableCell sx={styles.pathDataCell}>
              <Typography sx={styles.pathText} title={file?.path}>
                {truncateText(file?.path, truncateValue)}
              </Typography>
            </TableCell>
            <TableCell>
              <Box sx={styles.actionIcons}>
                <VisibilityIcon
                  sx={{
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    color: Colors.DARK_GRAY,
                  }}
                  onClick={() => handleViewFile(file?.file)}
                />
                <AlertDialog
                  initialFileName={file?.name}
                  handleEditFileName={(newName) =>
                    handleEditFileName(index, newName, type)
                  }
                />
                <CloseIcon
                  onClick={() => handleDeleteFile(index, type)}
                  sx={{
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    color: Colors.ORANGE_COLOR,
                  }}
                />
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <>
      {loading && !isEmpty(selectedFiles) ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "55vh",
          }}
        >
          <CircularProgressWithLabel
            loading={loading}
            value={progress}
            size={140}
            labelSize="1.5rem"
            color={Colors.SKY_BLUE}
            backgroundColor="#f5f5f5"
          />
        </Box>
      ) : (
        <>
          <Grid container>
            <Typography sx={styles.headerText}>Documents</Typography>
          </Grid>
          <Grid xs={12} item container sx={{ justifyContent: "space-between" }}>
            {["Bank Statements", "MCA", "Lawsuit", "Other"]?.map(
              (label, index) => (
                <Grid
                  key={index}
                  container
                  item
                  xs={12}
                  md={5.75}
                  lg={2.75}
                  sx={styles.uploadContainer}
                >
                  <Typography
                    sx={{
                      ...styles.headerText,
                      textAlign: "center",
                      m: "10px 0px",
                    }}
                  >
                    Upload {label} File or Folder
                  </Typography>

                  <Box
                    sx={styles.uploadBox}
                    {...(label === "MCA"
                      ? getRootPropsMca()
                      : label === "Other"
                      ? getRootPropsOthers()
                      : label === "Lawsuit"
                      ? getRootPropsLawsuit()
                      : getRootPropsBank())}
                  >
                    <input
                      {...(label === "MCA"
                        ? getInputPropsMca()
                        : label === "Other"
                        ? getInputPropsOthers()
                        : label === "Lawsuit"
                        ? getInputPropsLawsuit()
                        : getInputPropsBank())}
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
              )
            )}
          </Grid>

          <Grid xs={12} item sx={{ marginTop: "1rem" }}>
            <Typography sx={styles.headerText}>List of Documents</Typography>
            <Paper
              sx={{
                borderRadius: "10px",
                width: "100%",
              }}
            >
              <TableContainer
                component={Paper}
                sx={{
                  marginTop: "1rem",
                  height: "50vh",
                  overflow: "auto",
                  ...ScrollbarStyles,
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={styles.typeColumn}>
                        <Typography sx={styles.tableHeader}>Type</Typography>
                      </TableCell>
                      <TableCell sx={styles.pathColumn}>
                        <Typography sx={styles.tableHeader}>
                          File Name
                        </Typography>
                      </TableCell>
                      <TableCell sx={styles.actionsColumn}>
                        <Typography sx={styles.tableHeader}>Actions</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <FileSection
                      title="Bank Statements"
                      files={files}
                      type="bank"
                    />
                    <FileSection
                      title="MCA's"
                      files={selectedFiles}
                      type="mca"
                    />
                    <FileSection
                      title="Lawsuit Files"
                      files={lawsuitFiles}
                      type="lawsuit"
                    />
                    <FileSection
                      title="Others"
                      files={otherFiles}
                      type="other"
                    />
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </>
      )}

      {isViewerOpen && (
        <FileViewer file={selectedFileForViewing} onClose={handleCloseViewer} />
      )}
    </>
  );
};

export default FileUploadComponent;
