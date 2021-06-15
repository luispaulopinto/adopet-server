import IParseMailTemplateProvider from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseMailTemplateProvider): Promise<string>;
}
