import * as Styled from 'views/Teams/Teams.styles';
import Button from 'components/Buttons/Button';
import TwitterIcon from 'components/Icons/SocialMediaIcons/Twitter';
import LinkedIcon from 'components/Icons/SocialMediaIcons/LinkedIn';
import useHover from 'hooks/useHover';
import WorkspaceImage from 'assets/images/workspace.png';
import useWindow from 'hooks/useWindowContext';

const Welcome = () => {
  const { RV_RevFloat } = useWindow();
  const [buttonRef, isButtonHovered] = useHover();
  const [twitterRef, isTwitterHovered] = useHover();
  const [linkedinRef, isLinkedinHovered] = useHover();

  return (
    <Styled.WelcomeSide dir={RV_RevFloat}>
      <Styled.WorkspaceImageWrapper>
        <img src={WorkspaceImage} alt="team-workspace" />
      </Styled.WorkspaceImageWrapper>
      <Styled.WelcomeMSGContainer>
        <Styled.WelcomeMessage>به کلیک مایند خوش آمدید!</Styled.WelcomeMessage>
      </Styled.WelcomeMSGContainer>
      <Button
        ref={buttonRef}
        type="primary-o"
        style={{
          width: '8rem',
          textAlign: 'center',
          borderColor: !isButtonHovered && '#fff',
        }}>
        بلاگ کلیک مایند
      </Button>
      <Styled.SocialMediaContainer>
        <Styled.IconWrapper ref={twitterRef} isHovered={isTwitterHovered}>
          <TwitterIcon size={20} />
        </Styled.IconWrapper>
        <Styled.IconWrapper ref={linkedinRef} isHovered={isLinkedinHovered}>
          <LinkedIcon size={20} />
        </Styled.IconWrapper>
      </Styled.SocialMediaContainer>
    </Styled.WelcomeSide>
  );
};

export default Welcome;
