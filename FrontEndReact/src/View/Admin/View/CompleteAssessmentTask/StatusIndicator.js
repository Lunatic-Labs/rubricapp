import React, { Fragment } from "react";
// import { makeStyles } from "@mui/styles";

// const RADIUS_DOT = 1.5;
// const useStyles = makeStyles((theme) => ({
//   circle: {
//     borderRadius: RADIUS_DOT,
//     height: RADIUS_DOT * 2,
//     width: RADIUS_DOT * 2,
//     padding: 0,
//   },
// }));

const StatusIndicator = ({ color }) => {
  const styles = { backgroundColor: color };
//   const classes = useStyles();

  return color ? (
    <Fragment>
      {/* <span className={classes.circle} style={styles} /> */}
    </Fragment>
  ) : null;
};

export default StatusIndicator;