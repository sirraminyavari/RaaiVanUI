import styled from 'styled-components';
import {
  BG_GRAY_LIGHT,
  TC_WARM,
  C_GRAY_DARK,
  BO_DISTANT,
  TC_DEFAULT,
  BG_GRAY_DARK,
  BG_FREEZED,
  // TBG_DEFAULT,
  C_GRAY,
  TBG_DEFAULT,
  BO_FREEZED,
  TC_VERY_TRANSPARENT,
} from 'constant/Colors';
import {
  BO_RADIUS_CIRCLE,
  BO_RADIUS_HALF,
  BO_RADIUS_QUARTER,
  BO_RADIUS_UNIT,
  IGNORE_RADIUS_BOTTOM,
} from 'constant/constants';
import sidebarPattern from 'assets/images/pattern_soft.svg';
import Clouds from 'assets/images/clouds.png';
import {
  CV_DISTANT,
  CV_FREEZED,
  CV_GRAY,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';

const { RV_Float, RV_RevFloat } = window;

export const ProfileViewContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_HALF}`,
})`
  min-height: calc(100vh - 5.5rem);
  box-shadow: 1px 5px 15px #0000001f;
  margin: 1.5rem;
  padding: 1.5rem;
  position: relative;
  user-select: none;
`;

export const ProfileTitleWrapper = styled.div`
  position: relative;
  top: 2rem;
  right: 0.5rem;
`;

export const ProfileTitle = styled.span.attrs({
  className: TC_WARM,
})`
  font-size: 1.2rem;
  font-weight: bold;
`;

export const ChooseThemeTitle = styled.div.attrs({
  className: C_GRAY_DARK,
})`
  margin: 2.2rem 0 1rem 0;
  font-size: 1rem;
`;

export const PreviewGroups = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 1rem;
`;

export const ProfileContentWrapper = styled.div`
  min-height: calc(100vh - 5.5rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  position: relative;
  margin-top: 5rem;
`;

export const ContentWrapper = styled.div`
  flex-grow: 1;

  .profile-security-toggle {
    width: 70%;
    margin: 2rem 0;
  }
`;

export const FieldTitleWrapper = styled.div`
  dispaly: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 2rem;
`;

export const ChangePassTitle = styled.span.attrs({
  className: C_GRAY_DARK,
})`
  font-size: 1rem;
  font-weight: bold;
  margin: 0.5rem;
`;

export const TwoFactorOptionsWrapper = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_UNIT} ${C_GRAY_DARK}`,
})`
  width: 70%;
  padding: 1rem;
  ${({ enabled }) => !enabled && 'opacity: 0.5;'}
`;

export const CustomizationView = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 1rem;

  .profile-theme-toggle {
    margin: 0.5rem 0;
  }

  .profile-theme-setting {
    width: 25%;
    min-height: 10rem;
    margin: 0;
    margin-${({ dir }) => dir}: 1.5rem;
    padding: 1rem;
    text-align: center;
    position: fixed;
    left: 1rem;
  }
`;

export const ThemeSettingTitle = styled.span.attrs({
  className: TC_DEFAULT,
})`
  display: inline-block;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

export const ThemePreviewContainer = styled.div.attrs((props) => ({
  className: `${BO_RADIUS_HALF} ${
    props.isDark ? BG_GRAY_DARK : BG_FREEZED
  } ${BO_DISTANT}`,
}))`
  width: 100%;
  height: 10rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;

export const NavbarPreview = styled.div`
  width: 100%;
  height: 2rem;
  position: absolute;
  background-color: ${({ previewColor }) => previewColor};
  top: 0;
`;

export const SidebarPreview = styled.div`
  width: ${({ isClose }) => (isClose ? '10%' : '30%')};
  height: 100%;
  background-color: ${({ previewColor }) => previewColor};
  ${({ hasPattern }) =>
    hasPattern && `background-image: url(${sidebarPattern});`}
  position: absolute;
  ${({ dir }) => dir}: 0;
`;

export const PreviewSelectionWrapper = styled.div.attrs({
  className: `${TC_DEFAULT}`,
})`
  position: absolute;
  top: 2rem;
  left: 0;
  width: ${({ isOpen }) => (isOpen ? '70%' : '90%')};
  height: calc(100% - 2rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
`;

export const ProfileHeader = styled.div.attrs({
  className: `${BO_RADIUS_HALF} ${IGNORE_RADIUS_BOTTOM}`,
})`
  position: relative;
  top: 0;
  width: 100%;
  left: 0;
  height: 12rem;
  background-image: url(${Clouds});
  background-position: bottom;
  background-repeat: no-repeat;

  .profile-avatar {
    background-color: #333;
    border-radius: 50%;
  }

  :hover > div {
    opacity: 1;
  }
`;

