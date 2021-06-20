import * as Styled from 'views/Teams/Teams.styles';
import Button from 'components/Buttons/Button';
import TwitterIcon from 'components/Icons/SocialMediaIcons/Twitter';
import LinkedIcon from 'components/Icons/SocialMediaIcons/LinkedIn';
import useHover from 'hooks/useHover';
import WorkspaceImage from 'assets/images/workspace.png';
import useWindow from 'hooks/useWindowContext';
import { LINKEDIN_URL, CLIQMIND_URL } from 'constant/Url';

const Welcome = () => {
  const { RV_RevFloat } = useWindow();
  const [buttonRef, isButtonHovered] = useHover();
  const [twitterRef, isTwitterHovered] = useHover();
  const [linkedinRef, isLinkedinHovered] = useHover();

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  const openTwitter = () => {
    openInNewTab(CLIQMIND_URL);
  };

  const openLinkedin = () => {
    openInNewTab(LINKEDIN_URL);
  };

  const openCliqmind = () => {
    openInNewTab(CLIQMIND_URL);
  };

  return (
    <Styled.WelcomeSide dir={RV_RevFloat}>
      <Styled.WorkspaceImageWrapper>
        <img src={WorkspaceImage} alt="team-workspace" />
      </Styled.WorkspaceImageWrapper>
      <Styled.WelcomeMSGContainer>
        <Styled.WelcomeMessage>به کلیک مایند خوش آمدید!</Styled.WelcomeMessage>
      </Styled.WelcomeMSGContainer>
      <Button
        onClick={openCliqmind}
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
        <Styled.IconWrapper
          ref={twitterRef}
          isHovered={isTwitterHovered}
          onClick={openTwitter}>
          <TwitterIcon size={20} />
        </Styled.IconWrapper>
        <Styled.IconWrapper
          ref={linkedinRef}
          isHovered={isLinkedinHovered}
          onClick={openLinkedin}>
          <LinkedIcon size={20} />
        </Styled.IconWrapper>
      </Styled.SocialMediaContainer>
    </Styled.WelcomeSide>
  );
};

export default Welcome;
