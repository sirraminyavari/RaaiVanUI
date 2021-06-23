import styled from 'styled-components';
import {
  BG_GRAY_LIGHT,
  TC_WARM,
  C_GRAY_DARK,
  BO_DISTANT,
  TC_DEFAULT,
  BG_GRAY_DARK,
  BG_FREEZED,
} from 'constant/Colors';
import {
  BO_RADIUS_HALF,
  BO_RADIUS_UNIT,
  IGNORE_RADIUS_BOTTOM,
} from 'constant/constants';
import sidebarPattern from 'assets/images/pattern_soft.svg';
import Clouds from 'assets/images/clouds.png';

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
  border: 1px solid #333;
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

export const AvatarPencilWrapper = styled.div`
  width: 1.6rem;
  height: 1.6rem;
  position: absolute;
  bottom: 0.5rem;
  right: 4.5rem;
  border-radius: 50%;
  padding: 0.15rem 0.1rem 0 0;
  background-color: blue;
  border: 2px solid #fff;
  opacity: 0;
  cursor: pointer;
  transition: all 0.3s ease;
`;

export const HeaderPencilWrapper = styled.div`
  width: 1.6rem;
  height: 1.6rem;
  position: absolute;
  bottom: 1rem;
  left: 1.5rem;
  border-radius: 50%;
  padding: 0.15rem 0.1rem 0 0;
  background-color: blue;
  border: 2px solid #fff;
  opacity: 0;
  cursor: pointer;
  transition: all 0.3s ease;
`;

export const ProfileAvatarWrapper = styled.div`
  position: absolute;
  bottom: -2rem;
  right: 1.5rem;
  border-radius: 50%;
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
  margin: 1.5rem;
  height: 100vh;
`;
export const ProfileInfoWrapper = styled.div`
  width: 27%;
  margin-top: 2rem;
  position: sticky;
  position: -webkit-sticky;
  top: 6rem;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 0.5px solid #bac9dc;
  border-radius: 7px;
`;
