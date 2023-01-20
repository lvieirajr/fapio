import { type FC, Fragment } from "react";
import { signOut } from "next-auth/react";
import IconButton from "@mui/material/IconButton";
import Logout from '@mui/icons-material/Logout';

const SignOutButton: FC = () => {
  return (
    <Fragment>
      <IconButton
        color="error"
        sx={{ ml: 4 }}
        onClick={() => void signOut({ callbackUrl: "/" })}
      >
        <Logout />
      </IconButton>
    </Fragment>
  );
};

export default SignOutButton;
