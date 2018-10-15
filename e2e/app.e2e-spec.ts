import { WebPcPage } from './app.po';

describe('web-pc App', function() {
  let page: WebPcPage;

  beforeEach(() => {
    page = new WebPcPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
