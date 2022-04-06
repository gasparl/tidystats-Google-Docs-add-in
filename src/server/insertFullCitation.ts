const insertFullCitation = () => {
    var cursor = DocumentApp.getActiveDocument().getCursor();
    if (cursor) {
        // Attempt to insert text at the cursor position. If the insertion returns null, the cursor's
        // containing element doesn't allow insertions, so show the user an error message.
        var element = cursor.insertText('Sleegers, W. W. A. (2021). tidystats: Save output of statistical tests (Version 0.51) [Computer software]. https://doi.org/10.5281/zenodo.4041859');
        if (!element) {
            DocumentApp.getUi().alert('Cannot insert text here.');
        }
    } else {
        DocumentApp.getUi().alert('Cannot find a cursor.');
    }
}

export { insertFullCitation }
