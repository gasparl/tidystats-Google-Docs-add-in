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
        const cursorIndex = getIndex(cursor.getElement())
        doc.getNamedRanges().forEach(function(rangeEntry) {
            rangeEntry.getRange().getRangeElements().forEach(element => {
                if (cursorIndex == getIndex(element.getElement())) {
                    if (element.isPartial()) {
                        let cursorOffset = cursorIndex.getOffset()
                        if (cursorOffset < element.getStartOffset() || cursorOffset > element.getEndOffsetInclusive()) {
                            DocumentApp.getUi().alert("Insertion at the cursor's position failed: There is already an interactive field here. (partial text)");
                        }
                    } else {
                        DocumentApp.getUi().alert("Insertion at the cursor's position failed: There is already an interactive field here. (ELEMENT)");
                    }
                }
            });
        })
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
