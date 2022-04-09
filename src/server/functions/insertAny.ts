export const insertAny = (textToInsert, textName = null, range = null) => {
    var doc = DocumentApp.getActiveDocument();
    var cursor = doc.getCursor();
    var rangeBuilder = null;
    if (cursor && (range === null)) {
        // Attempt to insert text at the cursor position. If the insertion returns null, the cursor's
        // containing element doesn't allow insertions, so show the user an error message.
        var cElement = cursor.insertText(textToInsert);
        if (!cElement) {
            textName = null
            DocumentApp.getUi().alert('Cannot insert text here.');
        } else {
            rangeBuilder = doc.newRange();
            rangeBuilder.addElement(cElement);
        }
    } else {
        var selection;
        if (range === null) {
            selection = DocumentApp.getActiveDocument().getSelection();
        } else {
            selection = range;
        }
        if (!selection) {
            textName = null
            DocumentApp.getUi().alert('Insertion omitted: A cursor placed in the text or a selected text is needed to indicate the position of the insertion.');
        } else {
            var elements = selection.getRangeElements();
            var replace = true;
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].isPartial()) {
                    var tElement = elements[i].getElement().asText();
                    var startIndex = elements[i].getStartOffset();
                    var endIndex = elements[i].getEndOffsetInclusive();
                    var text = tElement.getText().substring(startIndex, endIndex + 1);
                    DocumentApp.getUi().alert(text);
                    if (replace) {
                        tElement.insertText(endIndex + 1, textToInsert);
                        if (rangeBuilder === null) {
                            rangeBuilder = doc.newRange();
                            rangeBuilder.addElement(tElement, endIndex + 1, endIndex + 1 + textToInsert.length - 1);
                        }
                        replace = false;
                    }
                    tElement.deleteText(startIndex, endIndex);

                } else {
                    var eElement: any = elements[i].getElement();
                    // if not specified as "any", throws type errors for some reason
                    if (replace && eElement.editAsText) {
                        eElement.clear().asText().setText(textToInsert);
                        replace = false;
                        // if (rangeBuilder === null) {
                        //     rangeBuilder = doc.newRange();
                        //     rangeBuilder.addElement(eElement);
                        // }
                    } else {
                        if (replace && i === elements.length - 1) {
                            var parent = eElement.getParent();
                            parent[parent.insertText ? 'insertText' : 'insertParagraph'](parent.getChildIndex(eElement), textToInsert);
                            // if (rangeBuilder === null) {
                            //     rangeBuilder = doc.newRange();
                            //     rangeBuilder.addElement(eElement);
                            // }
                            replace = false; //not really necessary since it's the last one
                        }
                        eElement.removeFromParent();
                    }
                }
            }
        }
    }
    if (textName !== null && rangeBuilder !== null) {
        doc.addNamedRange(textName, rangeBuilder.build());
    }
}
