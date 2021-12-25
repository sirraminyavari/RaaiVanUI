import { decodeBase64 } from 'helpers/helpers';
import * as Styled from './TemplateSelect.styles';
import { getIcon } from './utils';

const FieldCell = ({ element }) => {
  const { Type, Title } = element || {};

  return (
    <Styled.FieldCellContainer>
      {getIcon(Type)}
      <span>{decodeBase64(Title)}</span>
    </Styled.FieldCellContainer>
  );
};

export default FieldCell;
