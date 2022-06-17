export const tidyID = 'tidystats.io/#id=';

const tidyFontColor = PropertiesService.getDocumentProperties().getProperty('tidyFontColor');

export const insertURL = (elem, id, start = null, end = null) => {
    // DocumentApp.getUi().alert(JSON.stringify(tidyFontColor));
    if (start === null) {
        elem.setLinkUrl(tidyID + id)
        elem.setUnderline(false)
        elem.setForegroundColor(tidyFontColor)
    } else {
        elem.setLinkUrl(start, end, tidyID + id)
        elem.setUnderline(start, end, false)
        elem.setForegroundColor(start, end, tidyFontColor)
    }
}
