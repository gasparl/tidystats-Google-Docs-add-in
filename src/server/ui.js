export const onOpen = () => {
  const menu = DocumentApp.getUi()
    .createMenu('tidystats')
    .addItem('Insert statistics', 'openSidebar')
    .addToUi();
};

export const openSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile('sidebar-page');
  html.setTitle("tidystats");
  DocumentApp.getUi().showSidebar(html);
};
