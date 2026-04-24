// filepath: src/constants/sounds.ts
export interface BuzinaSound {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const buzinaSounds: BuzinaSound[] = [
  {
    id: 'classic_horn',
    name: 'Buzina Clássica',
    icon: '🔔',
    description: 'Som tradicional de buzina'
  },
  {
    id: 'car_horn',
    name: 'Buzina de Carro',
    icon: '🚗',
    description: 'Som de buzina automotiva'
  },
  {
    id: 'bike_bell',
    name: 'Campainha',
    icon: '🔔',
    description: 'Som de campainha de bike'
  },
  {
    id: 'electronic',
    name: 'Eletrônica',
    icon: '📡',
    description: 'Som digital moderno'
  },
  {
    id: 'melody',
    name: 'Melodia',
    icon: '🎵',
    description: 'Melodia personalizada'
  }
];

export default buzinaSounds;