import Heading from 'components/Heading/Heading';
import { CV_DISTANT, CV_GRAY, TCV_DEFAULT } from 'constant/CssVariables';
import { FLEX_CCC, FLEX_RCB } from 'constant/StyledCommonCss';
import { decodeBase64 } from 'helpers/helpers';
import { IoFileTrayFullOutline } from 'react-icons/io5';
import styled from 'styled-components';

const TemplateItemSettingListItem = (props) => {
  const { CreationDate, Name } = props;

  return (
    <ItemContainer>
      <IconContainer>
        <IoFileTrayFullOutline size={24} />
        <Date>{CreationDate}</Date>
      </IconContainer>

      <Title>{decodeBase64(Name)}</Title>
      <Spacer />
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

  &:hover {
    border: 0.125rem solid ${TCV_DEFAULT};
  }
`;

const IconContainer = styled.div`
  ${FLEX_CCC};
  width: 5rem;
  color: ${CV_DISTANT};
  gap: 0.8rem;
`;

const Date = styled.div`
  color: ${CV_GRAY};
  font-size: 0.75rem;
`;

const Separator = styled.div`
  display: inline-block;
  width: 0.0625rem;
  background-color: #e6f4f1;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Title = styled(Heading).attrs({
  type: 'H1',
})`
  font-size: 1.125rem !important;
  font-weight: 500 !important;
`;
export default TemplateItemSettingListItem;
