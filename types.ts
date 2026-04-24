export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'cliente' | 'entregador' | 'empresa_admin' | 'admin';
  companyId?: string;
  fcmToken?: string;
  address?: Address;
  rating: {
    average: number;
    count: number;
  };
  avatarUrl?: string;
};

export type Company = {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: Address;
  logoUrl?: string;
  active: boolean;
  rating: {
    average: number;
    count: number;
  };
  createdAt: string;
};

export type DeliveryProfile = {
  userId: string;
  companyId: string;
  cpf: string;
  vehicle: 'moto' | 'carro' | 'bike';
  plate?: string;
  selfieUrl: string;
  documentUrl: string;
  verificationStatus: 'pendente' | 'aprovado' | 'rejeitado';
  createdAt: string;
};

export type Order = {
  id: string;
  companyId: string;
  clientId: string;
  deliveryId?: string;
  customerName: string;
  deliveryVerified?: boolean;
  addressSnapshot: Address;
  items: { name: string; quantity: number }[];
  status: 'pendente' | 'em_rota' | 'entregue' | 'nova';
  createdAt: string;
  deliverer?: {
    name: string;
    vehicle: string;
    plate: string;
    rating: number;
    avatarUrl: string;
  }
};

export type Address = {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
};
