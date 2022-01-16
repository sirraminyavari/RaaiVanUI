import styled from 'styled-components';
import { FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_GRAY_DARK } from 'constant/CssVariables';
import TemplateInlineEdit from './TemplatesInlineEdit';

const SaaSTemplateItem = ({ NodeTypeID, TypeName, ...props }) => {
  return (
    <>
      <ItemHead>
        <TemplateInlineEdit
          value={TypeName}
          color={CV_GRAY_DARK}
          fontSize={'1rem'}
        />
      </ItemHead>
      <SubItems></SubItems>
    </>
  );
};
const ItemHead = styled.div`
  ${FLEX_RCS};
  color: ${CV_GRAY_DARK};
`;
const SubItems = styled.div`
  display: grid;
`;
export default SaaSTemplateItem;
