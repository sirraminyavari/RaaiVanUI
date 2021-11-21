/**
 * Renders an onboarding menu item.
 */
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import useWindow from 'hooks/useWindowContext';

const ICON_URL = '../../images/Preview.png';

/**
 * Renders an item just for onboarding purposes.
 * @returns {React.Component}
 */
const OnboardingBranch = () => {
  const { RVDic } = useWindow();

  return (
    <>
      <Styled.MenuContainer indentStep={0} isExpanded={false} isSelected={true}>
        <Styled.MenuTitleWrapper>
          <Styled.MenuItemImage src={ICON_URL} alt="menu-icon-onboarding" />
          <Styled.MenuTitle style={{ pointerEvents: 'none' }}>
            {RVDic.Documents}
          </Styled.MenuTitle>
        </Styled.MenuTitleWrapper>
      </Styled.MenuContainer>
    </>
  );
};

export default OnboardingBranch;
