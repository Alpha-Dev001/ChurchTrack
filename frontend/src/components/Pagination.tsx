import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  lang?: string;
}

const tPagination: Record<string, {
  showing: string;
  to: string;
  of: string;
  items: string;
  page: string;
  ofPages: string;
  prev: string;
  next: string;
}> = {
  EN: {
    showing: 'Showing',
    to: 'to',
    of: 'of',
    items: 'items',
    page: 'Page',
    ofPages: 'of',
    prev: 'Previous',
    next: 'Next',
  },
  FR: {
    showing: 'Affichage',
    to: 'à',
    of: 'sur',
    items: 'éléments',
    page: 'Page',
    ofPages: 'sur',
    prev: 'Précédent',
    next: 'Suivant',
  },
  RW: {
    showing: 'Werekwaho',
    to: 'kugeza',
    of: 'muri',
    items: 'ibintu',
    page: 'Paji',
    ofPages: 'muri',
    prev: 'Ibanza',
    next: 'Ikurikira',
  },
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  lang = 'EN',
}: PaginationProps) {
  const t = tPagination[lang] || tPagination.EN;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  const from = totalItems ? (currentPage - 1) * itemsPerPage + 1 : null;
  const to = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border border-navy-200 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-navy-500 font-medium">
        {totalItems != null && from != null && to != null && (
          <span>
            {t.showing} {from} {t.to} {to} {t.of} {totalItems} {t.items}
          </span>
        )}
        <span className="text-navy-700 font-semibold">
          {t.page} {currentPage} {t.ofPages} {totalPages}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-2.5 h-8 text-xs font-semibold hover:bg-navy-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition text-navy-700 border border-transparent hover:border-navy-200 cursor-pointer"
          aria-label={t.prev}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t.prev}</span>
        </button>

        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`e-${idx}`} className="px-2 text-navy-400 select-none">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page as number)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`min-w-[32px] h-8 px-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                currentPage === page
                  ? 'bg-navy-950 text-white'
                  : 'hover:bg-navy-50 text-navy-700'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-2.5 h-8 text-xs font-semibold hover:bg-navy-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition text-navy-700 border border-transparent hover:border-navy-200 cursor-pointer"
          aria-label={t.next}
        >
          <span className="hidden sm:inline">{t.next}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
