import AtSignIcon from 'components/Icons/AtSignIcon/AtSign';
import { CV_DISTANT } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import * as Styled from './TemplateSelect.styles';

const FieldCell = ({ element }) => {
  const { Type, Title } = element || {};

  const getIcon = () => {
    switch (Type) {
      case 'Date':
        return <AtSignIcon size={20} color={CV_DISTANT} />;

      default:
        return <AtSignIcon size={20} color={CV_DISTANT} />;
    }
  };
  return (
    <Styled.FieldCellContainer>
      {getIcon()}
      <span>{decodeBase64(Title)}</span>
    </Styled.FieldCellContainer>
  );
};

export default FieldCell;
