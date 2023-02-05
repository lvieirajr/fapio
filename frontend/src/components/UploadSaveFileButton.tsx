import Button from '@mui/material/Button';
import React from 'react';
import Cookies from 'universal-cookie';

const UploadSaveFileButton: React.FC = () => {
  const farmerId = new Cookies().get('farmer_id');

  const uploadSaveFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files[0] instanceof File) {
      const formData = new FormData();

      formData.append('save_file', event.target.files[0]);
      if (farmerId) {
        formData.append('farmer_id', farmerId);
      }

      fetch(`${import.meta.env.VITE_API_URL}/farmer/upload`, { method: 'POST', body: formData }).then((response) => {
        response.json().then((json) => {
          new Cookies().set('farmer_id', json.id);
          window.location.reload();
        });
      });
    }
  };

  return (
    <>
      <Button variant="contained" component="label">
        Upload Save
        <input hidden type="file" accept="text/plain" onChange={uploadSaveFile} />
      </Button>
    </>
  );
};

export default UploadSaveFileButton;
