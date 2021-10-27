import Arrow from 'components/Icons/ArrowIcons/Arrow';
import { CV_DISTANT, CV_GRAY_DARK } from 'constant/CssVariables';
import * as Styled from './CustomTable.styles';

const ColumnHeader = ({ column, allColumns }) => {
  const requiredColumns = allColumns.filter((column) => !!column?.isRequired);

  return (
    <Styled.HeaderWrapper canSort={column.canSort}>
      <div>
        {column.render('Header')}
        {requiredColumns.map((col) => col?.Header).includes(column?.Header) && (
          <Styled.HeaderAsterisk>*</Styled.HeaderAsterisk>
        )}
      </div>
      <>
        {column.isSorted ? (
          column.isSortedDesc ? (
            <Arrow
              dir="down"
              circle
              color={CV_GRAY_DARK}
              size={24}
              className="table-sort-arrow"
            />
          ) : (
            <Arrow
              dir="up"
              circle
              color={CV_GRAY_DARK}
              size={24}
              className="table-sort-arrow"
            />
          )
        ) : (
          column.canSort && (
            <Arrow
              dir="up-down"
              color={CV_DISTANT}
              size={20}
              className="table-sort-arrow"
            />
          )
        )}
      </>
    </Styled.HeaderWrapper>
  );
};

export default ColumnHeader;