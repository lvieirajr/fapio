import { type FC, Fragment } from "react";
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid";

import PetCard from "./PetCard";

import { type PetType } from "../../types/pets";

interface PetGridProps {
  pets: Array<PetType>,
}

const PetGrid: FC<PetGridProps> = (props) => {
  const { pets } = props;

  return (
    <Fragment>
    </Fragment>
  );
};

export default PetGrid;
