import { Router } from 'express';

import CreateUserService from '../app/services/CreateUserService';

const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createUserService = new CreateUserService();

  try {
    const user = await createUserService.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

export default usersRouter;
