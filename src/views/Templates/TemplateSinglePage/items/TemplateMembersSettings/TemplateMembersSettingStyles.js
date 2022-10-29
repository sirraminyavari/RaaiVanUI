import Button from 'components/Buttons/Button';
import {
  FLEX_CSA,
  FLEX_CSB,
  FLEX_RCB,
  FLEX_RCE,
} from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const MemberBlock = styled.div`
  ${FLEX_CSB};
  min-height: calc((100vh - 9rem) / 2);
  position: relative;
  box-shadow: 0.06rem 0.29rem 0.98rem #0000001f;
  border-radius: 0.625rem;
  padding: 4rem 1.5rem 1.5rem 1.5rem;
  padding-block-start: 0.5rem;
  background-color: var(--rv-gray-color-light);
  margin-bottom: 1.5rem;
`;
MemberBlock.displayName = 'MemberBlock';

export const ReturnButton = styled(Button).attrs({
  type: 'negative-o',
})`
  position: absolute;
  top: 1rem;
  ${({ rtl }) => (rtl ? 'left: 1rem' : 'right: 1rem')};
  height: 2rem;
  width: 10rem;
  border: 0.0625rem solid var(--rv-white-color);

  &:hover {
    border: 0.0625rem solid var(--rv-red-color);
    background-color: var(--rv-white-color);
  }
`;
ReturnButton.displayName = 'ReturnButton';

export const MembersSettingBlockWrapper = styled.div`
  width: 100%;
`;

export const MembersSettingBlockTitle = styled.div`
  color: var(--rv-color-distant);
  font-size: 0.8rem;
`;

export const MembersSettingBlock = styled.div`
  ${FLEX_RCB};
  width: 100%;
`;
MembersSettingBlock.displayName = 'MembersSettingBlock';

export const MembersSettingMicroBlock = styled.div`
  ${FLEX_RCB};
  width: 21rem;
  min-height: 2.5rem;
  gap: 0.5rem;
`;
MembersSettingMicroBlock.displayName = 'MembersSettingMicroBlock';

export const MembersSettingMicroBlockTitle = styled.div`
  width: 14.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.85rem !important;
  color: var(--rv-gray-color-dark);
  font-weight: 500;
`;
MembersSettingMicroBlockTitle.displayName = 'MembersSettingMicroBlockTitle';

export const MembersSettingBlockContainer = styled.div`
  max-width: 54rem;
  width: 100%;
  height: 100%;
  flex: 1;
`;
MembersSettingBlockContainer.displayName = 'MembersSettingBlockContainer';

export const Spacer = styled.div`
  height: 3rem;
`;

export const ToggleButtonWrapper = styled.div`
  ${FLEX_RCE};
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding-block-end: 1rem;
  width: 100%;

  & > div:first-of-type {
    position: unset;
  }
`;
