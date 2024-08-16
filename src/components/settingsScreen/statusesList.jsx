import { DndProvider } from "react-dnd";
import { useSelector } from "react-redux";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Grid, CircularProgress, Typography } from "@mui/material";
import update from "immutability-helper";
import DraggableRow from "./dragAbleStatuses";
import { Colors } from "../../config/default";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect } from "react";
import { ReArrangedStatuses } from "../../services/services";
import { useToast } from "../../toast/toastContext";

const StatusLists = ({
  arrayStatus,
  setArrayStatus,
  loading,
  statusId,
  GetStatuses,
}) => {
  const moveRow = (dragIndex, hoverIndex) => {
    const draggedItem = arrayStatus[dragIndex];
    setArrayStatus(
      update(arrayStatus, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedItem],
        ],
      })
    );
  };
  const { showToast } = useToast();
  const extraSmallScreen = useMediaQuery(
    "(min-width:300px) and (max-width:500px)"
  );

  const reArrangedArray = async () => {
    if (statusId) {
      const payload = {
        status: arrayStatus,
      };
      const res = await ReArrangedStatuses(payload, statusId);
      if (res?.status !== 200) {
        const errorMessage = res?.response?.data?.message;
        showToast(errorMessage, "error");
      }
    }
  };

  useEffect(() => {
    reArrangedArray();
  }, [arrayStatus, statusId]);
  const settings = useSelector(
    (state) => state?.permissions?.permissions?.settings
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <table style={{ width: "100%" }}>
        <thead>
          <tr
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "Nunito",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            <th
              style={{
                width: "84.5%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              Name
            </th>
            {(settings?.editCaseStatus || settings?.deleteCaseStatus) && (
              <th
                style={{
                  width: extraSmallScreen ? "45%" : "15%",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          <Grid
            item
            sx={{
              height: "40vh",
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
                marginTop: ".5rem",
                marginBottom: ".5rem",
              },
            }}
          >
            {loading ? (
              <Grid
                container
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40vh",
                }}
              >
                <CircularProgress size={40} sx={{ color: Colors.SKY_BLUE }} />
              </Grid>
            ) : (
              arrayStatus?.map((item, index) => (
                <DraggableRow
                  key={index}
                  index={index}
                  id={index}
                  text={item}
                  moveRow={moveRow}
                  arrayStatus={arrayStatus}
                  statusId={statusId}
                  GetStatuses={GetStatuses}
                />
              ))
            )}
            {arrayStatus?.length === 0 && (
              <Typography
                sx={{
                  textAlign: "center",
                  fontFamily: "Nunito",
                  fontSize: "14px",
                }}
              >
                No Record Exists
              </Typography>
            )}
          </Grid>
        </tbody>
      </table>
    </DndProvider>
  );
};

export default StatusLists;
