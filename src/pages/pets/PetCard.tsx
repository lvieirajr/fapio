import { type FC, Fragment } from 'react';
import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";
import CardMedia from '@mui/material/CardMedia';

interface PetCardProps {
  id: number,
  name: string,
  location: string,
  type: string,
  rarity: number,
  pity: number | null,
  expeditionBaseDamage: number,
  equippedBonuses: object,
  expeditionBonuses: object,
  captured: boolean,
  rank: number,
  level: number,
};

const PetCard: FC<PetCardProps> = (props) => {
  return (
    <Fragment>
      <Card sx={{height: '100', display: 'flex', flexDirection: 'column'}}>
        <CardMedia
          component="img"
          image={`/pets/Cocorico.png`}
          alt="Cocorico"
        />
      </Card>
    </Fragment>
  );
};

export default PetCard;
