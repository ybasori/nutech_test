import React from "react";
import ButtonPage from "../../Atoms/ButtonPage/ButtonPage";

const Pagination: React.FC<{
  currentPage: number;
  totalPage: number;
  onChange: (params: { currentPage: number }) => void;
}> = ({ currentPage, totalPage, onChange }) => {
  const listPage = () => {
    let list: number[] = [];
    for (let i = 1; i <= totalPage; i++) {
      list = [...list, i];
    }
    return list;
  };

  const onChangePage = (page: number) => {
    return onChange({ currentPage: page });
  };
  return (
    <>
      <nav
        className="pagination is-centered"
        role="navigation"
        aria-label="pagination"
      >
        <a
          className="pagination-previous"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage !== 1) {
              onChangePage(currentPage - 1);
            }
          }}
        >
          Previous
        </a>
        <a
          className="pagination-next"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage !== totalPage) {
              onChangePage(currentPage + 1);
            }
          }}
        >
          Next page
        </a>
        <ul className="pagination-list">
          {listPage().map((item) => (
            <ButtonPage
              key={item}
              number={item}
              current={item === currentPage}
              onClick={() => onChangePage(item)}
            />
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Pagination;
