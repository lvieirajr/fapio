import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Cookies from 'universal-cookie';

import ExpeditionOptimizerMain from './components/mains/ExpeditionOptimizerMain';
import NavBar from './components/NavBar';
import FarmerLoadingPage from './components/pages/FarmerLoadingPage';
import MissingFarmerPage from './components/pages/MissingFarmerPage';
import { type Farmer } from './types/farmer';
import { getFarmer } from './utils/farmer';

const App: React.FC = () => {
  const farmerId = new Cookies().get('farmer_id');

  const { data: farmer } = useQuery<Farmer>({
    queryKey: ['farmer'],
    queryFn: () => getFarmer(farmerId as string),
    enabled: !!farmerId,
  });

  if (!farmerId) {
    return <MissingFarmerPage />;
  } else if (!farmer) {
    return <FarmerLoadingPage />;
  }

  return (
    <>
      <NavBar />
      <ExpeditionOptimizerMain farmer={farmer} />
    </>
  );
};

export default App;
