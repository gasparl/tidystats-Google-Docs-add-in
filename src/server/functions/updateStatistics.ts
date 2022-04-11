import { Tidystats } from "../../client/sidebar-page/classes/Tidystats"
import { formatValue } from "../../client/sidebar-page/components/formatValue"
import { insertURL } from './insertURL';

const doc = DocumentApp.getActiveDocument()


/** (First modified from https://stackoverflow.com/a/40730088/3199106)
 * (Then modified from https://github.com/zotero/zotero-google-docs-integration/)
 * Returns a flat array of links which appear in the active document's body.
 * Each link is represented by a simple Javascript object with the following
 * keys:
 *	 - "section": {ContainerElement} the document section in which the link is
 *		 found.
 *	 - "isFirstPageSection": {Boolean} whether the given section is a first-page
 *		 header/footer section.
 *	 - "paragraph": {ContainerElement} contains a reference to the Paragraph
 *		 or ListItem element in which the link is found.
 *	 - "text": the Text element in which the link is found.
 *	 - "startOffset": {Number} the position (offset) in the link text begins.
 *	 - "endOffsetInclusive": the position of the last character of the link
 *			text, or null if the link extends to the end of the text element.
 *	 - "url": the URL of the link.
 *
 *
 * @returns {Array} the aforementioned flat array of links.
 */
const updateStatistics = (tidystatsAnalyses) => {
    tidystatsAnalyses = JSON.parse(tidystatsAnalyses)
    let footnoteIndex = 0;
    iterateSections(doc, function iterateSection(section, sectionIndex, isFirstPageSection, footnote) {
        if (typeof section.getParagraphs != 'function') {
            // as we're using some undocumented API, adding this to avoid cryptic
            // messages upon possible API changes.
            throw new Error("An API change has caused this script to stop " +
                "working.\n" +
                "Section #" + sectionIndex + " of type " +
                section.getType() + " has no .getParagraphs() method. " +
                "Stopping script.");
        }
        section.getParagraphs().forEach(function(par) {
            // skip empty paragraphs
            if (par.getNumChildren() == 0) {
                return;
            }
            // go over all text elements in paragraph / list-item
            for (let el = par.getChild(0); el != null; el = el.getNextSibling()) {
                if (el.getType() == DocumentApp.ElementType.FOOTNOTE) {
                    const sect = el.asFootnote().getFootnoteContents();
                    footnoteIndex++;
                    if (!sect || typeof sect != "object") {
                        continue;
                    }
                    iterateSection(sect, -1, false, true);
                    continue;
                } else if (el.getType() != DocumentApp.ElementType.TEXT) {
                    continue;
                }
                // go over all styling segments in text element
                const attributeIndices = el.getTextAttributeIndices();
                let lastLink = null;
                let lastEndOffset = null;
                attributeIndices.forEach(function(startOffset, i, attributeIndices) {
                    const url = el.getLinkUrl(startOffset);
                    if (url !== null && url ?.indexOf('https://www.tidystats.io/?id=') === 0) {
                        // we hit a link

                        let item_tag = url.substring(29);
                        const statistic = findStatistic(item_tag, tidystatsAnalyses)

                        // Replace the statistic reported in the document with the new one, if there is one
                        if (statistic) {
                            // Check whether a lower or upper bound was reported
                            const components = item_tag.split("$")

                            let bound
                            if (components[components.length - 1].match(/lower|upper/)) {
                                bound = components.pop()
                            }

                            const newValue = formatValue(statistic, 2, bound as "lower" | "upper")

                            const endOffsetInclusive = (i + 1 < attributeIndices.length ?
                                attributeIndices[i + 1] - 1 : el.getText().length - 1);
                            // check if this and the last found link are continuous
                            if (lastLink == url &&
                                (startOffset - 1 <= lastEndOffset)) {
                                // this and the previous style segment are continuous
                                lastEndOffset = endOffsetInclusive;
                            } else {
                                el.insertText(endOffsetInclusive + 1, newValue);
                                lastLink = url;
                                lastEndOffset = startOffset + newValue.length;
                                el.deleteText(startOffset, endOffsetInclusive + 0);

                                //DocumentApp.getUi().alert(JSON.stringify(lastEndOffset));
                            }
                        }
                    }
                });
            }
        });
    });
}

/**
 * Calls the given function for each section of the document (body, header,
 * etc.). Sections are children of the DocumentElement object.
 *
 * @param {Document} doc The Document object (such as the one obtained via
 *		 a call to DocumentApp.getActiveDocument()) with the sections to iterate
 *		 over.
 * @param {Function} func A callback function which will be called, for each
 *		 section, with the following arguments (in order):
 *			 - {ContainerElement} section - the section element
 *			 - {Number} sectionIndex - the child index of the section, such that
 *				 doc.getBody().getParent().getChild(sectionIndex) == section.
 *			 - {Boolean} isFirstPageSection - whether the section is a first-page
 *				 header/footer section.
 */
const iterateSections = (doc, func) => {
    // get the DocumentElement interface to iterate over all sections
    // this bit is undocumented API
    const docEl = doc.getBody().getParent();

    const regularHeaderSectionIndex = (doc.getHeader() == null ? -1 :
        docEl.getChildIndex(doc.getHeader()));
    const regularFooterSectionIndex = (doc.getFooter() == null ? -1 :
        docEl.getChildIndex(doc.getFooter()));

    for (let i = 0; i < docEl.getNumChildren(); ++i) {
        const section = docEl.getChild(i);

        const sectionType = section.getType();
        const isFirstPageSection = (
            i != regularHeaderSectionIndex &&
            i != regularFooterSectionIndex &&
            (sectionType == DocumentApp.ElementType.HEADER_SECTION ||
                sectionType == DocumentApp.ElementType.FOOTER_SECTION));

        // Footnotes are checked when going over the body of the doc
        if (section.getType() != DocumentApp.ElementType.FOOTNOTE_SECTION) {
            func(section, i, isFirstPageSection);
        }
    }
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


export { updateStatistics }
