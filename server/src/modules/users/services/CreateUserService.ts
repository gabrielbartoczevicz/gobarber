import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  private usersRepository: IUsersRepository;

  constructor(@inject('UsersRepository') usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const findUserByEmail = await this.usersRepository.findByEmail(email);

    if (findUserByEmail) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;