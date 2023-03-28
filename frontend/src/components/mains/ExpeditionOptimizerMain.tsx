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
  const [activePets, setActivePets] = React.useState<Array<string>>([]);
  const [excludedPets, setExcludedPets] = React.useState<Array<string>>([]);
  const [objectives, setObjectives] = React.useState<Array<string>>(['total_damage']);
  const { data: expeditions, refetch } = useQuery<Array<ExpeditionTeam>>({
    queryKey: ['expeditions'],
    queryFn: () =>
      optimizeExpedition(
        farmer.id,
        activePets.map((petId) => +petId),
        excludedPets.map((petId) => +petId),
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

  const handleActivePetsSelect = (event: SelectChangeEvent<typeof activePets>) => {
    const {
      target: { value },
    } = event;
    setActivePets(typeof value === 'string' ? value.split(',') : value);
  };

  const handleExcludePetsSelect = (event: SelectChangeEvent<typeof excludedPets>) => {
    const {
      target: { value },
    } = event;
    setExcludedPets(typeof value === 'string' ? value.split(',') : value);
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
          <Typography component="h1" variant="body1" align="center" color="text.primary" gutterBottom>
            <label>Objective: </label>
            <Select id="optimization-objective" multiple value={objectives} onChange={handleObjectiveSelect}>
              <MenuItem value="total_damage">Total Damage</MenuItem>
              <MenuItem value="base_damage">Base Damage</MenuItem>
              <MenuItem value="tokens">Tokens</MenuItem>
              <MenuItem value="rewards">Rewards</MenuItem>
            </Select>
          </Typography>
          <Typography component="h1" variant="body1" align="center" color="text.primary" gutterBottom>
            <label>Active pets: </label>
            <Select id="active-pets" multiple value={activePets} onChange={handleActivePetsSelect}>
              {Object.values(farmer.pets).map((pet) => {
                return (
                  <MenuItem key={`${pet.id}`} value={`${pet.id}`}>
                    {pet.id}
                  </MenuItem>
                );
              })}
            </Select>
          </Typography>
          <Typography component="h1" variant="body1" align="center" color="text.primary" gutterBottom>
            <label>Pets to exclude: </label>
            <Select id="exclude-pets" multiple value={excludedPets} onChange={handleExcludePetsSelect}>
              {Object.values(farmer.pets).map((pet) => {
                return (
                  <MenuItem key={`${pet.id}`} value={`${pet.id}`}>
                    {pet.id}
                  </MenuItem>
                );
              })}
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
                    <img key={index} src={`/pets/${pet.id}.png`} alt={pet.id} />
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
