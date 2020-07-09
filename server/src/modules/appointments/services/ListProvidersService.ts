import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  private usersRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('UsersRepository') usersRepository: IUsersRepository,
    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.usersRepository = usersRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute({ user_id }: IRequest): Promise<User[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(
        `providers-list:${user_id}`,
        classToClass(users),
      );
    }

    return users;
  }
}

export default ListProvidersService;
