import * as Styled from 'views/Teams/Teams.styles';
import Button from 'components/Buttons/Button';
import TwitterIcon from 'components/Icons/SocialMediaIcons/Twitter';
import LinkedIcon from 'components/Icons/SocialMediaIcons/LinkedIn';
import useHover from 'hooks/useHover';
import WorkspaceImage from 'assets/images/workspace.png';
import useWindow from 'hooks/useWindowContext';
import { LINKEDIN_URL, CLIQMIND_URL } from 'constant/Url';
import { CV_GRAY_LIGHT } from 'constant/CssVariables';
import { getSystemName } from 'helpers/helpers';

const DesktopWelcome = () => {
  const { RV_RevFloat, RVDic } = useWindow();
  const [buttonRef, isButtonHovered] = useHover();

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

  const welcomeMSG = RVDic.WelcomeToRaaiVan.replace(
    '[RaaiVan]',
    getSystemName()
  );

  const blogTitle = RVDic.RaaiVanBlog.replace('[RaaiVan]', getSystemName());

  return (
    <Styled.DesktopWelcomeSide dir={RV_RevFloat}>
      <Styled.WorkspaceImageWrapper>
        <Styled.WorkspaceImage src={WorkspaceImage} alt="team-workspace" />
      </Styled.WorkspaceImageWrapper>
      <Styled.WelcomeMSGContainer>
        <Styled.WelcomeMessage>{welcomeMSG}</Styled.WelcomeMessage>
      </Styled.WelcomeMSGContainer>
      <Button
        onClick={openCliqmind}
        ref={buttonRef}
        type="primary-o"
        style={{
          width: '8rem',
          textAlign: 'center',
          borderColor: !isButtonHovered && '#fff',
          backgroundColor: CV_GRAY_LIGHT,
        }}>
        {blogTitle}
      </Button>
      <Styled.SocialMediaContainer>
        {/* <Styled.IconWrapper onClick={openTwitter}>
          <TwitterIcon size={20} />
        </Styled.IconWrapper> */}
        <Styled.IconWrapper onClick={openLinkedin}>
          <LinkedIcon size={20} />
        </Styled.IconWrapper>
      </Styled.SocialMediaContainer>
    </Styled.DesktopWelcomeSide>
  );
};

export default DesktopWelcome;
