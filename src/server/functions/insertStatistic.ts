import { insertPlain } from './insertPlain';

export const insertStatistic = (statistic: string, id: string, suffix: string = " ") => {
    var doc = DocumentApp.getActiveDocument();
    var cursor = doc.getCursor();
    var rangeBuilder = null;
    if (!cursor) {
        insertPlain('');
        insertStatistic(statistic, id, suffix);
        //DocumentApp.getUi().alert('Please choose a position by placing your cursor in the text.');
    } else {
        var cElement = cursor.insertText(statistic);
        if (!cElement) {
            DocumentApp.getUi().alert('Cannot insert text here.');
        } else {

            var tElement = cElement.asText();
            var startIndex = tElement.getStartOffset();
            var endIndex = tElement.getEndOffsetInclusive();
            var text = tElement.getText().substring(startIndex, endIndex + 1);
            DocumentApp.getUi().alert(text);

            tElement.insertText(endIndex + 1, suffix);

            rangeBuilder = doc.newRange();
            rangeBuilder.addElement(tElement, startIndex + 1, endIndex);

            doc.addNamedRange(id, rangeBuilder.build());
        }
    }
}
