import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { Expedition } from '../../types/expeditions';
import { type Farmer } from '../../types/farmer';
import { optimizeExpedition } from '../../utils/expeditions';
import EmptyMain from './EmptyMain';

interface Props {
  farmer: Farmer;
}

const ExpeditionOptimizerMain: React.FC<Props> = ({ farmer }) => {
  const { data: expedition } = useQuery<Expedition>({
    queryKey: ['expedition'],
    queryFn: () =>
      optimizeExpedition(
        farmer.id,
        farmer.json.EquipedPetID.filter((petId) => petId != 0),
      ),
    enabled: !!farmer,
  });

  if (!expedition) {
    return <EmptyMain />;
  }

  const expeditionPets = expedition.team.map((petId) => farmer.pets[petId]);

  return (
    <>
      <main>
        <Container sx={{ pt: 4, pb: 4 }}>
          <Typography component="h1" variant="h3" align="center" color="text.primary" gutterBottom>
            Expeditions
          </Typography>
        </Container>
        {expeditionPets && (
          <Container sx={{ py: 4 }} maxWidth="md">
            <>
              <p>This is your optimal expedition team, and it deals {Math.round(expedition.damage)} damage per hour.</p>
              {expeditionPets.map((pet) => (
                <img key={pet.id} src={`/pets/${pet.name}.png`} alt={pet.name} />
              ))}
            </>
          </Container>
        )}
      </main>
    </>
  );
};

export default ExpeditionOptimizerMain;
