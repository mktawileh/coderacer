import { Pagination } from "react-bootstrap";

function PaginationBox({ page = 1, pages = 1, onPageChange }) {
  let ind = page - 2;
  let codesNumber = pages;

  if (page + 2 > codesNumber) ind = codesNumber - 4;
  if (ind <= 0) ind = 1;

  let range = new Array(5)
    .fill(0)
    .map((e, i) => {
      if (ind <= codesNumber && ind >= 1) {
        return [
          ind,
          <li
            className={`page-item ${ind == page ? "active" : ""}`}
            data-page={ind}
            key={ind}
            onClick={onPageChange.bind(ind)}
          >
            <a className="page-link" role="button">
              {ind++}
            </a>
          </li>,
        ];
      }
      return false;
    })
    .filter((e) => e);
  return (
    <Pagination size="sm">
      <Pagination.Prev
        onClick={onPageChange.bind(page - 1 == 0 ? 1 : page - 1)}
      />

      {range[0] && range[0][0] != 1 ? (
        <>
          <li
            className={`page-item ${1 == page ? "active" : ""}`}
            data-page={1}
            onClick={onPageChange.bind(1)}
          >
            <a className="page-link" role="button">
              {1}
            </a>
          </li>
          <Pagination.Ellipsis />
        </>
      ) : (
        ""
      )}

      {range.map((e) => e[1])}
      {range[4] && range[4][0] != codesNumber ? (
        <>
          <Pagination.Ellipsis />
          <li
            className={`page-item ${codesNumber == page ? "active" : ""}`}
            data-page={codesNumber}
            onClick={onPageChange.bind(codesNumber)}
          >
            <a className="page-link" role="button">
              {codesNumber}
            </a>
          </li>
        </>
      ) : (
        ""
      )}

      <Pagination.Next
        onClick={onPageChange.bind(page + 1 == pages + 1 ? pages : page + 1)}
      />
    </Pagination>
  );
}

export default PaginationBox;
