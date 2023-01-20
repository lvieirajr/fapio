import { type FC, Fragment } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import SignOutButton from "./SignOutButton";
import UploadSaveButton from "./UploadSaveButton"

const NavBar: FC = () => {
  return (
    <Fragment>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            FAPIO
          </Typography>

          <UploadSaveButton />
          <SignOutButton />
        </Toolbar>
      </AppBar>
    </Fragment>
  );
};

export default NavBar;
