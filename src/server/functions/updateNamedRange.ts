import { insertAny } from './insertAny';

export const updateNamedRange = (textName, newText) => {
    var doc = DocumentApp.getActiveDocument();
    var myNamedRanges = doc.getNamedRanges(textName);
    for (var i = 0; i < myNamedRanges.length; i++) {
        var myrange = myNamedRanges[i].getRange();
        doc.setSelection(myrange);
        insertAny(newText, textName);
    }
}
