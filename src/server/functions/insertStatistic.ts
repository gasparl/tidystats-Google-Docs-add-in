import { insertPlain } from './insertPlain';

const doc = DocumentApp.getActiveDocument();

const getIndex = function(e) {
    while (e.getParent().getType() != DocumentApp.ElementType.BODY_SECTION) e = e.getParent();
    return doc.getBody().getChildIndex(e);
};

export const insertStatistic = (statistic: string, id: string) => {
    const cursor = doc.getCursor();
    if (!cursor) {
        insertPlain('');
        insertStatistic(statistic, id);
        //DocumentApp.getUi().alert('Please choose a position by placing your cursor in the text.');
    } else {
        // check if not already a named range
        const namedRangeIndexes = [];
        doc.getNamedRanges().forEach(function(rangeEntry) {
            [].push.apply(namedRangeIndexes, rangeEntry.getRange().getRangeElements().map(e => getIndex(e.getElement())));
        })
        //DocumentApp.getUi().alert(JSON.stringify(namedRangeIndexes));
        //DocumentApp.getUi().alert(JSON.stringify(getIndex(cursor.getElement())));
        if (namedRangeIndexes.indexOf(getIndex(cursor.getElement())) !== -1) {
            DocumentApp.getUi().alert("Insertion at the cursor's position failed: There is already an interactive field here.");
            return;
        }
        // if not, proceed to insert
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
