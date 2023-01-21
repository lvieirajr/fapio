export interface PetType {
  id: number,
  name: string,
  location: string,
  type: string,
  rarity: number,
  pity: number | null,
  damage: number,
  bonuses: { [key: string]: number },
  captured: boolean,
  rank: number,
  level: number,
}
