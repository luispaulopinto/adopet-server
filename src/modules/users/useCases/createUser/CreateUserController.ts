import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateUserUseCase from '@modules/users/useCases/createUser/CreateUserUseCase';

export default class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, isOng } = request.body;
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({
      name,
      email,
      password,
      isOng,
    });

    return response.status(201).json(user);
  }
}
