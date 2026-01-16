"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  page: number;
  totalPages: number;
};

export function AppPagination({ page, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`?${params.toString()}`);
  };

  const getPages = () => {
    const pages: number[] = [];
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, page + 1);

    if (end - start < 2) {
      if (start === 1) end = Math.min(3, totalPages);
      if (end === totalPages) start = Math.max(totalPages - 2, 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => goToPage(Math.max(1, page - 1))} />
        </PaginationItem>

        {getPages().map((p) => (
          <PaginationItem key={p}>
            <PaginationLink isActive={p === page} onClick={() => goToPage(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => goToPage(Math.min(totalPages, page + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
