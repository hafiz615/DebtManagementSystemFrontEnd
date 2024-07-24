import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";

const FileViewer = ({ file, onClose }) => {
    const [fileContent, setFileContent] = useState(null);

    useEffect(() => {
        const loadFile = async () => {
            if (file) {
                const reader = new FileReader();
                reader.onload = () => setFileContent(reader.result);
                reader.readAsDataURL(file); // or reader.readAsText(file) for text files
            }
        };
        loadFile();
    }, [file]);

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent background
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
        }}>
            <Button
                onClick={onClose}
                style={{
                    position: "fixed",
                    top: "5rem",
                    right: "1rem",
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.5rem",
                    cursor: "pointer",
                    zIndex: 1100, // Ensure the button is above the file viewer
                }}
            >
                Close
            </Button>
            {fileContent ? (
                <iframe
                    title={file?.name}
                    src={fileContent}
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
    );
};

export default FileViewer;
