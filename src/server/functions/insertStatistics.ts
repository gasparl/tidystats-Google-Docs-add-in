type StatisticProps = {
    name: string
    identifier: string
    symbol: string
    subscript?: string
    value: string
    checked: boolean
}

const doc = DocumentApp.getActiveDocument();

const insertNamedRange = (statistic: string, id: string, suffix: string) => {
    var cursor = doc.getCursor();
    var cElement = cursor.insertText(statistic);
    if (!cElement) {
        DocumentApp.getUi().alert('Cannot insert text here.');
    } else {
        tElement.setItalic(false);
        var tElement = cElement.asText();
        var startIndex = tElement.getStartOffset();
        var endIndex = tElement.getEndOffsetInclusive();
        var text = tElement.getText().substring(startIndex, endIndex + 1);
        // DocumentApp.getUi().alert(text);

        tElement.insertText(endIndex + 1, suffix);

        var rangeBuilder = doc.newRange();
        rangeBuilder.addElement(tElement, startIndex, endIndex + 1);

        doc.addNamedRange(id, rangeBuilder.build());
        var txtEl = doc.getCursor().getElement();
        var txtOff = doc.getCursor().getOffset();
        var pos = doc.newPosition(txtEl, txtOff + 1);
        doc.setCursor(pos);
    }
}

const appendText = (newText, italic = false) => {
    var txt = doc.getCursor().insertText(newText)
    txt.setItalic(italic);
    var txtEl = doc.getCursor().getElement();
    var txtOff = doc.getCursor().getOffset();
    var pos = doc.newPosition(txtEl, txtOff + 1);
    doc.setCursor(pos);
    return (txt)
}

const insertStatistics = (statistics: StatisticProps[]) => {
    var doc = DocumentApp.getActiveDocument();
    if (!cursor) {
        insertPlain('');
        insertStatistics(statistics);
        //DocumentApp.getUi().alert('Please choose a position by placing your cursor in the text.');
    } else {
        const range = context.document.getSelection()

        // Filter out the unchecked statistics
        let elements = statistics.filter(
            (statistic: StatisticProps) => statistic.checked
        )

        // Filter out the degrees of freedom if there's a test statistic (e.g., t, F)
        if (
            elements.some(
                (statistic: StatisticProps) => statistic.name === "statistic"
            )
        ) {
            elements = elements.filter(
                (statistic: StatisticProps) =>
                    !["df", "df numerator", "df denominator"].includes(statistic.name)
            )
        }

        // If both the lower and upper bound of an interval are present, remove one
        const lower = statistics.find((x: StatisticProps) => x.name === "lower")
        const upper = statistics.find((x: StatisticProps) => x.name === "upper")

        if (lower && upper) {
            elements = elements.filter(
                (statistic: StatisticProps) => statistic.name !== "upper"
            )
        }

        // Loop over the remaining elements and insert them
        elements.forEach((statistic: StatisticProps, i: number) => {

            // Add the degrees of freedom in parentheses if there's a test statistic
            const lower = statistics.find((x: StatisticProps) => x.name === "lower")
            const upper = statistics.find((x: StatisticProps) => x.name === "upper")

            if (statistic.name === "lower" && lower && upper) {
                appendText(statistic.symbol)
                appendText(" [")
                insertNamedRange(statistic = lower.value, id = lower.identifier, suffix = ',')
                insertNamedRange(statistic = upper.value, id = upper.identifier, suffix = ']')
            } else {
                if (statistic.name === "statistic") {
                    if (
                        statistic.symbol === "t" &&
                        statistics.find((x: StatisticProps) => x.name === "df")
                    ) {
                        appendText(statistic.symbol, true)
                        appendText("(")

                        const df = statistics.find((x: StatisticProps) => x.name === "df")
                        if (df) {
                            insertNamedRange(statistic = df.value, id = df.identifier, suffix = ')')
                        }
                    } else if (
                        statistic.symbol === "F" &&
                        statistics.find((x: StatisticProps) => x.name === "df numerator") &&
                        statistics.find((x: StatisticProps) => x.name === "df denominator")
                    ) {
                        appendText(statistic.symbol, true)
                        appendText("(")

                        const dfNum = statistics.find(
                            (x: StatisticProps) => x.name === "df numerator"
                        )
                        if (dfNum) {
                            insertNamedRange(statistic = dfNum.value, id = dfNum.identifier, suffix = ', ')
                        }
                        const dfDen = statistics.find(
                            (x: StatisticProps) => x.name === "df denominator"
                        )
                        if (dfDen) {
                            insertNamedRange(statistic = dfDen.value, id = dfDen.identifier, suffix = ')')
                        }
                    }
                } else {
                    appendText(statistic.symbol, true)
                    if (statistic.subscript) {
                        appendText(statistic.subscript).setTextAlignment(DocumentApp.TextAlignment.SUPERSCRIPT);
                    }
                }

                // Insert an equal sign and set the style back to normal
                appendText(" = ").setTextAlignment(DocumentApp.TextAlignment.NORMAL);

                // For the last element append a plain space as suffix; for the rest append a comma
                if (i !== elements.length - 1) {
                    suffix = ' '
                } else {
                    suffix = ', '
                }
                // Insert the value as a content control
                insertNamedRange(statistic = statistic.value, id = statistic.identifier, suffix = suffix)

            }
        })
    }
}

export { insertStatistics }
