import { Tidystats } from "../../client/sidebar-page/classes/Tidystats"
import { formatValue } from "../../client/sidebar-page/components/formatValue"

const doc = DocumentApp.getActiveDocument()

const updateRange = (rangeName, textToInsert, range) => {
    var rangeBuilder = doc.newRange();
    var selection = range;
    var rangeElement = range.getRangeElements()[0];
    if (rangeElement.isPartial()) {
        var tElement = rangeElement.getElement().asText();
        var startIndex = rangeElement.getStartOffset();
        var endIndex = rangeElement.getEndOffsetInclusive();
        var text = tElement.getText().substring(startIndex, endIndex + 1);
        tElement.insertText(endIndex + 1, 'x');
        tElement.deleteText(startIndex, endIndex);
        tElement.insertText(startIndex + 1, textToInsert);
        if (rangeBuilder === null) {
            rangeBuilder = doc.newRange();
            rangeBuilder.addElement(tElement, startIndex + 1, startIndex + 1 + textToInsert.length - 1);
        }
    } else {
        var eElement: any = rangeElement.getElement();
        // if not specified as "any", throws type errors for some reason
        if (eElement.editAsText) {
            eElement.clear().asText().setText(textToInsert);
        } else {
            var parent = eElement.getParent();
            parent[parent.insertText ? 'insertText' : 'insertParagraph'](parent.getChildIndex(eElement), textToInsert);
            eElement.removeFromParent();
        }
        rangeBuilder.addElement(eElement);
    }
    doc.addNamedRange(rangeName, rangeBuilder.build());
}

const updateStatistics = (tidystats: Tidystats) => {
    console.log("Updating statistic")
    // Find all content control items in the document
    const myNamedRanges = doc.getNamedRanges();

    // Loop over the content controls items and update the statistics
    for (const myNamedRange of myNamedRanges) {
        // Find the statistic
        const item_tag = myNamedRange.getName()
        const statistic = tidystats.findStatistic(item_tag)

        // Replace the statistic reported in the document with the new one, if there is one
        if (statistic) {
            // Check whether a lower or upper bound was reported
            const components = item_tag.split("$")

            let bound
            if (components[components.length - 1].match(/lower|upper/)) {
                bound = components.pop()
            }

            const value = formatValue(statistic, 2, bound as "lower" | "upper")

            // remove named range, update text, reset named range
            var range = myNamedRange.getRange();
            myNamedRange.remove();
            updateRange(item_tag, value, range);
        }
    }

}

export { updateStatistics }

// perhaps for later:
// function clearNamedRanges() {
//   DocumentApp.getActiveDocument().getNamedRanges().forEach(r => {
//     r.remove();
//   })
// }
