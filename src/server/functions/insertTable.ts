import { Group } from "../../client/sidebar-page/classes/Group"
import { formatValue } from "../../client/sidebar-page/components/formatValue"
import { insertURL } from './insertURL';

const doc = DocumentApp.getActiveDocument();

/**
 * "splitParagraphAt()" from: https://stackoverflow.com/a/40675038/9593181
 *
 * Splits the contents of the paragraph (or list item) at the given position,
 * producing two adjacent paragraphs (or list items). This function may be used
 * to insert any kind of element at an arbitrary document position, but placing
 * it immediately before the second paragraph (or list item).
 *
 * @param {Position} pos The position where the paragraph (or list item) should
 *     be split. `pos.getElement()` should be either a Text, Paragraph or
 *     ListItem object.
 *
 * @returns {ContainerElement} The second (newly created) Paragraph or ListItem
 *     object.
 *
 */
const splitParagraphAt = (pos) => {
    let el = pos.getElement(), offset = pos.getOffset();

    const inParagraph = (el.getType() == DocumentApp.ElementType.PARAGRAPH || el.getType() == DocumentApp.ElementType.LIST_ITEM);

    if (!inParagraph && (el.getType() != DocumentApp.ElementType.TEXT)) {
        throw new Error("Position must be inside text or paragraph.");
    }

    let par;
    if (inParagraph) {
        // in this case, `offset` is the number of child elements before this
        // Position within the same container element
        par = el;
        if (offset == par.getNumChildren()) {
            // we're at the end of the paragraph
            return par.getParent().insertParagraph(
                par.getParent().getChildIndex(par) + 1, "");
        }
        el = par.getChild(offset);
    }
    else {
        par = el.getParent();

        if (par == null || (par.getType() != DocumentApp.ElementType.PARAGRAPH && par.getType() != DocumentApp.ElementType.LIST_ITEM)) {
            throw new Error("Parent of text is not a paragraph or a list item.");
        }
    }

    const parContainer = par.getParent();

    if (!("insertParagraph" in parContainer)) {
        throw new Error("Cannot insert another paragraph in this container.");
    }

    // This assumes the given position is in the current document.
    // alternatively, one may traverse through parents of par until document
    // root is reached.
    //const doc = DocumentApp.getActiveDocument();

    const elIndex = par.getChildIndex(el);
    const newPar = par.copy();

    let newEl = newPar.getChild(elIndex);

    // remove everything up to position from the new element
    if (!inParagraph && (offset != 0)) {
        newEl.deleteText(0, offset - 1);
    }
    newEl = newEl.getPreviousSibling();
    while (newEl != null) {
        // get the previous sibling before we remove the element.
        let prevEl = newEl.getPreviousSibling();
        newEl.removeFromParent();
        newEl = prevEl;
    }

    // since we might remove el itself, we get the next sibling here already
    let nextEl = el.getNextSibling();

    // remove everything from position onwards in the original element
    if (!inParagraph && (offset != 0)) {
        el.deleteText(offset, el.getText().length - 1);
    }
    else {
        // we're at the beginning of the text (or just before a paragraph
        // subelement) and need to remove the entire text/subelement.
        el.removeFromParent();
    }

    el = nextEl;
    while (el != null) {
        // get the next sibling before we remove the element.
        nextEl = el.getNextSibling();
        el.removeFromParent();
        el = nextEl;
    }

    // actually insert the newly created paragraph into the document tree.
    switch (par.getType()) {
        case DocumentApp.ElementType.PARAGRAPH:
            parContainer.insertParagraph(parContainer.getChildIndex(par) + 1, newPar);
            break;
        case DocumentApp.ElementType.LIST_ITEM:
            parContainer.insertListItem(parContainer.getChildIndex(par) + 1, newPar);
            break;
    }
    return newPar;
}

const insertValue = (table, rownum: number, colnum: number, value, tag = null) => {
    doc.setCursor(doc.newPosition(table.getCell(rownum, colnum), 0));
    const cursor = doc.getCursor();
    const cElement: any = cursor.insertText(value);
    if (tag !== null) {
        insertURL(cElement, tag)
    }
    return (cElement)
}


const insertTable = (name: string, groups?: string) => {
    const cursor = doc.getCursor();
    const grps: Group[] = JSON.parse(groups)

    // Make sure cursor is found
    // Make sure there are grps and that there are statistics
    if (!cursor) {
        DocumentApp.getUi().alert('Could not insert table; the cursor should indicate the position.');
    } else if (grps && grps[0].statistics) {

        // add CIs as separate columns
        for (let j = 0; j < grps.length; j++) {
            for (let i = 0; i < grps[j].statistics.length; i++) {
                let statistic: any = grps[j].statistics[i]
                if (Object.keys(statistic).includes("lower") &&
                    Object.keys(statistic).includes("upper")) {
                    grps[j].statistics.splice(i + 1, 0, {
                        identifier: statistic.identifier + "$lower",
                        name: "CI (lower)",
                        subscript: "lower",
                        symbol: statistic.interval,
                        value: statistic.lower
                    });
                    grps[j].statistics.splice(i + 2, 0, {
                        identifier: statistic.identifier + "$upper",
                        name: "CI (upper)",
                        subscript: "upper",
                        symbol: statistic.interval,
                        value: statistic.upper
                    });
                }
            }
        }

        const rows = grps.length + 1
        const columns = grps[0].statistics ?.length + 1

        const el = (cursor.getOffset() == 0 ? cursor.getElement() : splitParagraphAt(cursor));
        const parentEl = el.getParent();
        const table = parentEl.insertTable(parentEl.getChildIndex(el), Array(rows).fill(Array(columns).fill('')));

        // // Some styling
        // table.getBorder("All").type = "None"
        // table.getBorder("Top").type = "Double"
        // table.getBorder("Bottom").type = "Single"
        // Note: presently, such border styling seems not possible with GAS

        // Set the first cell's content to the group name
        insertValue(table, 0, 0, name)

        // Set the content of the remaining cells in the first row to the names of the statistics
        grps[0].statistics.forEach((statistic, i) => {
            if (name === "P-values") {
                insertValue(table, 0, i + 1, statistic.subscript);
            } else {
                let subs = ""
                if (statistic.subscript) {
                    subs = statistic.subscript
                }
                let header = (statistic.symbol ? statistic.symbol : statistic.name) + subs;
                let inserted = insertValue(table, 0, i + 1, header);
                inserted.setItalic(0, header.length - subs.length - 1, true);
                if (statistic.subscript) {
                    inserted.setTextAlignment(header.length - subs.length, header.length - 1, DocumentApp.TextAlignment.SUBSCRIPT);
                }
            }
        })

        // Loop over each group and set the name and values
        grps.forEach((group, i) => {
            insertValue(table, i + 1, 0, group.name)
            group.statistics ?.forEach((statistic, j) => {
                insertValue(table, i + 1, j + 1, formatValue(statistic, 2), statistic.identifier)
            })
        })
    }
}

export { insertTable }
