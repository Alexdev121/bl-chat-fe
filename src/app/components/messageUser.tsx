import React from "react";
import { MessageType } from "./../utils/types.tsx";
import { ListItem, Typography } from "@mui/material";
import useStyles from "./styles";
import { Grid } from "@mui/material";

interface UserMessageProps {
  message: MessageType;
}

const UserMessage: React.FC<UserMessageProps> = ({
  message,
}) => {
  const styles = useStyles();

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
};

export default UserMessage;