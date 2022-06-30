import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import { FLEX_RCB } from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const MemberBlock = styled.div`
  height: 27rem;
  position: relative;
  box-shadow: 0.06rem 0.29rem 0.98rem #0000001f;
  border-radius: 0.625rem;
  padding: 4rem 1.5rem 1.5rem 1.5rem;
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

export const MembersSettingBlock = styled.div`
  ${FLEX_RCB};
`;
MembersSettingBlock.displayName = 'MembersSettingBlock';

export const MembersSettingMicroBlock = styled.div`
  ${FLEX_RCB};
  width: 22.5rem;
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
  max-width: 50rem;
  width: 100%;
`;
MembersSettingBlockContainer.displayName = 'MembersSettingBlockContainer';
