export const tidyID = '#!tidystats!: keep this link intact for updatable values. # ';

export const insertURL = (elem, id, start = null, end = null) => {
    if (start === null) {
        elem.setLinkUrl(tidyID + id)
        elem.setUnderline(false)
        elem.setForegroundColor("#26587B")

    } else {
        elem.setLinkUrl(start, end, tidyID + id)
        elem.setUnderline(start, end, false)
        elem.setForegroundColor(start, end, "#26587B")
    }
}
