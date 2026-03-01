export type PageItem = number | '...'

export function getPaginationRange(
    page: number,
    pageCount: number,
    siblings = 1,
) {
    const totalNumbers = siblings * 2 + 5
    if (pageCount <= totalNumbers) {
        return Array.from({ length: pageCount }, (_, i) => i + 1) as PageItem[]
    }

    const leftSiblingIndex = Math.max(page - siblings, 2)
    const rightSiblingIndex = Math.min(page + siblings, pageCount - 1)

    const shouldShowLeftEllipsis = leftSiblingIndex > 2
    const shouldShowRightEllipsis = rightSiblingIndex < pageCount - 1

    const items: PageItem[] = [1]

    if (shouldShowLeftEllipsis) items.push('...')

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) items.push(i)

    if (shouldShowRightEllipsis) items.push('...')

    items.push(pageCount)
    return items
}