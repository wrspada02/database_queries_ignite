import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    const user = await this.repository.findOne(user_id);

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const users: User[] = await this.repository.query('SELECT * FROM "users"'); // Complete usando raw query
    const formatedUsers = users.sort(this.sortArrayByFirstName)

    return formatedUsers;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[]> {
    const users: User[] = await this.repository
      .query(`SELECT * FROM "users" WHERE $first_name=${first_name} AND $last_name=${last_name}`); 
      // Complete usando raw query

    return users;
  }

  private sortArrayByFirstName(userA: User, userB: User): number {
    if (userA.first_name > userB.first_name) {
      return 1;
    } else if (userA.first_name < userB.first_name) {
      return -1;
    }
    return 0;
  }
}
