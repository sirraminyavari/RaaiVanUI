import Button from 'components/Buttons/Button';
import ContinueWithGoogle from '../elements/ContinueWithGoogle';
import { common_style } from './SignUp';
import styled from 'styled-components';

const CreateAccountButtons = ({
  isVisible,
  label,
  onCreateAccountClick,
  loading,
} = {}) => {
  return (
    <>
      <Hiddener isVisible={isVisible}>
        <ContinueWithGoogle style={{ width: '100%', common_style }} />
        <Button
          type="secondary-o"
          style={{ ...common_style, fontSize: '1rem', width: '100%' }}
          onClick={onCreateAccountClick}
          loading={loading}>
          {label}
        </Button>
      </Hiddener>
    </>
  );
};

export default CreateAccountButtons;

const Hiddener = styled.div`
  width: 100%;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  ${({ isVisible }) => (isVisible ? `max-height:100rem` : `max-height:0rem`)};
  transition: opacity 0.7s, max-height 1s;
`;
