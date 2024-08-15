import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Grid,
  Box,
  Typography,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import JSZip from "jszip";
import AlertDialog from "../editFileNamePopUp";
import { styles } from "./FileUploadComponent.styles";
import FileViewer from "./FileViewer";
import ScrollbarStyles from "../../customScroll";

const FileUploadComponent = ({
  files,
  setFiles,
  selectedFiles,
  setSelectedFiles,
}) => {
  const [selectedFileForViewing, setSelectedFileForViewing] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleDropForUploadFiles = async (acceptedFiles) => {
    const processedFiles = await processFiles(acceptedFiles);
    setFiles((prevFiles) => [...prevFiles, ...processedFiles]);
    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...processedFiles?.filter(
        (file) =>
          file?.path?.toLowerCase().includes("mca") ||
          file?.name?.toLowerCase().includes("mca")
      ),
    ]);
  };

  const processFiles = async (acceptedFiles) => {
    const processedFiles = [];

    await Promise.all(
      acceptedFiles?.map(async (file) => {
        if (file?.name === ".DS_Store") return;
        if (file?.type === "application/zip") {
          const zipFiles = await getFilesFromZip(file);
          processedFiles?.push(...zipFiles);
        } else {
          processedFiles?.push({
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
          file: zipEntry?.asUint8Array(), // Convert zip entry to binary data
        });
      }
    });

    return filesArray;
  };

  const handleEditFileName = (index, newName) => {
    const file = files[index];
    const fileExtension = file?.name?.split(".").pop();
    const newFileName = `${newName}.${fileExtension}`;
    const newPath = file?.path?.replace(file?.name, newFileName);
    setFiles((prevFiles) =>
      prevFiles?.map((f, i) =>
        i === index ? { ...f, name: newFileName, path: newPath } : f
      )
    );
  };

  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles?.filter((_, i) => i !== index));
    setSelectedFiles((prevFiles) => prevFiles?.filter((_, i) => i !== index));
  };

  const handleCheckboxChange = (file, checked) => {
    setSelectedFiles((prevSelectedFiles) =>
      checked
        ? [...prevSelectedFiles, file]
        : prevSelectedFiles?.filter((f) => f !== file)
    );
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

  const handleViewFile = (file) => {
    setSelectedFileForViewing(file);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedFileForViewing(null);
  };

  return (
    <>
      <Grid container>
        <Typography sx={styles.headerText}>Documents</Typography>
      </Grid>

      <Grid container item xs={10} md={12} lg={5.5} sx={styles.uploadContainer}>
        <Typography sx={styles.headerText}>Upload Folder or File</Typography>

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
              webkitdirectory=""
              directory=""
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

      <Grid item sx={{ marginTop: "1rem" }}>
        <Typography sx={styles.headerText}>List of Documents</Typography>
        <Paper
          sx={{
            borderRadius: "10px",
            width: { xs: "65vw", md: "100%" },
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
                  <TableCell sx={styles.selectColumn}>
                    <Typography sx={styles.tableHeader}>Select</Typography>
                  </TableCell>
                  <TableCell sx={styles.titleColumn}>
                    <Typography sx={styles.tableHeader}>Title</Typography>
                  </TableCell>
                  <TableCell sx={styles.typeColumn}>
                    <Typography sx={styles.tableHeader}>Type</Typography>
                  </TableCell>
                  <TableCell sx={styles.pathColumn}>
                    <Typography sx={styles.tableHeader}>Path</Typography>
                  </TableCell>
                  <TableCell sx={styles.actionsColumn}>
                    <Typography sx={styles.tableHeader}>Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files?.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell sx={styles.checkboxCell}>
                      <Checkbox
                        checked={selectedFiles?.includes(file)}
                        onChange={(e) =>
                          handleCheckboxChange(file, e.target.checked)
                        }
                      />
                    </TableCell>
                    <TableCell sx={styles.pathFontSize}>{file?.name}</TableCell>
                    <TableCell sx={styles.pathFontSize}>{file?.type}</TableCell>
                    <TableCell sx={styles.pathCell}>
                      <Typography sx={styles.pathText} title={file?.name}>
                        {file?.path}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={styles.actionIcons}>
                        <VisibilityIcon
                          onClick={() => handleViewFile(file?.file)}
                          sx={styles.viewIcon}
                        />
                        <AlertDialog
                          initialFileName={file?.name}
                          handleEditFileName={(newName) =>
                            handleEditFileName(index, newName)
                          }
                        />
                        <CloseIcon
                          onClick={() => handleDeleteFile(index)}
                          sx={styles.icon}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      {isViewerOpen && (
        <FileViewer file={selectedFileForViewing} onClose={handleCloseViewer} />
      )}
    </>
  );
};

export default FileUploadComponent;
