import React from "react";
import { useDropzone } from "react-dropzone";
import { Grid, Box } from "@mui/material/";
import Typography from "@mui/material/Typography";
import { Colors } from "../../config/default";
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import JSZip from "jszip";
import AlertDialog from "./editFileNamePopUp";
import {
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_SMALL,
} from "../../constants/appConstants";
import Dropdown from "../dropdown";

const menuItems = [
  { label: "Upload All Files", value: "Upload All Files" },
  { label: "Extract Files", value: "Extract Files" },
];

const FileUploadComponent = ({
  setUploadedFiles,
  files,
  setFiles,
  setAllFiles,
}) => {
  const handleDropForExtractFiles = async (acceptedFiles) => {
    setUploadedFiles(acceptedFiles);
    await handleFiles(acceptedFiles, setFiles);
  };

  const handleDropForUploadFiles = async (acceptedFiles) => {
    setAllFiles(acceptedFiles);
    await handleFiles(acceptedFiles, setFiles);
  };

  const handleFiles = async (acceptedFiles, setFiles) => {
    await Promise.all(
      acceptedFiles.map(async (file) => {
        if (file.type === "application/zip") {
          const zipFiles = await getFilesFromZip(file);
          setFiles((prevFiles) => [...prevFiles, ...zipFiles]);
        } else {
          setFiles((prevFiles) => [
            ...prevFiles,
            { name: file.name, type: file.type, path: file.path },
          ]);
        }
      })
    );
  };

  const getFilesFromZip = async (file) => {
    const zip = new JSZip();
    const zipFile = await zip.loadAsync(file);
    const filesArray = [];

    zipFile.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir) {
        filesArray.push({
          name: zipEntry.name,
          type: zipEntry.name.split(".").pop(),
          path: relativePath,
        });
      }
    });

    return filesArray;
  };

  const handleEditFileName = (index, newName) => {
    const file = files[index];
    const fileExtension = file.name.split(".").pop();
    const newFileName = `${newName}.${fileExtension}`;
    const newPath = file.path.replace(file.name, newFileName);
    setFiles((prevFiles) =>
      prevFiles.map((f, i) =>
        i === index ? { ...f, name: newFileName, path: newPath } : f
      )
    );
  };

  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((file, i) => i !== index));
  };

  const handleViewDocument = (path) => {
    window.open(path, "_blank");
  };

  const {
    getRootProps: getRootPropsExtract,
    getInputProps: getInputPropsExtract,
    isDragActive: isDragActiveExtract,
  } = useDropzone({ onDrop: handleDropForExtractFiles });

  const {
    getRootProps: getRootPropsUpload,
    getInputProps: getInputPropsUpload,
    isDragActive: isDragActiveUpload,
  } = useDropzone({ onDrop: handleDropForUploadFiles });

  const getTruncatedText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <>
      <Grid container>
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            width: "40%",
            color: Colors.BLACK,
          }}
        >
          Documents
        </Typography>
      </Grid>

      <Grid container sx={{ justifyContent: "space-between" }}>
        <Grid
          container
          item
          xs={12}
          lg={5.5}
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1.5rem",
            backgroundColor: Colors.WHITE,
            padding: "1rem",
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "600",
              width: "40%",
              color: Colors.BLACK,
            }}
          >
            Extract Files Documents
          </Typography>

          <Box
            sx={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              marginTop: "0.5rem",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              borderRadius: "10px",
              height: "20vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              item
              xs={12}
              sx={{
                backgroundColor: Colors.WHITE,
                marginTop: ".5rem",
                marginBottom: ".5rem",
                height: "40px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              {...getRootPropsExtract()}
            >
              <input {...getInputPropsExtract()} />
              <UploadIcon sx={{ color: Colors.DIM_LIGHT_GRAY }} />
            </Grid>
          </Box>
        </Grid>
        <Grid
          container
          item
          xs={12}
          lg={5.5}
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1.5rem",
            backgroundColor: Colors.WHITE,
            padding: "1rem",
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "600",
              width: "40%",
              color: Colors.BLACK,
            }}
          >
            Upload Files Documents
          </Typography>

          <Box
            sx={{
              backgroundColor: Colors.BG_LIGHT_GRAY,
              marginTop: "0.5rem",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              borderRadius: "10px",
              height: "20vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              item
              xs={12}
              sx={{
                backgroundColor: Colors.WHITE,
                marginTop: ".5rem",
                marginBottom: ".5rem",
                height: "40px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              {...getRootPropsUpload()}
            >
              <input {...getInputPropsUpload()} />
              <UploadIcon sx={{ color: Colors.DIM_LIGHT_GRAY }} />
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Grid item sx={{ marginTop: "1rem" }}>
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "600",
            width: "40%",
            color: Colors.BLACK,
          }}
        >
          List of Documents
        </Typography>
        <Grid
          item
          xs={12}
          sx={{
            height: "300px",
            marginTop: "1rem",
            backgroundColor: Colors.WHITE,
            padding: "1rem",
            borderRadius: "10px",
            justifyContent: "space-between",
            gap: { xs: "3px", sm: "auto" },
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: Colors.ORANGE_COLOR,
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: Colors.BG_LIGHT_GRAY,
              borderRadius: "8px",
            },
            display: "flex",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                width: "40%",
                color: Colors.BLACK,
                fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
              }}
            >
              Title
            </Typography>
            {files.map((file, index) => (
              <Typography
                key={index}
                sx={{
                  marginTop: "0.5rem",
                  fontFamily: "Nunito",
                  fontWeight: "400",
                  color: Colors.DARK_GRAY,
                }}
              >
                <Typography
                  sx={{
                    textTransform: "none",
                    color: Colors.BLUE_COLOR,
                    fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
                  }}
                >
                  {getTruncatedText(file.name, 20)}
                </Typography>
              </Typography>
            ))}
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                width: "40%",
                color: Colors.BLACK,
                fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
              }}
            >
              Type
            </Typography>
            {files.map((file, index) => (
              <Typography
                key={index}
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: "400",
                  color: Colors.DARK_GRAY,
                  marginTop: "0.5rem",
                  fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
                }}
              >
                {getTruncatedText(file.type, 20)}
              </Typography>
            ))}
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                width: "40%",
                color: Colors.BLACK,
                fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
              }}
            >
              Path
            </Typography>
            {files.map((file, index) => (
              <Typography
                key={index}
                sx={{
                  marginTop: "0.5rem",
                  fontFamily: "Nunito",
                  fontWeight: "400",
                  color: Colors.DARK_GRAY,
                  fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
                }}
              >
                {getTruncatedText(file.path, 40)}
              </Typography>
            ))}
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontWeight: "600",
                width: "40%",
                color: Colors.BLACK,
                fontSize: { xs: FONT_SIZE_SMALL, sm: FONT_SIZE_LARGE },
              }}
            >
              Actions
            </Typography>
            {files.map((file, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: { xs: "2px", sm: "0.5rem" } }}
              >
                <AlertDialog
                  initialFileName={file.name}
                  handleEditFileName={(newName) =>
                    handleEditFileName(index, newName)
                  }
                />
                <CloseIcon
                  onClick={() => handleDeleteFile(index)}
                  sx={{
                    color: Colors.ORANGE_COLOR,
                    marginTop: "0.5rem",
                    fontSize: { xs: FONT_SIZE_SMALL, sm: "1.2rem" },
                    cursor: "pointer",
                  }}
                />
                <VisibilityIcon
                  onClick={() => handleViewDocument(file.path)}
                  sx={{
                    color: Colors.DARK_GRAY,
                    marginTop: "0.5rem",
                    cursor: "pointer",
                    fontSize: { xs: FONT_SIZE_SMALL, sm: "1.2rem" },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default FileUploadComponent;
