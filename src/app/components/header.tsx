import React, { FC } from "react";
import { Grid } from "@mui/material";
import useStyles from "./styles";
import { Button } from "@mui/material";
import { grey } from "@mui/material/colors";

interface HeaderProps {
  setShowChatWidget: (flag: boolean) => void;
  setShowToolTip: (flag: boolean) => void;
  iconUrl: string;
}

const Header: FC<HeaderProps> = ({
  setShowChatWidget,
  setShowToolTip,
  iconUrl,
}) => {
  const styles = useStyles();

  const handleClick = () => {
    setShowChatWidget(false);
    setShowToolTip(true);
  };

  return (
    <Grid container direction="row" className={styles.header}>
      <Grid item>
        <span className={styles.headerIcon}>
          <img
            src={iconUrl}
            style={{
              height: "50px",
              width: "50px",
              borderRadius: "50%",
            }}
            role="presentation"
            alt=""
          />
        </span>
      </Grid>
      <Grid item className={styles.buttonGridContainer}>
        <Button
          sx={{
            backgroundColor: "#F6F7FC !important",
            justifyContent: "center",
            color: "#000000",
            minWidth: "40px",
            width: "40px !important",
            height: "40px !important",
            textTransform: "none",
            ":hover": {
              backgroundColor: "#EEF0F8 !important",
              borderColor: "#0062cc",
              boxShadow: "none",
            },
            borderRadius: "8px",
          }}
          onClick={() => handleClick()}
        >
          <img 
            src="/images/down_arrow.svg"
            alt=""
          />
        </Button>
      </Grid>
    </Grid>
  );
};

export default React.memo(Header);
