import CreateUserService from '@modules/users/services/CreateUserService';
import UsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new UsersRepository();

    const createUser = new CreateUserService(fakeUsersRepository);

    const user = await createUser.execute({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with email that already exists', async () => {
    const fakeUsersRepository = new UsersRepository();

    const createUser = new CreateUserService(fakeUsersRepository);

    const userEmail = 'email@email.com';

    await createUser.execute({
      name: 'Lorem Ipsum',
      email: userEmail,
      password: 'sit_amet',
    });

    expect(
      createUser.execute({
        name: 'Lorem Ipsum 2',
        email: userEmail,
        password: 'sit_amet',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});