import { useContext } from 'react';
import { TemplateSelectContext } from './TemplateSelect';
import * as Styled from './TemplateSelect.styles';
import FieldCell from './FieldCell';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';

const TemplateFields = () => {
  const { currentNode, onModalClose, onSelect } = useContext(
    TemplateSelectContext
  );
  const { TypeName } = currentNode || {};

  return (
    <Styled.TemplateFieldsContainer>
      {currentNode ? (
        <>
          <Styled.CurrentTemplateName type="h2">
            {decodeBase64(TypeName)}
          </Styled.CurrentTemplateName>
          {[...Array(11).keys()].map((i) => (
            <FieldCell key={i} />
          ))}
          <Button
            onClick={() => onSelect(currentNode)}
            classes="template-select-button">
            انتخاب تمپلیت
          </Button>
          <Button
            onClick={onModalClose}
            type="negative-o"
            classes="template-back-button">
            بازگشت
          </Button>
        </>
      ) : (
        <></>
      )}
    </Styled.TemplateFieldsContainer>
  );
};

export default TemplateFields;
