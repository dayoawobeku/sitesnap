import {useCallback, useEffect} from 'react';
import {useRouter} from 'next/router';
import ReactPaginate from 'react-paginate';

interface PaginationProps {
  pageCount: number;
  currentPageData: JSX.Element[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  customHandlePageClick?: (selectedPage: {selected: number}) => void;
}

export default function Pagination({
  pageCount,
  currentPageData,
  currentPage,
  setCurrentPage,
  customHandlePageClick,
}: PaginationProps) {
  const router = useRouter();

  function handlePageClick(selectedPage: {selected: number}) {
    setCurrentPage(selectedPage.selected);
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: selectedPage.selected + 1,
      },
    });
  }

  const handleCurrentPage = useCallback(() => {
    if (router.query.page) {
      setCurrentPage(Number(router.query.page) - 1);
    } else {
      setCurrentPage(0);
    }
  }, [router.query.page, setCurrentPage]);

  useEffect(() => {
    handleCurrentPage();
  }, [handleCurrentPage]);

  return (
    <div className="flex items-end justify-center gap-7">
      <div className="flex py-6">
        <ReactPaginate
          previousLabel="Prev"
          nextLabel="Next"
          pageCount={pageCount}
          onPageChange={customHandlePageClick ?? handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          forcePage={
            router.query.page ? Number(router.query.page) - 1 : currentPage
          }
          breakLabel="..."
          containerClassName="pagination"
          previousLinkClassName="pagination__link--prev"
          nextLinkClassName="pagination__link--next"
          disabledClassName="pagination__link--disabled"
          activeClassName="pagination__link--active"
        />
        {currentPageData}
      </div>
    </div>
  );
}
