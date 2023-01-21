export interface PetType {
  id: number,
  name: string,
  location: string,
  type: string,
  rarity: number,
  pity: number | null,
  baseDamage: number,
  bonuses: { [key: string]: number },
  captured: boolean,
  rank: number,
  level: number,
  totalDamage: number,
}
