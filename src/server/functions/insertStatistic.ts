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
        // check if not already a named range
        // const cursorIndex = getIndex(cursor.getElement())
        // let abort = false;
        // let rangeIndex = 0;
        // for (const rangeEntry of doc.getNamedRanges()) {
        //     for (const element of rangeEntry.getRange().getRangeElements()) {
        //         rangeIndex = getIndex(element.getElement());
        //         if (cursorIndex === rangeIndex) {
        //             if (element.isPartial()) {
        //                 let cursorOffset = cursor.getSurroundingTextOffset()
        //                 if (cursorOffset >= element.getStartOffset() && cursorOffset <= element.getEndOffsetInclusive() + 1) {
        //                     abort = true;
        //                     break;
        //                 }
        //             } else {
        //                 abort = true;
        //                 break;
        //             }
        //         }
        //     }
        //     if (abort || rangeIndex > cursorIndex) {
        //         break;
        //     }
        // }
        // if (abort) {
        //     DocumentApp.getUi().alert("Insertion at the cursor's position failed: There is already an interactive field here.");
        //     return null;
        // }
        // if not, proceed to insert
        const tElement : any = cursor.insertText(statistic + " ");
        if (!tElement) {
            DocumentApp.getUi().alert('Cannot insert text here.');
        } else {
            insertURL(tElement, id, 0, statistic.length - 1)
            doc.setCursor(doc.newPosition(tElement, statistic.length + 1));
        }
    }
}
