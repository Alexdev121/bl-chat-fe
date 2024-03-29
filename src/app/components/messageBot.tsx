import React, { useContext, useEffect } from "react";
import { MessageType } from "./../utils/types.tsx";
import { ListItem, ListItemIcon, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import useStyles from "./styles";
import { ThumbUpOffAlt, ThumbUpAlt } from "@mui/icons-material";
import { Divider } from "@mui/material";
import { ThumbDownOffAlt, ThumbDownAlt } from "@mui/icons-material";
import FeedbackModel from "./feedbackModel.tsx";
import { Button } from "@mui/material";
import Message from "./message.tsx";
import HelpIcon from "@mui/icons-material/Help";
import ApiClientContext from "./apiContext.tsx";

interface BotMessageProps {
  message: MessageType;
  elementDisabled: boolean;
  ratingAvailable: boolean;
  updateSelf: (message: MessageType) => void;
  handleClick: (message: MessageType) => void;
  handleChange: (message: MessageType, label: string) => void;
  imgSource: string;
}

const BotMessage: React.FC<BotMessageProps> = ({
  message,
  updateSelf,
  ratingAvailable,
  handleClick,
  handleChange = null,
  elementDisabled = false,
  imgSource,
}) => {
  const apiClient = useContext(ApiClientContext);
  const styles = useStyles();

  const handleThumbUp = (message: MessageType) => {
    if (!message.rating || message.rating.value === null) {
      message["rating"] = { time: new Date().toISOString(), value: true };
      apiClient.sendRating(message);
      updateSelf(message);
    }
  };
  const handleThumbDown = (message: MessageType) => {
    if (!message.rating || message.rating.value === null) {
      setOpenModel(() => true);
    }
  };
  const handleFeedbackSubmit = (message: MessageType, reasons: Array) => {
    setOpenModel(() => false);
    message["rating"] = {
      time: new Date().toISOString(),
      value: false,
      reasons: reasons,
    };
    apiClient.sendRating(message);
    updateSelf(message);
  };
  const [openModel, setOpenModel] = React.useState(false);

  if (handleChange == null) {
    handleChange = () => {};
  }
  const finalText = message.title || message.content;
  if (
    message.element &&
    message.role === "bot" &&
    (message.element.type === "radiogroup" || message.element.type === "text")
  ) {
    return (
      <ListItem
        classes="listItem"
        sx={{
          flexWrap: "wrap",
          flexDirection: "column",
          alignItems: "flex-start",
          paddingLeft: "0px !important",
        }}
      >
        <ListItemIcon className={styles.listItemHeadIcon}>
          <img
            src={imgSource}
            style={{
              height: "24px",
              width: "24px",
              borderRadius: "50%",
              // border: "1px solid #E3E3ED", // Added grey border
              margin: "0px 8px 4px 0px"

            }}
            role="presentation"
          />
          <Typography
            variant="h6"
            className={styles.listItemHead}
            id={`${message.name}-label`}
            sx={{ fontWeight: 500 }}
          >
            {finalText.split("\n").map(function (item, idx) {
              return (
                <span key={idx}>
                  {item}
                  <br />
                </span>
              );
            })}
          </Typography>
        </ListItemIcon>
        <div className={styles.listItemContent}>
          <Message
            message={message}
            handleChange={handleChange}
            handleClick={handleClick}
          />
        </div>
        {/* <div>
          <Button
            variant="contained"
            disabled={message.completed ? true : elementDisabled}
            onClick={() => {
              handleClick ? handleClick(message) : null;
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
        </div> */}
      </ListItem>
    );
  }

  const getFontWeight = () => {
    if (
      !message.customInput &&
      message.element &&
      message.element.type !== "image"
    )
      return 500;

    return 400;
  };

  const getMarginBottom = () => {
    if (
      !message.customInput &&
      message.element &&
      message.element.type !== "image"
    )
      return "0px";

    return "32px";
  };

  return (
    <>
      <ListItem sx={{ "flex-wrap": "wrap", maxWidth: "45em", padding: "0px" }}>
        <ListItemIcon className={styles.listItemHeadIcon}>
          {!message.customInput &&
            message.element &&
            message.element.type !== "image" && (
              // use image as icon from kaia_small.png and use 24px as height and width
              <img
                src={imgSource}
                style={{
                  height: "24px",
                  width: "24px",
                  borderRadius: "50%",
                  // border: "1px solid #E3E3ED", // Added grey border
                  margin: "0px 8px 4px 0px"
                }}
                role="presentation"
              />
            )}
          <Typography
            variant="h6"
            className={styles.listItemHead}
            fontWeight={getFontWeight}
            sx={{marginBottom: getMarginBottom}}
          >
            {message.content}
          </Typography>
          {message.element &&
            message.element.type == "image" &&
            message.element.imageLink && (
              <img
                src={message.element.imageLink}
                alt={message.element.altText}
                style={{
                  height: message.element.imageHeight || "100%",
                  width: message.element.imageWidth || "auto",
                }}
              />
            )}
        </ListItemIcon>
        {ratingAvailable && (
          <div className={styles.feedbackContainer}>
            <div className={styles.thumbUp}>
              {(message.rating && message.rating.value === true && (
                <ThumbUpAlt onClick={() => handleThumbUp(message)} />
              )) || <ThumbUpOffAlt onClick={() => handleThumbUp(message)} />}
            </div>
            <Divider orientation="vertical" variant="middle" flexItem />
            <div className={styles.thumbDown}>
              {(message.rating && message.rating.value === false && (
                <ThumbDownAlt onClick={() => handleThumbDown(message)} />
              )) || (
                <ThumbDownOffAlt onClick={() => handleThumbDown(message)} />
              )}
            </div>
          </div>
        )}
        <FeedbackModel
          message={message}
          setOpenModel={setOpenModel}
          openModel={openModel}
          handleSubmit={(reasons) => handleFeedbackSubmit(message, reasons)}
        />
      </ListItem>
    </>
  );
};

export default BotMessage;
