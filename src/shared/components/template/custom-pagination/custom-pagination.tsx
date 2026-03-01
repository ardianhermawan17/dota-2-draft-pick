import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem, PaginationLink, PaginationNext,
    PaginationPrevious
} from "@shared/components/ui/pagination.tsx";
import type {useCustomPaginationProps} from "@shared/components/template/custom-pagination/types.ts";
import {useCustomPagination} from "@shared/components/template/custom-pagination/use-custom-pagination.ts";

export const CustomPagination = ({ page, pageCount, setPage } : useCustomPaginationProps) => {
    const {
        paginationRange,
        handleGoTo
    } = useCustomPagination({ page, pageCount, setPage })

    return (
        <div className="mt-6 flex justify-center">
            <Pagination aria-label="Product pagination">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={(e) => {
                                e.preventDefault()
                                if (page > 1) handleGoTo(page - 1)
                            }}
                            text="Prev"
                        />
                    </PaginationItem>

                    {paginationRange.map((item) => {
                        if (item === '...') {
                            return (
                                <PaginationItem key={`ellipsis-${item}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )
                        } else {
                            const pageNum = item as number
                            return (
                                <PaginationItem key={pageNum}>
                                    <PaginationLink
                                        href={`#page-${pageNum}`}
                                        isActive={pageNum === page}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleGoTo(pageNum)
                                        }}
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        }
                    })}

                    <PaginationItem>
                        <PaginationNext
                            onClick={(e) => {
                                e.preventDefault()
                                if (page < pageCount) handleGoTo(page + 1)
                            }}
                            text="Next"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}