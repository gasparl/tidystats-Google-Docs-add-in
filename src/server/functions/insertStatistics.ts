import { insertPlain } from './insertPlain';
import { insertURL } from './insertURL';

type StatisticProps = {
    name: string
    identifier: string
    symbol: string
    subscript?: string
    value: string
    checked: boolean
}

const doc = DocumentApp.getActiveDocument();
const cursor = doc.getCursor();

const insertNamedRange = (statistic: string, id: string, suffix: string) => {
    const tElement: any = cursor.insertText(statistic + suffix);
    if (!tElement) {
        DocumentApp.getUi().alert('Cannot insert text here.');
    } else {
        //const text = tElement.getText().substring(startIndex, endIndex + 1);
        // DocumentApp.getUi().alert(text);
        tElement.setItalic(false);
        const rangeBuilder = doc.newRange();
        rangeBuilder.addElement(tElement, 0, statistic.length - 1);
        doc.addNamedRange(id, rangeBuilder.build());
        insertURL(tElement, id, 0, statistic.length - 1)
        doc.setCursor(doc.newPosition(tElement, statistic.length + suffix.length));
    }
}

const appendText = (newText, italic = false) => {
    const txt: any = cursor.insertText(newText)
    doc.setCursor(doc.newPosition(txt, newText.length));
    txt.setItalic(italic);
    return (txt)
}

const insertStatistics = (statistics: StatisticProps[]) => {
    if (!cursor) {
        DocumentApp.getUi().alert('Please choose a position by placing your cursor in the text.');
    } else {

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

            // For the last element append a plain space as suffix; for the rest append a comma
            let suffix
            if (i === elements.length - 1) {
                suffix = ' '
            } else {
                suffix = ', '
            }

            // Add the degrees of freedom in parentheses if there's a test statistic
            const lower = statistics.find((x: StatisticProps) => x.name === "lower")
            const upper = statistics.find((x: StatisticProps) => x.name === "upper")

            if (statistic.name === "lower" && lower && upper) {
                appendText(statistic.symbol)
                appendText(" [")
                insertNamedRange(lower.value, lower.identifier, ',')
                insertNamedRange(upper.value, upper.identifier, ']' + suffix)
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
                            insertNamedRange(df.value, df.identifier, ')')
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
                            insertNamedRange(dfNum.value, dfNum.identifier, ', ')
                        }
                        const dfDen = statistics.find(
                            (x: StatisticProps) => x.name === "df denominator"
                        )
                        if (dfDen) {
                            insertNamedRange(dfDen.value, dfDen.identifier, ')')
                        }
                    }
                } else {
                    appendText(statistic.symbol, true)
                    if (statistic.subscript) {
                        appendText(statistic.subscript).setTextAlignment(DocumentApp.TextAlignment.SUBSCRIPT);
                    }
                }

                // Insert an equal sign and set the style back to normal
                appendText(" = ").setTextAlignment(DocumentApp.TextAlignment.NORMAL);

                // Insert the value as a content control
                insertNamedRange(statistic.value, statistic.identifier, suffix)

            }
        })
    }
}

export { insertStatistics }
