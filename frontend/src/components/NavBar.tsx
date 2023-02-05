import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';

import UploadSaveFileButton from './UploadSaveFileButton';

const NavBar: React.FC = () => {
  return (
    <>
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

          <UploadSaveFileButton />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
