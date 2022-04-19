export const onOpen = () => {
  const menu = DocumentApp.getUi()
    .createMenu('tidystats')
    .addItem('Insert statistics', 'openSidebar')
    .addItem('Font color', 'openDialog')
    .addToUi();
};

export const openSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile('sidebar-page');
  html.setTitle("tidystats");
  DocumentApp.getUi().showSidebar(html);
};


export const openDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-page');
  DocumentApp.getUi().showModalDialog(html, 'tidystats font color');
};
