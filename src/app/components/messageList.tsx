import React, { useEffect, useRef } from "react";
import { Grid, Typography, List, ListItemIcon, ListItem } from "@mui/material";
import useStyles from "./styles";
import { Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import HelpIcon from "@mui/icons-material/Help";
import { MessageType } from "./../utils/types.tsx";
import { ThumbUpOffAlt } from "@mui/icons-material";
import { useState } from "react";
import { Divider } from "@mui/material";
import { ThumbDownOffAlt } from "@mui/icons-material";
import FeedbackModel from "./feedbackModel.tsx";
import Message from "./message.tsx";

interface MessageListProps {
  messages: Array<MessageType>;
  storeTimeLineMessages: (message: MessageType) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  storeTimeLineMessages,
}) => {
  const styles = useStyles();
  const [selectedValue, setSelectedValue] = useState("");
  const [elementDisabled, setElementDisabled] = useState(true);
  const [openModel, setOpenModel] = useState(false);
  const [action, setAction] = useState("");

  const bottomRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleChange = (message: MessageType, label: string) => {
    if (!message.completed) {
      setSelectedValue(label);
      setElementDisabled(false);
    }
  };

  const handleClick = (message: MessageType) => {
    const msg = {
      role: "user",
      content: selectedValue,
      completed: true,
      disabled: true,
      name: message.name,
      customInput: false,
      surveyQuestion: message.surveyQuestion,
    };
    storeTimeLineMessages(msg);
    setElementDisabled(true);
  };

  const handleThubUp = (message: MessageType) => {
    setOpenModel(true);
    setAction("up");
  };

  const handleThubDown = (message: MessageType) => {
    setOpenModel(false);
    setAction("down");
  };

  return (
    <>
      <List className={styles.chatWidgetMessageList}>
        {messages.map((message, _index) =>
          (() => {
            if (
              message.element &&
              message.role === "bot" &&
              message.element.type === "radiogroup"
            ) {
              return (
                <ListItem
                  sx={{
                    flexWrap: "wrap",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <ListItemIcon className={styles.listItemHeadIcon}>
                    <HelpIcon fontSize="medium" sx={{ color: "#D02DF5" }} />
                    <Typography variant="h6" className={styles.listItemHead}>
                      {message.title || message.content}
                    </Typography>
                  </ListItemIcon>
                  <div className={styles.listItemContent}>
                    <Message message={message} handleChange={handleChange} />
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      disabled={message.completed ? true : elementDisabled}
                      onClick={() => {
                        handleClick(message);
                      }}
                      sx={{
                        color: "#FFFFFF",
                        textTransform: "none",
                        backgroundColor: "#D02DF5",
                        ":hover": {
                          backgroundColor: "#aa32c5",
                          borderColor: "#0062cc",
                          boxShadow: "none",
                        },
                        "&.Mui-disabled": {
                          background: "#e082f5",
                          color: "#FFFFFF",
                        },
                        boxShadow: "none",
                      }}
                    >
                      Send answer
                    </Button>
                  </div>
                </ListItem>
              );
            } else if (message.role === "bot") {
              return (
                <ListItem sx={{ "flex-wrap": "wrap", maxWidth: "40em" }}>
                  <ListItemIcon className={styles.listItemHeadIcon}>
                    {!message.customInput && (
                      <InfoIcon fontSize="medium" sx={{ color: "#D02DF5" }} />
                    )}
                    <Typography variant="h6" className={styles.listItemHead}>
                      {message.content}
                    </Typography>
                  </ListItemIcon>
                  {!message.default && (
                    <div className={styles.feedbackContainer}>
                      <div className={styles.thumbUp}>
                        <ThumbUpOffAlt onClick={() => handleThubUp(message)} />
                      </div>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                      />
                      <div className={styles.thumbDown}>
                        <ThumbDownOffAlt
                          onClick={() => handleThubDown(message)}
                        />
                      </div>
                    </div>
                  )}
                  <FeedbackModel
                    message={message}
                    setOpenModel={setOpenModel}
                    openModel={openModel}
                    action={action}
                  />
                </ListItem>
              );
            } else if (message.role === "bot" && message.default) {
              return (
                <ListItem sx={{ "flex-wrap": "wrap" }}>
                  <ListItemIcon className={styles.listItemHeadIcon}>
                    <InfoIcon fontSize="medium" sx={{ color: "#D02DF5" }} />
                    <Typography variant="h6" className={styles.listItemHead}>
                      {message.title ?? message.content}
                    </Typography>
                  </ListItemIcon>
                  <div>
                    <Typography className={styles.listItemText}>
                      {message.content}
                    </Typography>
                  </div>
                </ListItem>
              );
            } else if (message.role === "user") {
              return (
                <ListItem
                  sx={{
                    "flex-wrap": "wrap",
                    "flex-direction": "row-reverse",
                  }}
                >
                  <Grid
                    sx={{
                      background: "#F1DEF5",
                      padding: "12px",
                      maxWidth: "20em",
                      borderRadius: "12px 12px 0px",
                    }}
                  >
                    <Typography className={styles.listItemReplyText}>
                      {message.content}
                    </Typography>
                  </Grid>
                </ListItem>
              );
            }
            return null;
          })()
        )}
        <div ref={bottomRef as React.RefObject<HTMLDivElement>} />
      </List>
    </>
  );
};

export default MessageList;