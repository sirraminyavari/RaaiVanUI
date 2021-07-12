/**
 * Renders an onboarding menu item.
 */
import * as Styled from 'layouts/Sidebar/Sidebar.styles';

const ICON_URL = '../../images/Preview.png';

const OnboardingBranch = () => {
  return (
    <>
      <Styled.MenuContainer indentStep={0} isExpanded={false} isSelected={true}>
        <Styled.MenuTitleWrapper>
          {/* {item?.isCategory ? (
             <Styled.CaretIconWrapper>
               {getIcon(item, onExpand, onCollapse)}
             </Styled.CaretIconWrapper>
           ) : (
             <Styled.MenuItemImage src={item?.data?.iconURL} alt="menu-icon" />
           )} */}
          <Styled.MenuItemImage src={ICON_URL} alt="menu-icon-onboarding" />
          <Styled.MenuTitle style={{ pointerEvents: 'none' }}>
            مستندات
          </Styled.MenuTitle>
        </Styled.MenuTitleWrapper>
      </Styled.MenuContainer>
    </>
  );
};

export default OnboardingBranch;
