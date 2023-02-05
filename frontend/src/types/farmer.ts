export interface Farmer {
  id: string;
  pets: { [key: number]: { id: number; name: string } };
  json: { EquipedPetID: Array<number> };
}
