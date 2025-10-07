export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  tenantId?: string | null;
}

const users: User[] = [
  {
    id: '1',
    name: 'Demo Admin',
    email: 'admin@example.com',
    passwordHash: '$2a$10$7eqJtq98hPqEX7fNZaFWoO5pbyTg8vboYFke2HCboE/L4i0j2t5ba', // password123
    role: 'admin',
    tenantId: 'tenant-1',
  },
  {
    id: '2',
    name: 'Demo User',
    email: 'user@example.com',
    passwordHash: '$2a$10$7eqJtq98hPqEX7fNZaFWoO5pbyTg8vboYFke2HCboE/L4i0j2t5ba', // password123
    role: 'user',
    tenantId: 'tenant-1',
  },
];

export const findUserByEmail = (email: string): User | undefined =>
  users.find((user) => user.email.toLowerCase() === email.toLowerCase());

export const findUserById = (id: string): User | undefined =>
  users.find((user) => user.id === id);
