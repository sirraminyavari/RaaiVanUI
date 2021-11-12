import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
// import DoubleArrow from 'components/Icons/ArrowIcons/DoubleArrow';
import * as Styled from './CustomTable.styles';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import useWindow from 'hooks/useWindowContext';

const DEFAULT_PAGE_SIZES = [5, 10, 15, 30, 50];

const TablePagination = ({ tableInstance, pagination }) => {
  const {
    canPreviousPage, //! Start of Pagination.
    canNextPage,
    // pageOptions,
    // pageCount,
    // gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state, //! End of Pagination.
  } = tableInstance;

  const { RV_Float, RV_RevFloat, RVDic } = useWindow();

  //! Get pagination properties from table instance state.
  const { pageIndex, pageSize, data } = state;

  // const handleStartPage = () => {
  //   gotoPage(0);
  // };

  // const handleEndPage = () => {
  //   gotoPage(pageCount - 1);
  // };

  const selectOptions = (
    pagination?.perPageCount || DEFAULT_PAGE_SIZES
  ).map((pageSize) => ({ value: pageSize, label: `${pageSize}` }));

  const handlePreviousPage = () => {
    previousPage();
  };

  const handleNextPage = () => {
    nextPage();
  };

  // const handleInputChange = (e) => {
  //   const page = e.target.value ? Number(e.target.value) - 1 : 0;
  //   gotoPage(page);
  // };

  const handleSelectChange = (option) => {
    setPageSize(option.value);
  };

  const getPaginationSpan = () => {
    if (!canNextPage) {
      return RVDic.NOfMItems.replace('[n]', data.length).replace(
        '[m]',
        data.length
      );
    }

    return RVDic.NOfMItems.replace('[n]', pageIndex + 1 * pageSize).replace(
      '[m]',
      data.length
    );
  };

  return (
    <Styled.TablePaginationContainer>
      <Styled.TablePaginationSelectWrapper>
        <Styled.PaginationSelectTitle>
          {RVDic.CountPerPage}
        </Styled.PaginationSelectTitle>
        <CustomSelect
          defaultValue={[{ value: pageSize, label: `${pageSize}` }]}
          isMulti={false}
          hideSelectedOptions={true}
          closeMenuOnSelect={true}
          isClearable={false}
          isSearchable={false}
          selectName="table-pagination"
          options={selectOptions}
          onChange={handleSelectChange}
          styles={Styled.selectStyles}
          menuPortalTarget={document.body}
          menuShouldScrollIntoView={false}
        />
      </Styled.TablePaginationSelectWrapper>
      <Styled.PaginationArrowWrapper>
        {/* <button onClick={handleStartPage} disabled={!canPreviousPage}>
          <DoubleArrow size={25} color={canPreviousPage ? '#000' : '#888'} />
        </button> */}
        <Styled.PaginationSpan>{getPaginationSpan()}</Styled.PaginationSpan>
        <button onClick={handleNextPage} disabled={!canNextPage}>
          <ChevronIcon
            small
            size={28}
            dir={RV_Float}
            color={canNextPage ? TCV_DEFAULT : CV_DISTANT}
          />
        </button>
        <button onClick={handlePreviousPage} disabled={!canPreviousPage}>
          <ChevronIcon
            size={28}
            small
            dir={RV_RevFloat}
            color={canPreviousPage ? TCV_DEFAULT : CV_DISTANT}
          />
        </button>

        {/* <button onClick={handleEndPage} disabled={!canNextPage}>
          <DoubleArrow
            size={25}
            dir="left"
            color={canNextPage ? '#000' : '#888'}
          />
        </button> */}
      </Styled.PaginationArrowWrapper>
    </Styled.TablePaginationContainer>
  );
};

export default TablePagination;
