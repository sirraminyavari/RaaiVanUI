import styled from 'styled-components';
import { FLEX_RCB, FLEX_RSB, ViewContentCard } from 'constant/StyledCommonCss';
import Heading from 'components/Heading/Heading';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_GRAY_DARK,
  CV_GRAY_LIGHT,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import RxInput from 'components/Inputs/RxInput';

export const UserGroupsContainer = styled.div`
  padding: 1rem;
  direction: ${(props) => (props?.rtl ? 'rtl' : 'ltr')};
`;

export const UserGroupsContent = styled.div`
  ${ViewContentCard}
  ${FLEX_RSB}
`;

export const GroupsContainer = styled.div`
  flex-grow: 1.2;
`;

export const GroupsExcerpt = styled.div`
  flex-grow: 0.5;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
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

  @media screen and (max-width: 1240px) {
    grid-template-columns: 1fr;
  }
`;

export const DashedBox = styled.div`
  padding: 1.5rem;
  width: 100%;
  height: 12rem;
  border: 1px ${CV_DISTANT} dashed;
  color: ${CV_DISTANT};
  border-radius: 0.8rem;
  transition: all 0.15s ease-out;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  user-select: none;
  font-weight: 500;
  font-size: 1.2rem;
  background-color: ${CV_WHITE};

  &:hover {
    border: 1px ${TCV_DEFAULT} solid;
    color: ${TCV_DEFAULT};
  }
`;

export const GroupItem = styled.div`
  padding: 1.5rem;
  width: 100%;
  height: 12rem;
  border: 1px ${CV_DISTANT} solid;
  border-radius: 0.8rem;
  position: relative;
  background-color: ${CV_WHITE};
`;

export const GroupItemTitle = styled.div`
  font-weight: 500;
  font-size: 1.2rem;
  color: ${CV_GRAY_DARK};
`;

export const GroupItemActionBar = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 0;
  padding: 0 1.5rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ExcerptImage = styled.img`
  max-width: 23rem;
  width: 100%;
`;

export const GroupDescriptionTitle = styled.div`
  text-align: center;
  margin: 4.5rem 0 1.5rem 0;
  color: ${CV_GRAY_DARK};
  font-size: 1rem;
  font-weight: 500;
`;

export const GroupDescription = styled.div`
  max-width: 18rem;
  text-align: center;
  color: ${CV_GRAY};
`;

export const GroupMemberContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  height: 2.6rem;
`;

export const GroupMemberItem = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 100%;
  border: 0.16rem solid ${CV_WHITE};
  ${({ index, rtl }) =>
    index !== 0 && `margin-${rtl ? 'left' : 'right'}: -${0.8}rem`}
`;

export const GroupIconContainer = styled.div`
  position: absolute;
  top: 0.1rem;
  left: 0.5rem;
  color: ${CV_GRAY_LIGHT};
`;
