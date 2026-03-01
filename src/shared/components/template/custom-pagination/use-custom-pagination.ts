import {getPaginationRange} from "@shared/utils";
import {useCallback, useMemo} from "react";
import type {useCustomPaginationProps} from "@shared/components/template/custom-pagination";


export const useCustomPagination = ( { page, pageCount, setPage } : useCustomPaginationProps) => {
    const paginationRange = useMemo(() => getPaginationRange(page, pageCount, 1), [page, pageCount])

    const handleGoTo = useCallback(
        (p: number) => {
            setPage(p)
            const el = document.querySelector('#product-list-top')
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        },
        [setPage],
    )

    return {
        paginationRange,
        handleGoTo
    }
}