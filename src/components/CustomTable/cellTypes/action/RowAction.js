import { cloneElement } from 'react';
import * as Styled from 'components/CustomTable/CustomTable.styles';

const RowAction = (props) => {
  const { onActionClick, title, icon } = props;

  return (
    <Styled.TableActionWrapper onClick={onActionClick}>
      <Styled.TableActionIconWrapper>
        {cloneElement(icon)}
      </Styled.TableActionIconWrapper>
      <Styled.TableActionHeading type="h4">{title}</Styled.TableActionHeading>
    </Styled.TableActionWrapper>
  );
};

export default RowAction;
