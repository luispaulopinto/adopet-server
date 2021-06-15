export interface IJwtCreateResponse {
  token: string;
  expiresIn: string;
}

export interface ISignOptions {
  subject: string;
}

export default interface IJwtProvider {
  create(
    payload: string | Buffer | object,
    options?: ISignOptions,
  ): IJwtCreateResponse;
  verify(token: string): string | object;
}
