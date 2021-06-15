import IMailTemplateProvider from '../contracts/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail content.';
  }
}

export default FakeMailTemplateProvider;
