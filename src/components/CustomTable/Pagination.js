import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import * as Styled from './CustomTable.styles';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import useWindow from 'hooks/useWindowContext';

const DEFAULT_PAGE_SIZES = [5, 10, 15, 30, 50];

const TablePagination = ({ tableInstance, pagination }) => {
  const {
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
  } = tableInstance;

  const { RV_Float, RV_RevFloat, RVDic } = useWindow();

  //! Get pagination properties from table instance state.
  const { pageIndex, pageSize, data } = state;

  //! Select options for pagination.
  const selectOptions = (
    pagination?.perPageCount || DEFAULT_PAGE_SIZES
  ).map((pageSize) => ({ value: pageSize, label: `${pageSize}` }));

  //! Go to previous page on back arrow click.
  const handlePreviousPage = () => {
    previousPage();
  };

  //! Go to next page on next arrow click.
  const handleNextPage = () => {
    nextPage();
  };

  const handleSelectChange = (option) => {
    setPageSize(option.value);
  };

  const paginationSpanLabel = RVDic.NOfMItems.replace(
    '[n]',
    canNextPage ? pageIndex + 1 * pageSize : data?.length
  ).replace('[m]', data.length);

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
        <Styled.PaginationSpan>{paginationSpanLabel}</Styled.PaginationSpan>
        <button onClick={handleNextPage} disabled={!canNextPage}>
          <ChevronIcon
            small
            size={25}
            dir={RV_Float}
            color={canNextPage ? TCV_DEFAULT : CV_DISTANT}
          />
        </button>
        <button onClick={handlePreviousPage} disabled={!canPreviousPage}>
          <ChevronIcon
            size={25}
            small
            dir={RV_RevFloat}
            color={canPreviousPage ? TCV_DEFAULT : CV_DISTANT}
          />
        </button>
      </Styled.PaginationArrowWrapper>
    </Styled.TablePaginationContainer>
  );
};

export default TablePagination;
