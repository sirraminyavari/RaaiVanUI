import styled from 'styled-components';
import { TCV_DEFAULT, CV_DISTANT } from 'constant/CssVariables';
import { FLEX_RCB, FLEX_CCC } from 'constant/StyledCommonCss';
import { IoFileTrayFullOutline } from 'react-icons/io5';

const TemplateItemSettingAddNew = ({ children, ...props }) => {
  return (
    <ItemContainer>
      <IconContainer>
        <IoFileTrayFullOutline size={24} />
      </IconContainer>
      <div>{children}</div>
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
  ${FLEX_RCB};
  height: 5rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  box-sizing: content-box;
  border: 0.0625rem solid #e6f4f1;
  transition: border 0.15s ease-out;
  gap: 2.5rem;
`;

const IconContainer = styled.div`
  ${FLEX_CCC};
  width: 5rem;
  color: ${CV_DISTANT};
  gap: 0.8rem;
`;
export default TemplateItemSettingAddNew;
