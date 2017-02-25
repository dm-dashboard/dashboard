import { browser, element, by } from 'protractor';

export class DmDashboardPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('dmd-root h1')).getText();
  }
}
