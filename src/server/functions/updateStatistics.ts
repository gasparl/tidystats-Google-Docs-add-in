import { Tidystats } from "../../client/sidebar-page/classes/Tidystats"
import { formatValue } from "../../client/sidebar-page/components/formatValue"

const doc = DocumentApp.getActiveDocument()

const updateRange = (rangeName, textToInsert, prevRange) => {
    const rangeBuilder = doc.newRange();
    const selection = prevRange;
    const rangeElement = prevRange.getRangeElements()[0];
    if (rangeElement.isPartial()) {
        const tElement = rangeElement.getElement().asText();
        const startIndex = rangeElement.getStartOffset();
        const endIndex = rangeElement.getEndOffsetInclusive();
        // const text = tElement.getText().substring(startIndex, endIndex + 1);
        tElement.insertText(endIndex + 1, 'x');
        tElement.deleteText(startIndex, endIndex);
        tElement.insertText(startIndex + 1, textToInsert);
        rangeBuilder.addElement(tElement, startIndex + 1, startIndex + 1 + textToInsert.length - 1);
        tElement.deleteText(startIndex, startIndex);
    } else {
        const eElement = rangeElement.getElement();
        // if not specified as "any", throws type errors for some reason
        if (eElement.editAsText) {
            eElement.clear().asText().setText(textToInsert);
        } else {
            const parent = eElement.getParent();
            parent[parent.insertText ? 'insertText' : 'insertParagraph'](parent.getChildIndex(eElement), textToInsert);
            eElement.removeFromParent();
        }
        rangeBuilder.addElement(eElement);
    }
    doc.addNamedRange(rangeName, rangeBuilder.build());
}

const findStatistic = (id: string, analyses) => {
    // Split the identifier up in the separate components
    const components = id.split("$")

    // Check if the statistic is a lower or upper bound statistic
    // If so, remove the last component
    if (components[components.length - 1].match(/lower|upper/)) {
        components.pop()
    }

    // Split up the components into the identifier, the statistics name, and everything else as group names
    const identifier = components[0]
    const statisticName = components[components.length - 1]
    const groupNames = components.slice(1, components.length - 1)

    // Find the analysis based on the identifier
    const analysis = analyses.find((x) => x.identifier === identifier)

    // Find the statistics
    let statistic, statistics

    if (groupNames.length) {
        let groups, group

        groups = analysis ?.groups

    for (let i = 0; i < groupNames.length; i++) {
            group = groups ?.find((x) => x.name === groupNames[i])

      if (i < groupNames.length) {
                group = groups ?.find((x) => x.name === groupNames[i])
        groups = group ?.groups
      }
        }

        statistics = group ?.statistics
  } else {
        statistics = analysis ?.statistics
  }

    // Find the statistic
    statistic = statistics ?.find((x) => x.name === statisticName)

  return statistic
}

const updateStatistics = (tidystatsAnalyses) => {
    console.log("Updating statistics")

    tidystatsAnalyses = JSON.parse(tidystatsAnalyses)

    // Find all content control items in the document
    const myNamedRanges = doc.getNamedRanges();

    // Loop over the content controls items and update the statistics
    for (const myNamedRange of myNamedRanges) {
        // Find the statistic
        const item_tag = myNamedRange.getName()

        const statistic = findStatistic(item_tag, tidystatsAnalyses)

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
            const myRange = myNamedRange.getRange();
            myNamedRange.remove();
            updateRange(item_tag, value, myRange);
        }
    }

}

export { updateStatistics }
