import { Tidystats } from "../../client/sidebar-page/classes/Tidystats"
import { formatValue } from "../../client/sidebar-page/components/formatValue"
import { insertURL } from './insertURL';

const doc = DocumentApp.getActiveDocument()
const updateStatistics = (tidystatsAnalyses) => {
    console.log("Updating statistics")
    //DocumentApp.getUi().alert('Updating statistics.');
    tidystatsAnalyses = JSON.parse(tidystatsAnalyses)

    const allLinks = getAllLinks();
    const allIDs = [];
    for (const link of allLinks) {
        const rangeBuilder = doc.newRange();
        rangeBuilder.addElement(link.text, link.startOffset, link.endOffsetInclusive);
        doc.addNamedRange(link.id, rangeBuilder.build());
        if (allIDs.indexOf(link.id) === -1) {
            allIDs.push(link.id);
        }
    }
    for (const id of allIDs) {
        const statistic = findStatistic(id, tidystatsAnalyses);
        // Replace the statistic reported in the document with the new one, if there is one
        if (statistic) {
            // Check whether a lower or upper bound was reported
            const components = id.split("$")
            let bound
            if (components[components.length - 1].match(/lower|upper/)) {
                bound = components.pop()
            }
            const value = formatValue(statistic, 2, bound as "lower" | "upper")

            // Loop over the content controls items and update the statistics
            for (const myNamedRange of doc.getNamedRanges(id)) {
                // remove named range, update text, reset URL
                const myRange = myNamedRange.getRange();
                myNamedRange.remove();
                // update range elements
                for (const rangeElement of myRange.getRangeElements()) {
                    if (rangeElement.isPartial()) {
                        const tElement = rangeElement.getElement().asText();
                        const startIndex = rangeElement.getStartOffset();
                        const endIndex = rangeElement.getEndOffsetInclusive();
                        tElement.insertText(endIndex + 1, value);
                        tElement.deleteText(startIndex, endIndex);
                    } else {
                        const eElement: any = rangeElement.getElement();
                        // if not specified as "any", throws type errors for some reason
                        if (eElement.editAsText) {
                            eElement.clear().asText().setText(value);
                        } else {
                            const parent = eElement.getParent();
                            parent[parent.insertText ? 'insertText' : 'insertParagraph'](parent.getChildIndex(eElement), value);
                            eElement.removeFromParent();
                        }
                    }
                }
            }
        }
    }
}


/** Below, the getAllLinks function and the related iterateSection function were
 * first modified for Zotero from https://stackoverflow.com/a/40730088/3199106.
 * Then that code from Zotero was modified for the purpose here.
 * (Zotero source code: https://github.com/zotero/zotero-google-docs-integration/)
 * So, technically, they should be licensed under Zotero's GNU AGPL as follows.
 	***** BEGIN LICENSE BLOCK *****

 	Copyright © 2018 Center for History and New Media
 					George Mason University, Fairfax, Virginia, USA
 					http://zotero.org
    Copyright © 2022 Gáspár Lukács

 	This is free software: you can redistribute it and/or modify
 	it under the terms of the GNU Affero General Public License as published by
 	the Free Software Foundation, either version 3 of the License, or
 	(at your option) any later version.

 	This software is distributed in the hope that it will be useful,
 	but WITHOUT ANY WARRANTY; without even the implied warranty of
 	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 	GNU Affero General Public License for more details.
 	(http://www.gnu.org/licenses/)

 	***** END LICENSE BLOCK *****
 */

 /**
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

const getAllLinks = () => {
    const links = [];
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
                attributeIndices.forEach(function(startOffset, i, attributeIndices) {
                    const url = el.getLinkUrl(startOffset);
                    if (url != null && url ?.indexOf('https://www.tidystats.io/?id=') === 0) {
                        // we hit a link
                        const endOffsetInclusive = (i + 1 < attributeIndices.length ?
                            attributeIndices[i + 1] - 1 : el.getText().length - 1);
                        // check if this and the last found link are continuous
                        if (lastLink != null && lastLink.url == url &&
                            lastLink.endOffsetInclusive == startOffset - 1) {
                            // this and the previous style segment are continuous
                            lastLink.endOffsetInclusive = endOffsetInclusive;
                            return;
                        }
                        lastLink = {
                            // section: section,
                            // isFirstPageSection: isFirstPageSection,
                            // paragraph: par,
                            text: el,
                            startOffset: startOffset,
                            endOffsetInclusive: endOffsetInclusive,
                            url: url,
                            id: url.substring(29),
                            // footnoteIndex: footnote ? footnoteIndex : 0
                        };
                        links.push(lastLink);
                    }
                });
            }
        });
    });
    return links;
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
