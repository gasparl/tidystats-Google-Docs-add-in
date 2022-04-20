export const onOpen = () => {

    const documentProperties = PropertiesService.getDocumentProperties();
    if (documentProperties.getProperty('tidyFontColor') === null) {
        documentProperties.setProperty('tidyFontColor', '#000000');
    }
    const menu = DocumentApp.getUi()
        .createMenu('tidystats')
        .addItem('📊 Insert statistics', 'openSidebar')
        .addItem('🖌 Font color', 'openDialogColor')
        .addItem('❗ Replace all', 'openDialogReplace')
        .addToUi();
};

export const openSidebar = () => {
    const html = HtmlService.createHtmlOutputFromFile('sidebar-page');
    html.setTitle("tidystats");
    DocumentApp.getUi().showSidebar(html);
};


export const openDialogColor = () => {
    const html = HtmlService.createHtmlOutputFromFile('dialog-color-page');
    DocumentApp.getUi().showModalDialog(html, 'tidystats: font color');
};

export const openDialogReplace = () => {
    const html = HtmlService.createHtmlOutputFromFile('dialog-replace-page');
    DocumentApp.getUi().showModalDialog(html, 'tidystats: replace all');
};
