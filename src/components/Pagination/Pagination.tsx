import React from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      forcePage={currentPage - 1}
      onPageChange={(selectedItem) =>
        onPageChange(selectedItem.selected + 1)
      }
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      activeClassName={css.active}
      previousLabel="Previous"
      nextLabel="Next"
      previousClassName={css.pageItem}
      nextClassName={css.pageItem}
      disabledClassName={css.disabled}
      breakLabel="..."
    />
  );
};

export default Pagination;
