import { insertPlain } from './insertPlain';

export const insertStatistic = (statistic: string, id: string) => {
    const doc = DocumentApp.getActiveDocument();
    const cursor = doc.getCursor();
    if (!cursor) {
        insertPlain('');
        insertStatistic(statistic, id);
        //DocumentApp.getUi().alert('Please choose a position by placing your cursor in the text.');
    } else {
        const tElement = cursor.insertText(statistic + " ");
        if (!tElement) {
            DocumentApp.getUi().alert('Cannot insert text here.');
        } else {
            const rangeBuilder = doc.newRange();
            rangeBuilder.addElement(tElement, 0, statistic.length - 1);
            doc.addNamedRange(id, rangeBuilder.build());
        }
    }
}
