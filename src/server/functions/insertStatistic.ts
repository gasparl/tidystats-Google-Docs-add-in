import { insertPlain } from './insertPlain';

export const insertStatistic = (statistic: string, id: string) => {
    var doc = DocumentApp.getActiveDocument();
    var cursor = doc.getCursor();
    if (!cursor) {
        insertPlain('');
        insertStatistic(statistic, id);
        //DocumentApp.getUi().alert('Please choose a position by placing your cursor in the text.');
    } else {
        var tElement = cursor.insertText(statistic + " ");
        if (!tElement) {
            DocumentApp.getUi().alert('Cannot insert text here.');
        } else {
            var rangeBuilder = doc.newRange();
            rangeBuilder.addElement(tElement, 0, statistic.length);
            doc.addNamedRange(id, rangeBuilder.build());
        }
    }
}
