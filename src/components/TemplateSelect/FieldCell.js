import AtSignIcon from 'components/Icons/AtSignIcon/AtSign';
import { CV_DISTANT } from 'constant/CssVariables';
import * as Styled from './TemplateSelect.styles';

const FieldCell = ({ type, name }) => {
  const getIcon = () => {
    switch (type) {
      case 'Date':
        return <AtSignIcon size={20} color={CV_DISTANT} />;

      default:
        return <AtSignIcon size={20} color={CV_DISTANT} />;
    }
  };
  return (
    <Styled.FieldCellContainer>
      {getIcon()}
      <span>
        رونوشت اولیه نامه برای کاربر سطح ارشد دپارتمان موردنظر در سازمان مقصد
      </span>
    </Styled.FieldCellContainer>
  );
};

export default FieldCell;
