import Button from 'components/Buttons/Button';
import { CV_RED } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import styled from 'styled-components';

/**
 * Renders an Outlined Return button
 */
const ReturnButton = ({ onClick, ...restProps }) => {
  const { RVDic } = useWindow();
  const RVDicReturn = RVDic.Return;
  return (
    <StyledButton onClick={onClick} {...restProps} type="negative-secondary-o">
      {RVDicReturn}
    </StyledButton>
  );
};

export default ReturnButton;

const StyledButton = styled(Button)`
  &:hover {
    border-color: ${CV_RED};
  }
`;
