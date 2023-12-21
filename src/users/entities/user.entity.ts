import { Exclude } from 'class-transformer';

export class User {
  id!: number;

  email!: string;

  username?: string;

  @Exclude()
  password: string;
}
