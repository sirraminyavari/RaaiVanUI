import Arrow from 'components/Icons/ArrowIcons/Arrow';
import { CV_DISTANT, CV_GRAY_DARK } from 'constant/CssVariables';
import * as Styled from './CustomTable.styles';
import Heading from 'components/Heading/Heading';

const ColumnHeader = ({ column, allColumns }) => {
  const requiredColumns = allColumns.filter((column) => !!column?.isRequired);

  return (
    <Styled.HeaderWrapper canSort={column.canSort}>
      <Heading className="table-header" type="h6">
        {column.render('Header')}
        {requiredColumns.map((col) => col?.Header).includes(column?.Header) && (
          <Styled.HeaderAsterisk>*</Styled.HeaderAsterisk>
        )}
      </Heading>
      <div className="table-sort-arrow">
        {column.isSorted ? (
          column.isSortedDesc ? (
            <>
              <Arrow dir="down" color={CV_GRAY_DARK} size={15} />
            </>
          ) : (
            <>
              <Arrow dir="up" color={CV_GRAY_DARK} size={15} />
            </>
          )
        ) : (
          column.canSort && (
            <>
              <Arrow dir="up" color={CV_DISTANT} size={15} />
              <Arrow dir="down" color={CV_DISTANT} size={15} />
            </>
          )
        )}
      </div>
    </Styled.HeaderWrapper>
  );
};

export default ColumnHeader;
