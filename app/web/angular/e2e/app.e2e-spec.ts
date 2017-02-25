import { DmDashboardPage } from './app.po';

describe('dm-dashboard App', () => {
  let page: DmDashboardPage;

  beforeEach(() => {
    page = new DmDashboardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('dmd works!');
  });
});
