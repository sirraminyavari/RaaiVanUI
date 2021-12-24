import styled from 'styled-components';
import { FLEX_RCB, FLEX_RSB, ViewContentCard } from 'constant/StyledCommonCss';
import Heading from 'components/Heading/Heading';
import { CV_DISTANT, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import RxInput from '../../../../components/Inputs/RxInput';

export const UserGroupsContainer = styled.div`
  padding: 1rem;
  direction: ${(props) => (props?.rtl ? 'rtl' : 'ltr')};
`;

export const UserGroupsContent = styled.div`
  ${ViewContentCard}
  ${FLEX_RSB}
`;

export const GroupsContainer = styled.div`
  flex-grow: 2.2;
`;

export const GroupsExcerpt = styled.div`
  flex-grow: 1;
`;

export const HeadingWrapper = styled(Heading).attrs({
  type: 'H1',
})`
  font-size: 1.375rem;
`;

export const InputContainer = styled.div`
  ${FLEX_RCB};
  background-color: ${CV_WHITE};
  color: ${CV_DISTANT};
  height: 3rem;
  border-radius: 0.625rem;
  border: 0.01rem solid ${CV_DISTANT};
  max-width: 37rem;
  width: 100%;
  margin: 2.5rem 0 3rem 0;
  padding: 0 1rem;
`;

export const Input = styled(RxInput)`
  width: 100%;
  outline: none;
  border: none;
  color: ${CV_DISTANT};
`;

export const GroupsCardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1.5rem;
  grid-row-gap: 1.5rem;
`;

export const DashedBox = styled.div`
  width: 23.5rem;
  height: 12rem;
  margin: 10px auto;
  border: 1px ${CV_DISTANT} dashed;
  border-radius: 0.8rem;
  transition: all 0.15s ease-out;
  cursor: pointer;

  &:hover {
    border: 1px ${TCV_DEFAULT} solid;
  }
`;
