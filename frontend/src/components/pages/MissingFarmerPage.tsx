import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React from 'react';

import NavBar from '../NavBar';

const MissingFarmerPage: React.FC = () => {
  return (
    <>
      <NavBar />
      <main>
        <Container sx={{ pt: 4, pb: 4 }}>
          <Typography component="h1" variant="h4" align="center" color="text.primary" gutterBottom>
            Upload your save file to proceed
            <br />
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            %APPDATA%\..\LocalLow\Oni Gaming\Farmer Against Potatoes Idle\fapi-save.txt
          </Typography>
        </Container>
      </main>
    </>
  );
};

export default MissingFarmerPage;
