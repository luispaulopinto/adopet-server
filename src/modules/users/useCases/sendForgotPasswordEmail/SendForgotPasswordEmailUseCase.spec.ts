import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import InMemoryUserRepository from '../../infra/databases/inMemory/InMemoryUserRepository';

import SendForgotPasswordEmailUseCase from './SendForgotPasswordEmailUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailUseCase;

describe('SendForgotPasswordEmail UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmailUseCase(
      fakeMailProvider,
    );
  });

  it('should send an email when user try to recover the password', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendEmail');

    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      user,
      token: 'TOKEN',
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('should not be able to send a recover password email from a non-existing user', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        user: { id: '', name: 'Test', email: 'test@test.com' },
        token: 'TOKEN',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to send a recover password email without a token', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    await expect(
      sendForgotPasswordEmail.execute({
        user,
        token: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // it('should be able to recover the password using the email', async () => {
  //   const generateToken = jest.spyOn(inMemoryUserTokenRepository, 'create');

  //   const user = await inMemoryUserRepository.create({
  //     name: 'Teste',
  //     email: 'teste@teste.com.br',
  //     password: '123456',
  //   });

  //   await sendForgotPasswordEmail.execute({
  //     user,
  //     token: 'TOKEN',
  //   });

  //   // expect(generateToken).toHaveBeenCalledWith(user.id);

  //   expect(generateToken).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       userId: user.id,
  //       token: expect.any(String),
  //       tokenType: TokenType.RESETTOKEN,
  //       createdAt: expect.any(Date),
  //       expiresIn: expect.any(Date),
  //     }),
  //   );
  // });
});
