export const insertPlain = (textToInsert) => {
    var doc = DocumentApp.getActiveDocument();
    var cursor = doc.getCursor();
    if (cursor && (range === null)) {
        // Attempt to insert text at the cursor position. If the insertion returns null, the cursor's
        // containing element doesn't allow insertions, so show the user an error message.
        var cElement = cursor.insertText(textToInsert);
        if (!cElement) {
            textName = null
            DocumentApp.getUi().alert('Cannot insert text here.');
        }
    } else {
        var selection = DocumentApp.getActiveDocument().getSelection();
        if (!selection) {
            textName = null
            DocumentApp.getUi().alert('Insertion omitted: A cursor placed in the text or a selected text is needed to indicate the position of the insertion.');
        } else {
            var elements = selection.getRangeElements();
            var replace = true;
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].isPartial()) {
                    var element = elements[i].getElement().asText();
                    var startIndex = elements[i].getStartOffset();
                    var endIndex = elements[i].getEndOffsetInclusive();
                    var text = element.getText().substring(startIndex, endIndex + 1);
                    element.deleteText(startIndex, endIndex);
                    if (replace) {
                        element.insertText(startIndex, newText);
                        replace = false;
                    }
                } else {
                    var element = elements[i].getElement();
                    if (replace && element.editAsText) {
                        element.clear().asText().setText(newText);
                        replace = false;
                    } else {
                        if (replace && i === elements.length - 1) {
                            var parent = element.getParent();
                            parent[parent.insertText ? 'insertText' : 'insertParagraph'](parent.getChildIndex(element), newText);
                            replace = false; //not really necessary since it's the last one
                        }
                        element.removeFromParent();
                    }
                }
            }
        }
    }
}
