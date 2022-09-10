import styled from 'styled-components';
import CloseButton from 'components/Buttons/CloseButton';

export const MultiLevelRow = styled.div`
  display: flex;
  align-items: center;
  margin-block: 1rem;
`;

export const MultiLevelRemoveIcon = styled(CloseButton)<{ disabled: boolean }>`
  margin-inline: 1rem;
  ${({ disabled }) => disabled && `opacity: 0.1;`}
`;
