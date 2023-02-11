import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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
  const [objectives, setObjectives] = React.useState<Array<string>>(["total_damage"]);
  const { data: expeditions, refetch } = useQuery<Array<ExpeditionTeam>>({
    queryKey: ['expeditions'],
    queryFn: () =>
      optimizeExpedition(
        farmer.id,
        farmer.json.EquipedPetID.filter((petId) => petId != 0),
        [],
        objectives,
      ),
    enabled: false,
  });

  const handleOptimize = () => void refetch();
  const handleObjectiveSelect = (event: SelectChangeEvent<typeof objectives>) => {
    const {
      target: { value },
    } = event;
    setObjectives(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <>
      <main>
        <Container sx={{ pt: 4, pb: 4 }}>
          <Typography component="h1" variant="h3" align="center" color="text.primary" gutterBottom>
            Expeditions
          </Typography>
        </Container>
        <Container>
          <Typography component="h1" variant="h3" align="center" color="text.primary" gutterBottom>
            <Button variant="contained" component="label" sx={{ mt: 4, mb: 4 }} onClick={handleOptimize}>
              Optimize
            </Button>
          </Typography>
          <Typography component="h1" variant="h3" align="center" color="text.primary" gutterBottom>
            <Select
              id="optimization-objective"
              multiple
              value={objectives}
              onChange={handleObjectiveSelect}
            >
              <MenuItem value="total_damage">Total Damage</MenuItem>
              <MenuItem value="base_damage">Base Damage</MenuItem>
              <MenuItem value="tokens">Tokens</MenuItem>
              <MenuItem value="tewards">Rewards</MenuItem>
            </Select>
          </Typography>
        </Container>
        {expeditions && (
          <Container sx={{ py: 4 }} maxWidth="md">
            {expeditions.map((expedition) => {
              const expeditionPets = expedition.team.map((petId) => farmer.pets[petId]);
              return (
                <Container key={expedition.team.toString()} sx={{ mt: 2, mb: 4 }}>
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
