export const insertAny = (textToInsert, textName = null) => {
    var doc = DocumentApp.getActiveDocument();
    var cursor = doc.getCursor();
    var elToName = null;
    if (cursor) {
        // Attempt to insert text at the cursor position. If the insertion returns null, the cursor's
        // containing element doesn't allow insertions, so show the user an error message.
        var cElement = cursor.insertText(textToInsert);
        if (!cElement) {
            textName = null
            DocumentApp.getUi().alert('Cannot insert text here.');
        } else {
            elToName = cElement;
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
                    var tElement = elements[i].getElement().asText();
                    var startIndex = elements[i].getStartOffset();
                    var endIndex = elements[i].getEndOffsetInclusive();
                    var text = tElement.getText().substring(startIndex, endIndex + 1);
                    tElement.deleteText(startIndex, endIndex);
                    if (replace) {
                        tElement.insertText(startIndex, textToInsert);
                        if (elToName === null) {
                            elToName = tElement;
                        }
                        replace = false;
                    }
                } else {
                    var eElement: any = elements[i].getElement();
                    // if not specified as "any", throws type errors for some reason
                    if (replace && eElement.editAsText) {
                        eElement.clear().asText().setText(textToInsert);
                        replace = false;
                        if (elToName === null) {
                            elToName = eElement;
                        }
                    } else {
                        if (replace && i === elements.length - 1) {
                            var parent = eElement.getParent();
                            parent[parent.insertText ? 'insertText' : 'insertParagraph'](parent.getChildIndex(eElement), textToInsert);
                            if (elToName === null) {
                                elToName = eElement;
                            }
                            replace = false; //not really necessary since it's the last one
                        }
                        eElement.removeFromParent();
                    }
                }
            }
        }
    }
    if (textName !== null) {
        if (elToName === null) {
            console.log('No element ID assigned.');
        } else {
            var rangeBuilder = doc.newRange();
            rangeBuilder.addElement(elToName);
            var savedInsert = rangeBuilder.build()
            doc.addNamedRange(textName, savedInsert)
        }
    }
}
