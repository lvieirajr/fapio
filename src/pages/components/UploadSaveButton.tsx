import { type FC, type ChangeEvent, Fragment } from "react";
import { ungzip } from "node-gzip";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";

import { api } from "../../utils/api";

const UploadSaveButton: FC = () => {
  const router = useRouter();
  const loadSaveMutation = api.farmer.loadSave.useMutation();

  const loadSave = (event: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      if (event.target && event.target.result instanceof ArrayBuffer) {
        const saveDataBuffer = Buffer.from(new Uint8Array(event.target.result));

        void ungzip(saveDataBuffer).then((uncompressed) => {
          const saveDataString = uncompressed.toString();

          loadSaveMutation.mutate({
            saveData: saveDataString.substring(0, saveDataString.lastIndexOf("}") + 1),
          });

          router.reload();
        });
      }
    };

    if (event.target && event.target.files && event.target.files[0] instanceof File) {
      fileReader.readAsArrayBuffer(event.target.files[0]);
      event.target.value = "";
    }
  };

  return (
    <Fragment>
      <Button variant="contained" component="label">
        Upload Save
        <input hidden type="file" accept="text/plain" onChange={loadSave} />
      </Button>
    </Fragment>
  );
};

export default UploadSaveButton;
