import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Colors } from "../config/default";
import {
  FONT_SIZE_MEDIUM,
  PAGE_HEIGHT,
  TEXT_EDITOR_KEY,
} from "../constants/appConstants";
import ScrollbarStyles from "./customScroll";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MuiModels from "./models";
import SearchBar from "./searchBar";
import { Editor } from "@tinymce/tinymce-react";

const users = [
  {
    name: "Mike Nelson",
    lastMessage: "Now",
    messages: ["Hi, how are you?", "I'm good, thanks!"],
  },
  { name: "Sofia Jackson", lastMessage: "1h", messages: ["Hello there!"] },
  { name: "Mathew Jackson", lastMessage: "1h", messages: ["Hello there!"] },
  { name: "Jeremy Clarkson", lastMessage: "1h", messages: ["Hello there!"] },
  { name: "Aftab Qarshi", lastMessage: "1h", messages: ["Hello there!"] },
  { name: "Marshal Mathers", lastMessage: "1h", messages: ["Hello there!"] },
  { name: "John Snow", lastMessage: "1h", messages: ["Hello there!"] },
  {
    name: "James Smith",
    lastMessage: "1h",
    messages: ["Hey, are you free tomorrow?"],
  },
  {
    name: "Natasha Miller",
    lastMessage: "12h",
    messages: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at accumsan diam, et auctor est. Ut ut tortor lectus. Phasellus at sem dapibus, hendrerit nibh at, condimentum arcu. Vestibulum ante purus, vestibulum sit amet ultricies a, efficitur in mauris. Duis arcu metus, auctor quis faucibus vel, varius quis ligula. Aliquam erat volutpat. In sagittis sollicitudin enim, eu pharetra lorem ornare vel. Nulla mollis sagittis orci. Aenean vel nulla quis justo efficitur interdum nec id nulla. Sed sed lectus laoreet, placerat purus tempus, lobortis magna. Quisque egestas tristique lorem, in cursus massa molestie sed.",
    ],
  },
];

function Inbox() {
  const smallScreen = useMediaQuery("(min-width:315px) and (max-width:760px)");
  const role = useSelector((state) => state?.signIn?.signIn?.user?.role);
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const handleKeyPress = (e) => {
    setSearchText(e.target.value);
  };

  const boxStyling = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  };

  return (
    <Grid
      container
      sx={{
        backgroundColor: Colors.BG_LIGHT_GRAY,
        padding: "0 2rem",
        height: PAGE_HEIGHT,
        overflowY: "auto",
        ...ScrollbarStyles,
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: smallScreen ? "flex-start" : "flex-end",
          marginTop: "1.5rem",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontWeight: "500",
            color: Colors.DARK_GRAY,
          }}
        >
          Authority level: <span>{role}</span>
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          marginTop: "1.5rem",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "2rem",
            fontFamily: "Nunito",
            color: Colors.BLACK,
          }}
        >
          Inbox
        </Typography>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <SearchBar
            searchCheck={true}
            searchingText={searchText}
            handleKeyPress={handleKeyPress}
            placeholder="Search..."
          />
          <MuiModels
            show="sendEmailCase"
            buttonName="composeEmail"
            iconColor={Colors.BLACK}
            maxHeight="78vh"
            caseDataId={""}
            GetLogsById={""}
            data={""}
            verifiedSenders={[]}
          />
        </div>
      </Grid>
      {loading ? (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
          }}
        >
          <CircularProgress size={70} sx={{ color: Colors.SKY_BLUE }} />
        </Grid>
      ) : (
        <>
          <Grid
            container
            item
            xs={12}
            sx={{
              borderRadius: "10px",
              height: "80vh",
            }}
            spacing={2}
          >
            <Grid item xs={3}>
              <Card
                sx={{
                  padding: "10px",
                  borderRadius: "8px",
                  height: "75vh",
                  overflowY: "auto",
                  ...ScrollbarStyles,
                }}
              >
                {users.map((user, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedUser(user)}
                    sx={{
                      ...boxStyling,
                      backgroundColor:
                        selectedUser?.name === user?.name
                          ? Colors.lIGHT_PURPLE
                          : "transparent",
                    }}
                  >
                    <Typography
                      sx={{ fontFamily: "Nunito", fontWeight: "600" }}
                    >
                      {user.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Nunito",
                        fontWeight: "600",
                        width: "3rem",
                        textAlign: "center",
                        backgroundColor: Colors.lIGHT_PURPLE,
                        borderRadius: "10px",
                        fontSize: FONT_SIZE_MEDIUM,
                        color: Colors.SKY_BLUE,
                      }}
                    >
                      {user.lastMessage}
                    </Typography>
                  </Box>
                ))}
              </Card>
            </Grid>

            <Grid item xs={9}>
              <Card
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "10px",
                  borderRadius: "8px",
                  height: "75vh",
                  overflowY: "auto",
                  ...ScrollbarStyles,
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  padding="10px"
                  style={{ backgroundColor: "#E3DFF5", borderRadius: "8px" }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: "Nunito", fontWeight: "700" }}
                  >
                    {selectedUser.name}
                  </Typography>
                </Box>

                <Box
                  flex={1}
                  overflow="auto"
                  style={{ marginTop: "10px", padding: "10px" }}
                >
                  {selectedUser.messages.map((message, index) => (
                    <Box
                      key={index}
                      display="flex"
                      flexDirection="column"
                      marginBottom="10px"
                    >
                      <CardContent
                        style={{
                          backgroundColor: "#F5F5F5",
                          borderRadius: "8px",
                          marginTop: "5px",
                          padding: "10px",
                        }}
                      >
                        <Typography sx={{ fontFamily: "Nunito" }}>
                          {message}
                        </Typography>
                      </CardContent>
                    </Box>
                  ))}
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  padding="10px"
                  style={{ borderTop: "1px solid #ddd" }}
                >
                  <Editor
                    apiKey={TEXT_EDITOR_KEY}
                    init={{
                      menubar: "false",
                      toolbar:
                        "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat",
                      height: 200,
                      width: "100%",
                    }}
                    value={preview}
                    onEditorChange={(content) => setPreview(content)}
                  />
                  <IconButton sx={{ backgroundColor: Colors.SKY_BLUE }}>
                    <SendIcon sx={{ color: Colors.WHITE }} />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default Inbox;
