export const insertPlain = (textToInsert) => {
    const doc = DocumentApp.getActiveDocument();
    const cursor = doc.getCursor();
    if (cursor) {
        // Attempt to insert text at the cursor position. If the insertion returns null, the cursor's
        // containing element doesn't allow insertions, so show the user an error message.
        const cElement = cursor.insertText(textToInsert);
        if (!cElement) {
            DocumentApp.getUi().alert('Cannot insert text here.');
        }
    } else {
        const selection = DocumentApp.getActiveDocument().getSelection();
        if (!selection) {
            DocumentApp.getUi().alert('Insertion omitted: A cursor placed in the text or a selected text is needed to indicate the position of the insertion.');
        } else {
            const elements = selection.getRangeElements();
            let replace = true;
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].isPartial()) {
                    const tElement = elements[i].getElement().asText();
                    const startIndex = elements[i].getStartOffset();
                    const endIndex = elements[i].getEndOffsetInclusive();
                    // const text = tElement.getText().substring(startIndex, endIndex + 1);
                    tElement.deleteText(startIndex, endIndex);
                    if (replace) {
                        tElement.insertText(startIndex, textToInsert);
                        replace = false;
                    }
                } else {
                    const element: any = elements[i].getElement();
                    if (replace && element.editAsText) {
                        element.clear().asText().setText(textToInsert);
                        replace = false;
                    } else {
                        if (replace && i === elements.length - 1) {
                            const parent = element.getParent();
                            parent[parent.insertText ? 'insertText' : 'insertParagraph'](parent.getChildIndex(element), textToInsert);
                            replace = false; //not really necessary since it's the last one
                        }
                        element.removeFromParent();
                    }
                }
            }
        }
    }
}
