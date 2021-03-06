import Arrow from 'components/Icons/ArrowIcons/Arrow';
import DoubleArrow from 'components/Icons/ArrowIcons/DoubleArrow';

const TablePagination = ({
  gotoPage,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageOptions,
  pageSize,
  setPageSize,
}) => {
  const handleStartPage = () => {
    gotoPage(0);
  };

  const handleEndPage = () => {
    gotoPage(pageCount - 1);
  };

  const handlePreviousPage = () => {
    previousPage();
  };

  const handleNextPage = () => {
    nextPage();
  };

  const handleInputChange = (e) => {
    const page = e.target.value ? Number(e.target.value) - 1 : 0;
    gotoPage(page);
  };

  const handleSelectChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  return (
    <div className="pagination">
      <div className="middle">
        <button onClick={handleStartPage} disabled={!canPreviousPage}>
          <DoubleArrow size={25} color={canPreviousPage ? '#000' : '#888'} />
        </button>
        <button onClick={handlePreviousPage} disabled={!canPreviousPage}>
          <Arrow size={30} color={canPreviousPage ? '#000' : '#888'} />
        </button>
        <button onClick={handleNextPage} disabled={!canNextPage}>
          <Arrow size={30} dir="left" color={canNextPage ? '#000' : '#888'} />
        </button>
        <button onClick={handleEndPage} disabled={!canNextPage}>
          <DoubleArrow
            size={25}
            dir="left"
            color={canNextPage ? '#000' : '#888'}
          />
        </button>
      </div>
      <div style={{ margin: '0.5rem' }}>
        <span>
          صفحه{' '}
          <strong>
            {pageIndex + 1} از {pageOptions.length}
          </strong>
        </span>
      </div>
      <div>
        <span>
          | برو به صفحه:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={handleInputChange}
            style={{ width: '4rem', padding: '0 0.5rem 0 0' }}
          />
        </span>
      </div>

      <select
        value={pageSize}
        style={{
          width: '5rem',
          padding: '0.1rem 0.5rem',
          display: 'inline',
          margin: '0.5rem',
          borderRadius: '0.3rem',
        }}
        onChange={handleSelectChange}>
        {[5, 10, 15, 30, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize} ردیف
          </option>
        ))}
      </select>
    </div>
  );
};

export default TablePagination;
