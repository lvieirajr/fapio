import { type FC, Fragment } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

import { type PetType } from "../../types/pets";

const PetCard: FC<PetType> = (props) => {
  return (
    <Fragment>
      <Card sx={{maxWidth: 300, maxHeight: 400}}>
        <CardMedia
          component="img"
          image={`/pets/${props.name}.png`}
          alt={props.name}
          sx={{height: 150, display: 'flex', flexDirection: 'column' }}
        />
      </Card>
    </Fragment>
  );
};

export default PetCard;
