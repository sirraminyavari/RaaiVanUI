import * as Styled from 'views/Teams/Teams.styles';
import Button from 'components/Buttons/Button';
// import TwitterIcon from 'components/Icons/SocialMediaIcons/Twitter';
import LinkedIcon from 'components/Icons/SocialMediaIcons/LinkedIn';
import useHover from 'hooks/useHover';
import WorkspaceImage from 'assets/images/workspace-2.svg?file';
import useWindow from 'hooks/useWindowContext';
import { LINKEDIN_URL, CLIQMIND_URL } from 'constant/Url';
import { CV_GRAY_LIGHT } from 'constant/CssVariables';
import { getSystemName } from 'helpers/helpers';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import { RVVariantProp } from '@cliqmind/rv-components';

const DesktopWelcome = () => {
  const { RVDic } = useWindow();

  const isMobile = DimensionHelper().isMobile;

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  // const openTwitter = () => openInNewTab(CLIQMIND_URL);

  const openLinkedin = () => openInNewTab(LINKEDIN_URL);

  const openCliqmind = () => openInNewTab(CLIQMIND_URL);

  const welcomeMSG = RVDic.WelcomeToRaaiVan.replace(
    '[RaaiVan]',
    getSystemName()
  );

  const blogTitle = RVDic.RaaiVanBlog.replace('[RaaiVan]', getSystemName());

  return (
    <Styled.DesktopWelcomeSide>
      {!isMobile && (
        <Styled.WorkspaceImageWrapper>
          <Styled.WorkspaceImage src={WorkspaceImage} alt="team-workspace" />
        </Styled.WorkspaceImageWrapper>
      )}
      <Styled.WelcomeMSGContainer>
        <Styled.WelcomeMessage>{welcomeMSG}</Styled.WelcomeMessage>
      </Styled.WelcomeMSGContainer>
      <Button onClick={openCliqmind} variant={RVVariantProp.white} style={{}}>
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
