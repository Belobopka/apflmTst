import JSONUsers from './users.json';

export type TUser = {
  id: number;
  name: string;
  age: number;
  avatar: string;
};

export type TUsers = TUser[];

export function fetchUsers() {
  const length = JSONUsers.length;
  return new Promise<{ data: TUser[]; length: number }>(resolve =>
    setTimeout(() => resolve({ data: JSONUsers, length }), 1000),
  );
}