export const AvatarPencilWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  width: 1.6rem;
  height: 1.6rem;
  position: absolute;
  bottom: 0.5rem;
  right: 4.5rem;
  padding: 0.15rem 0.1rem 0 0;
  background-color: ${TCV_DEFAULT};
  border: 2px solid ${CV_DISTANT};
  opacity: 0;
  cursor: pointer;
  transition: all 0.3s ease;
`;

export const HeaderPencilWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  width: 1.6rem;
  height: 1.6rem;
  position: absolute;
  bottom: 1rem;
  left: 1.5rem;
  padding: 0.15rem 0.1rem 0 0;
  background-color: ${TCV_DEFAULT};
  border: 2px solid ${CV_DISTANT};
  opacity: 0;
  cursor: pointer;
  transition: all 0.3s ease;
`;

export const ProfileAvatarWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  position: absolute;
  bottom: -2rem;
  right: 1.75rem;
  padding: 1rem;

  :hover {
    div {
      opacity: 1;
    }
    ~ div {
      opacity: 0;
    }
  }
`;

export const MainWrapper = styled.div`
  margin: 2.5rem 0;
  padding: 0 1.5rem 0 3rem;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 25% 75%;
  align-items: start;
  gap: 1.5rem;

  @media only screen and (max-width: 900px) {
    grid-template-columns: 33% 66%;
  }

  @media only screen and (max-width: 700px) {
    grid-template-columns: 100%;
    grid-template-rows: min-content;
  }
`;
export const ProfileInfoWrapper = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER} ${BO_DISTANT}`,
})`
  // margin-top: 2rem;
  // position: sticky;
  // position: -webkit-sticky;
  // top: 6rem;
  padding: 1rem 1.5rem;
`;

export const UsenameWrapper = styled.div.attrs({
  className: `${C_GRAY_DARK}`,
})`
  font-size: 1.5rem;
  font-weight: 500;
`;

export const SectionTitle = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  font-size: 0.9rem;
  margin-top: 2.5rem;
`;

export const HeaderStatusContainer = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_QUARTER}`,
})`
  display: flex;
  justify-content: space-between;
  aligni-items: center;
  padding: 0.5rem 0;
`;

export const StatusWrapper = styled.div.attrs({
  className: ``,
})`
  text-align: center;
  width: 33%;
  max-height: 3rem;
  min-height: 3rem;
  color: ${CV_GRAY};
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StatusCount = styled.span.attrs({
  className: `${TC_DEFAULT}`,
})`
  font-size: 1.1rem;
  margin: 0 1rem;
`;

export const LastTopicsContainer = styled.div`
  margin-top: 2rem;
`;

export const LastTopicsList = styled.div`
  border: 1px solid #333;
`;

export const LastTopicsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .see-all-topics-button {
    background-color: transparent;
    width: 9rem;
    height: 2rem;
    border-color: transparent;

    :hover {
      border-color: ${TCV_DEFAULT};
    }
  }
`;

export const LastTopicsTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: ${CV_GRAY};
`;

export const TabsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, auto));
  gap: 0.5rem;
  justify-content: space-between;
  margin-top: 1rem;
`;

export const MoreTopicsContainer = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER}`,
})`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, auto));
  gap: 0.5rem;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding: ${({ isOpen }) => (isOpen ? '1rem' : '0')};
  width: 100%;
  height: ${({ isOpen }) => (isOpen ? '7.5rem' : '0')};
  overflow: hidden;
  box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT};
  transition: all 0.5s ease;
`;

export const TabItemContainer = styled.div.attrs((props) => ({
  className: `${BO_RADIUS_HALF} ${BO_DISTANT} ${props.isActive && TBG_DEFAULT}`,
}))`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.5rem;
  padding: 0 0.5rem;
  cursor: pointer;
`;

export const TabItemTitle = styled.span`
  font-size: 1rem;
  color: ${({ isActive }) => (isActive ? CV_WHITE : TCV_DEFAULT)};
  display: inline-block;
  width: 100%;
  margin-${RV_Float}: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TabItemImage = styled.img.attrs({
  className: BO_RADIUS_CIRCLE,
})`
  width: 2rem;
  min-width: 2rem;
`;

export const TopicItemWrapper = styled.div.attrs({
  className: `${BO_RADIUS_HALF} ${BO_FREEZED}`,
})`
  width: 100%;
  height: 5rem;
  margin: 0.5rem 0;
  padding-${RV_RevFloat}: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .topic-option-orange{
    color: orange;
  }
`;

export const TopicItemIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-${RV_RevFloat}: 2px solid ${CV_FREEZED};
  width: 6rem;
  height: 80%;
`;

export const TopicItemContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const TopicItemContentTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  padding: 0 1rem;
`;

export const TopicItemContentActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;
