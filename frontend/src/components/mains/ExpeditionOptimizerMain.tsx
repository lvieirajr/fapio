import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { ExpeditionTeam } from '../../types/expeditions';
import { type Farmer } from '../../types/farmer';
import { optimizeExpedition } from '../../utils/expeditions';

interface Props {
  farmer: Farmer;
}

const ExpeditionOptimizerMain: React.FC<Props> = ({ farmer }) => {
  const { data: expeditions, refetch } = useQuery<Array<ExpeditionTeam>>({
    queryKey: ['expeditions'],
    queryFn: () =>
      optimizeExpedition(
        farmer.id,
        farmer.json.EquipedPetID.filter((petId) => petId != 0),
      ),
    enabled: false,
  });

  const handleOptimize = () => void refetch();

  return (
    <>
      <main>
        <Container sx={{ pt: 4, pb: 4 }}>
          <Typography component="h1" variant="h3" align="center" color="text.primary" gutterBottom>
            Expeditions
          </Typography>
          <Typography component="h1" variant="h3" align="center" color="text.primary" gutterBottom>
            <Button variant="contained" component="label" onClick={handleOptimize}>
              Optimize
            </Button>
          </Typography>
        </Container>
        {expeditions && (
          <Container sx={{ py: 4 }} maxWidth="md">
            {expeditions.map((expedition) => {
              const expeditionPets = expedition.team.map((petId) => farmer.pets[petId]);
              return (
                <Container key={expedition.team.toString()} sx={{ pt: 4, pb: 4 }}>
                  <p>
                    Total damage: {expedition.total_damage} | Base damage: {expedition.base_damage} | Tokens:{' '}
                    {expedition.tokens} | Rewards: {expedition.rewards}
                  </p>
                  {expeditionPets.map((pet, index) => (
                    <img key={index} src={`/pets/${pet.name}.png`} alt={pet.name} />
                  ))}
                </Container>
              );
            })}
          </Container>
        )}
      </main>
    </>
  );
};

export default ExpeditionOptimizerMain;
