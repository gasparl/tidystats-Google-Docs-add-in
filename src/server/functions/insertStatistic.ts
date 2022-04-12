import { insertPlain } from './insertPlain';
import { insertURL } from './insertURL';

const doc = DocumentApp.getActiveDocument();

const getIndex = function(e) {
    while (e.getParent().getType() != DocumentApp.ElementType.BODY_SECTION) e = e.getParent();
    return doc.getBody().getChildIndex(e);
};

export const insertStatistic = (statistic: string, id: string) => {
    const cursor = doc.getCursor();
    if (!cursor) {
        DocumentApp.getUi().alert('Please choose a position by placing your cursor in the text.');
    } else {
        const tElement : any = cursor.insertText(statistic + " ");
        if (!tElement) {
            DocumentApp.getUi().alert('Cannot insert text here.');
        } else {
            insertURL(tElement, id, 0, statistic.length - 1)
            doc.setCursor(doc.newPosition(tElement, statistic.length + 1));
        }
    }
}
