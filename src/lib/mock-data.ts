import type { Order, User } from './types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Carlos Silva',
  email: 'carlos.silva@example.com',
  phone: '(11) 98765-4321',
  type: 'entregador',
  companyId: 'company-1',
  rating: {
    average: 4.8,
    count: 125,
  },
  avatarUrl: 'https://picsum.photos/seed/101/100/100',
};

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    companyId: 'company-1',
    clientId: 'client-101',
    customerName: 'Ana Pereira',
    status: 'nova',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    items: [
      { name: 'Pizza Margherita', quantity: 1 },
      { name: 'Refrigerante 2L', quantity: 1 },
    ],
    addressSnapshot: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01001-000',
    },
    deliverer: {
        name: 'Carlos Silva',
        vehicle: 'moto',
        plate: 'ABC-1234',
        rating: 4.8,
        avatarUrl: 'https://picsum.photos/seed/101/100/100',
    }
  },
  {
    id: 'order-2',
    companyId: 'company-1',
    clientId: 'client-102',
    customerName: 'João Mendes',
    status: 'nova',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    items: [{ name: 'Hambúrguer Duplo', quantity: 2 }],
    addressSnapshot: {
      street: 'Avenida Paulista',
      number: '1578',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-200',
    },
    deliverer: {
        name: 'Carlos Silva',
        vehicle: 'moto',
        plate: 'ABC-1234',
        rating: 4.8,
        avatarUrl: 'https://picsum.photos/seed/101/100/100',
    }
  },
  {
    id: 'order-3',
    companyId: 'company-2',
    clientId: 'client-103',
    customerName: 'Mariana Costa',
    status: 'em_rota',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    items: [
      { name: 'Temaki Salmão', quantity: 2 },
      { name: 'Hot Roll', quantity: 1 },
    ],
    addressSnapshot: {
      street: 'Rua Augusta',
      number: '900',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01304-001',
    },
     deliverer: {
        name: 'Carlos Silva',
        vehicle: 'moto',
        plate: 'ABC-1234',
        rating: 4.8,
        avatarUrl: 'https://picsum.photos/seed/101/100/100',
    }
  },
  {
    id: 'order-4',
    companyId: 'company-1',
    clientId: 'client-104',
    customerName: 'Felipe Souza',
    status: 'entregue',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    items: [{ name: 'Açaí 500ml com Frutas', quantity: 1 }],
    addressSnapshot: {
      street: 'Rua Oscar Freire',
      number: '500',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01426-000',
    },
     deliverer: {
        name: 'Carlos Silva',
        vehicle: 'moto',
        plate: 'ABC-1234',
        rating: 4.8,
        avatarUrl: 'https://picsum.photos/seed/101/100/100',
    }
  },
];
