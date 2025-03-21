import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ScrollbarStyles from "../customScroll";
import { Colors } from "../../config/default";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  Box,
  Typography,
  Switch,
  Tooltip,
} from "@mui/material";
import MuiModels from "../models";
import {
  GetAllSignatures,
  DeleteSignature,
  UpdateSignatureStatus,
} from "../../services/services";
import { useToast } from "../../toast/toastContext";
import Prompt from "../prompt";

const StyledAccordion = styled(Accordion)({
  "&:before": {
    display: "none",
  },
  width: "100%",
  borderRadius: "1rem !important",
  backgroundColor: Colors.WHITE,
  boxShadow: "none",
  marginBottom: "1rem",
});

const StyledAccordionSummary = styled(AccordionSummary)({
  fontFamily: "Nunito",
  fontWeight: "600",
  borderRadius: "1rem",
  borderBottom: "1px solid #EAEBEB",
});

const StyledAccordionDetails = styled(AccordionDetails)({
  borderTop: "none",
});

function SignatureDetails() {
  const [signatures, setSignatures] = useState([]);
  const { showToast } = useToast();

  const GetAllSignaturesData = async () => {
    const res = await GetAllSignatures();
    if (res?.status === 200) {
      setSignatures(res?.data?.data);
    }
  };

  useEffect(() => {
    GetAllSignaturesData();
  }, []);

  const toggleActiveStatus = async (id, isActive) => {
    const payload = { active: !isActive };
    const res = await UpdateSignatureStatus(payload, id);
    if (res?.status === 200) {
      setSignatures((prevSignatures) =>
        prevSignatures?.map((sig) =>
          sig._id === id ? { ...sig, active: !isActive } : sig
        )
      );
      showToast(res?.data?.message, "success");
      GetAllSignaturesData();
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  const handleDelete = async (id) => {
    const res = await DeleteSignature(id);
    if (res?.status === 200) {
      setSignatures(signatures?.filter((sig) => sig._id !== id));
      showToast(res?.data?.message, "success");
      GetAllSignaturesData();
    } else {
      const errorMessage = res?.response?.data?.message;
      showToast(errorMessage, "error");
    }
  };

  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  // const stripHtmlButKeepFormatting = (html) => {
  //   if (!html) return "";

  //   return html
  //     .replace(/<(\/)?(b|strong|i|em)>/g, "[$1$2]") // Preserve bold and italic formatting
  //     .replace(/<\/?[^>]+(>|$)/g, "") // Remove all other HTML tags
  //     .replace(/\[\/?(b|strong|i|em)\]/g, "<$1>") // Restore allowed tags
  //     .replace(/\s+/g, " ") // Remove extra spaces
  //     .trim();
  // };

  return (
    <StyledAccordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography sx={{ fontWeight: 600, fontFamily: "Nunito" }}>
            Signatures
          </Typography>
          <Box
            sx={{ marginRight: "1rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <MuiModels
              show="createSignature"
              buttonName="createSignature"
              GetAllSignaturesData={GetAllSignaturesData}
            />
          </Box>
        </Box>
      </StyledAccordionSummary>

      <StyledAccordionDetails>
        <Box
          sx={{
            height: "20rem",
            overflowY: "auto",
            ...ScrollbarStyles,
          }}
        >
          {signatures?.length > 0 ? (
            signatures?.map((signature) => (
              <Box
                key={signature._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem",
                  borderBottom: "1px solid #EAEBEB",
                }}
              >
                <Tooltip title={signature?.signature || ""} arrow>
                  <Typography
                    sx={{
                      flexGrow: 1,
                      fontSize: "14px",
                      color: Colors.BLACK,
                      fontFamily: "Nunito",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "62rem",
                      display: "block",
                    }}
                  >
                    {stripHtml(signature?.signature)?.length > 200
                      ? `${stripHtml(signature?.signature).slice(0, 200)}...`
                      : stripHtml(signature?.signature)}
                  </Typography>
                  {/* <Typography
                    sx={{
                      flexGrow: 1,
                      fontSize: "14px",
                      color: Colors.BLACK,
                      fontFamily: "Nunito",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "62rem",
                      display: "block",
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        stripHtmlButKeepFormatting(signature?.signature)
                          .length > 200
                          ? `${stripHtmlButKeepFormatting(
                              signature.signature
                            ).slice(0, 200)}...`
                          : stripHtmlButKeepFormatting(signature.signature),
                    }}
                  /> */}
                </Tooltip>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Tooltip title={"Activate Signature"} arrow>
                    <Switch
                      checked={signature?.active}
                      onChange={() =>
                        toggleActiveStatus(signature?._id, signature?.active)
                      }
                      color="primary"
                    />
                  </Tooltip>

                  <MuiModels
                    show="editSignature"
                    editSignature="true"
                    GetAllSignaturesData={GetAllSignaturesData}
                    signatureData={signature}
                  />

                  {/* Delete Button */}
                  <Prompt
                    heading="Delete Signature"
                    text="Are you sure you want to delete this signature?"
                    handleSignatureDelete={() => handleDelete(signature?._id)}
                  />
                </Box>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                height: "20rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: "1.5rem", fontFamily: "Nunito" }}>
                No signatures found.
              </Typography>
            </Box>
          )}
        </Box>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}

export default SignatureDetails;
