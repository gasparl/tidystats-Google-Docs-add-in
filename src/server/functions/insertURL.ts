export const insertURL = (elem, id, start = null, end = null) => {
    if (start === null) {
        elem.setLinkUrl("https://www.tidystats.io/?stat=" + id)
        elem.setUnderline(false)
        elem.setForegroundColor("#26587B")
    } else {
        elem.setLinkUrl(start, end, "https://www.tidystats.io/?stat=" + id)
        elem.setUnderline(start, end, false)
        elem.setForegroundColor(start, end, "#26587B")
    }
}
