import { insertAny } from './insertAny';

export const updateNamedRange = (textName, newText) => {
    var doc = DocumentApp.getActiveDocument();
    var myNamedRanges = doc.getNamedRanges(textName);
    for (var i = 0; i < myNamedRanges.length; i++) {
        var range = myNamedRanges[i].getRange();
        insertAny(newText, textName, range);
    }
}
