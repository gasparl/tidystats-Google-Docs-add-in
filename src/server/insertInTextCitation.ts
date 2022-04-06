const insertInTextCitation = () => {
    var cursor = DocumentApp.getActiveDocument().getCursor();
    if (cursor) {
        // Attempt to insert text at the cursor position. If the insertion returns null, the cursor's
        // containing element doesn't allow insertions, so show the user an error message.
        var element = cursor.insertText('Sleegers (2021)');
        if (!element) {
            DocumentApp.getUi().alert('Cannot insert text here.');
        }
    } else {
        DocumentApp.getUi().alert('Cannot find a cursor.');
    }
}

export { insertInTextCitation }
