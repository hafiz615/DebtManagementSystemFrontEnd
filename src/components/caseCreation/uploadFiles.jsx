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

const FileUploadComponent = ({ setUploadedFiles, files, setFiles }) => {
  const onDrop = async (acceptedFiles) => {
    setUploadedFiles(acceptedFiles);

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
    const newPath = file.path.replace(file.name, newFileName); // Update the path with the new file name
    setFiles((prevFiles) =>
      prevFiles.map((f, i) =>
        i === index
          ? { ...f, name: newFileName, path: newPath } // Update both name and path for the edited file
          : f
      )
    );
  };
  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((file, i) => i !== index));
    setUploadedFiles((prevFiles) => prevFiles.filter((file, i) => i !== index));
  };

  const handleViewDocument = (path) => {
    // Open the document in a new tab/window
    window.open(path, "_blank");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
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
      <Grid
        container
        item
        xs={12}
        lg={6}
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
          Upload Documents
        </Typography>
        <Box
          sx={{
            backgroundColor: Colors.BG_LIGHT_GRAY,
            marginTop: "0.5rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontWeight: "400",
              width: "40%",
              color: Colors.BLACK,
              marginTop: "0.5rem",
            }}
          >
            Upload Documents
          </Typography>
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
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <UploadIcon sx={{ color: Colors.DIM_LIGHT_GRAY }} />
          </Grid>
        </Box>
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
                  sx={{ textTransform: "none", color: Colors.BLUE_COLOR }}
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
              }}
            >
              Actions
            </Typography>
            {files.map((file, index) => (
              <Box key={index} sx={{ display: "flex", gap: "0.5rem" }}>
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
                    cursor: "pointer",
                  }}
                />
                <VisibilityIcon
                  onClick={() => handleViewDocument(file.path)}
                  sx={{
                    color: Colors.DARK_GRAY,
                    marginTop: "0.5rem",
                    cursor: "pointer",
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
