import {useEffect} from 'react';
import {useRouter} from 'next/router';
import ReactPaginate from 'react-paginate';

interface PaginationProps {
  pageCount: number;
  currentPageData: JSX.Element[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({
  pageCount,
  currentPageData,
  currentPage,
  setCurrentPage,
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

  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(parseInt(router.query.page as string));
    } else {
      setCurrentPage(0);
    }
  }, [router.query.page, setCurrentPage]);

  return (
    <div className="flex items-end justify-center gap-7">
      <div className="flex py-6">
        <ReactPaginate
          previousLabel="Prev"
          nextLabel="Next"
          pageCount={pageCount}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
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
