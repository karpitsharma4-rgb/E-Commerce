import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null

  const getPageNumbers = () => {
    const nums = []
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) nums.push(i)
    } else {
      if (page <= 4) {
        nums.push(1, 2, 3, 4, 5, '...', pages)
      } else if (page >= pages - 3) {
        nums.push(1, '...', pages - 4, pages - 3, pages - 2, pages - 1, pages)
      } else {
        nums.push(1, '...', page - 1, page, page + 1, '...', pages)
      }
    }
    return nums
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8" role="navigation" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <FiChevronLeft size={18} />
      </button>

      {getPageNumbers().map((num, idx) =>
        num === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400 select-none">…</span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
              num === page
                ? 'bg-indigo-600 text-white shadow-md'
                : 'border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
            }`}
            aria-current={num === page ? 'page' : undefined}
          >
            {num}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  )
}
