import styled, { css } from 'styled-components';
import {
  BG_GRAY_LIGHT,
  TC_WARM,
  C_GRAY_DARK,
  BO_DISTANT,
  TC_DEFAULT,
  BG_GRAY_DARK,
  BG_FREEZED,
  C_GRAY,
  TBG_DEFAULT,
  BO_FREEZED,
  TBG_WARM,
  BG_WHITE,
} from 'constant/Colors';
import {
  BO_RADIUS_CIRCLE,
  BO_RADIUS_HALF,
  BO_RADIUS_QUARTER,
  BO_RADIUS_UNIT,
  IGNORE_RADIUS_BOTTOM,
  IGNORE_RADIUS_LEFT,
  IGNORE_RADIUS_RIGHT,
} from 'constant/constants';
import sidebarPattern from 'assets/images/pattern_soft.svg';
// import Clouds from 'assets/images/clouds.png';
import {
  CV_DISTANT,
  CV_FREEZED,
  CV_GRAY,
  CV_GRAY_DARK,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
  TCV_WARM,
} from 'constant/CssVariables';

const { RV_Float, RV_RevFloat, RV_RTL, GlobalUtilities } = window;

export const ProfileViewContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_HALF}`,
})`
  min-height: calc(100vh - 5.5rem);
  box-shadow: 1px 5px 15px #0000001f;
  margin: 1.5rem;
  padding: 1.5rem;
  position: relative;
  user-select: none;

  .profile-image-crop-modal {
    color: ${TCV_DEFAULT};
  }
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
  grid-template-columns: repeat(auto-fill, minmax(13.5rem, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const ProfileContentWrapper = styled.div`
  min-height: calc(100vh - 5.5rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  position: relative;
  margin-top: 3rem;
`;

export const ContentWrapper = styled.div`
  flex-grow: 1;

  .profile-security-toggle {
    width: 70%;
    margin: 1rem 0 2rem 0;
  }
`;

export const FieldTitleWrapper = styled.div`
  dispaly: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 1.5rem 0;
`;

const changeButtonCss = css`
  width: 4rem;
  background: none;
  border: 0;
`;

export const InputWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;

  .change-id-button {
    ${changeButtonCss}

    :hover {
      ${({ isIDButtonActive }) =>
        isIDButtonActive && `border: 1px solid ${TCV_DEFAULT};`}
    }
  }

  .change-email-button {
    ${changeButtonCss}

    :hover {
      border: 1px solid ${TCV_DEFAULT};
    }
  }
`;

export const FieldTitle = styled.span.attrs({
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
    min-width: 18rem;
    min-height: 10rem;
    margin: 0;
    margin-${({ dir }) => dir}: 1rem;
    padding: 1rem;
    text-align: center;
    position: fixed;
   ${RV_RevFloat}: 1rem;
  }
`;

export const ThemeSettingTitle = styled.span.attrs({
  className: TC_DEFAULT,
})`
  display: inline-block;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const activePreviewCss = css`
  border: 0.1rem solid ${TCV_DEFAULT};
  box-shadow: 2px 3px 15px ${TCV_VERY_TRANSPARENT};
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
  box-sizing: content-box;
  ${({ isActive }) => isActive && activePreviewCss};
`;

export const NavbarPreview = styled.div.attrs({
  className: `${BO_RADIUS_HALF} ${IGNORE_RADIUS_BOTTOM}`,
})`
  width: 100%;
  height: 2rem;
  position: absolute;
  background-color: ${({ previewColor }) => previewColor};
  top: 0;
`;

export const SidebarPreview = styled.div.attrs({
  className: `${BO_RADIUS_HALF} ${
    RV_RTL ? IGNORE_RADIUS_LEFT : IGNORE_RADIUS_RIGHT
  }`,
})`
  width: ${({ isClose }) => (isClose ? '10%' : '30%')};
  height: 100%;
  background-color: ${({ previewColor }) => previewColor};
  ${({ hasPattern }) =>
    hasPattern && `background-image: url(${sidebarPattern});`}
  position: absolute;
  ${({ dir }) => dir}: 0;
  transition: all 0.7s ease;
`;

export const PreviewSelectionWrapper = styled.div.attrs({
  className: `${TC_DEFAULT}`,
})`
  position: absolute;
  top: 2rem;
  ${RV_RevFloat}: 0;
  width: ${({ isOpen }) => (isOpen ? '70%' : '90%')};
  height: calc(100% - 2rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  transition: all 0.7s ease;
`;

const defaultCover = GlobalUtilities.icon('DefaultCoverPhoto.jpg');
export const ProfileHeader = styled.div.attrs({
  className: `${BO_RADIUS_HALF} ${IGNORE_RADIUS_BOTTOM}`,
})`
  position: relative;
  top: 0;
  width: 100%;
  left: 0;
  height: 12rem;
  background-image: url(${({ coverImage }) => coverImage || defaultCover});
  background-size: cover;
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

export const HeaderCoverLoader = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
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
  className: `${BO_RADIUS_QUARTER} ${BO_DISTANT} ${BG_WHITE}`,
})`
  // margin-top: 2rem;
  // position: sticky;
  // position: -webkit-sticky;
  // top: 6rem;
  padding: 1rem 1.5rem;
  min-height: 100vh;

  .inline-text-profile-info-name {
    font-size: 1.5rem;
    font-weight: 500;
  }
`;

export const UsenameWrapper = styled.div.attrs({
  className: `${C_GRAY_DARK}`,
})`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  font-size: 0.9rem;
  margin-top: 2.5rem;
`;

export const HeaderStatusContainer = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_QUARTER} ${BG_WHITE}`,
})`
  display: flex;
  justify-content: space-between;
  aligni-items: center;
  padding: 0.5rem 0;
`;

export const StatusWrapper = styled.div.attrs({
  className: `${BG_WHITE}`,
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
  padding-bottom: 2rem;
`;

export const LastTopicsList = styled.div`
  border: 1px solid #333;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .see-all-button {
    background-color: transparent;
    width: 9rem;
    height: 1.8rem;
    border-color: transparent;
    border-radius: 1rem;

    :hover {
      border-color: ${TCV_DEFAULT};
    }
  }
`;

export const Title = styled.span`
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
  max-height: ${({ isOpen }) => (isOpen ? '10.4rem' : '0')};
  overflow: hidden;
  box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT};
  transition: all 0.5s ease;
`;

export const TabItemContainer = styled.div.attrs((props) => ({
  className: `${BO_RADIUS_HALF} ${BO_DISTANT} ${
    props.isActive ? (props.hasMore ? TBG_WARM : TBG_DEFAULT) : BG_WHITE
  }`,
}))`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.5rem;
  padding: 0 0.5rem;
  cursor: pointer;

  .tab-item-tooltip {
    border-radius: 50%;
    width: auto;
    min-width: 2.2rem;
    padding: 0.4rem 0.35rem;
    font-size: 0.9rem;
    text-align: center;
  }
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
  className: `${BO_RADIUS_HALF} ${BO_FREEZED} ${BG_WHITE}`,
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

export const PostItemWrapper = styled.div.attrs({
  className: `${BO_RADIUS_HALF} ${BO_FREEZED}`,
})`
  width: 100%;
  height: 7rem;
  margin: 0.5rem 0;
  padding-${RV_RevFloat}: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

export const TopicItemCreationDate = styled.span`
  font-size: 0.7rem;
  color: ${CV_GRAY};
`;

export const TopicItemContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const TopicItemTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  padding: 0 1rem;
`;

export const TopicItemTitle = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: ${TCV_WARM};
`;

export const TopicItemContentActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

export const LastPostsContainer = styled.div`
  margin: 2rem 0;
`;

export const InfoItemWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  // height:   2rem;
  margin: 1rem 0;
  position: relative;

  .user-info-inline-edit-container {
    margin: 0 1rem;
    flex-grow: 1;
    color: ${CV_DISTANT};
    font-size: 1rem;
    width: 80%;
    border-bottom: 1px solid ${CV_DISTANT};

    :focus-within {
      border-bottom: 1px solid ${CV_GRAY_DARK};
      color: ${CV_GRAY_DARK};
    }
  }

  .user-info-inline-edit-text {
    width: 100%;
    color: ${CV_GRAY_DARK};
  }

  .user-info-inline-edit-textarea {
    min-height: 1rem;
  }

  .user-info-inline-edit-input {
    ::placeholder {
      color: ${CV_DISTANT};
    }
  }
`;

export const InfoItemError = styled.div`
  position: absolute;
  top: 2rem;
  ${RV_Float}: 2.3rem;
  font-size: 0.7rem;
  color: ${CV_RED};
`;

export const InfoItemText = styled.div`
  margin: 0 1rem;
  flex-grow: 1;
  color: ${({ hasText }) => (hasText ? CV_GRAY_DARK : CV_DISTANT)};
  font-size: 1rem;
  width: 100%;
  text-align: justify;
  white-space: normal;
`;

export const VerificationCodeContainer = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER} ${BO_DISTANT}`,
})`
  width: 70%;
  padding: 1rem;
`;

export const VerificationForm = styled.form`
  margin: 1.5rem 0;
`;

export const VerificationInputsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-direction: row-reverse;
`;

export const VerificationInputWrapper = styled.div`
  max-width: 2.2rem;
`;

export const VerificationFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
`;

export const ImageCropperWrapper = styled.div`
  widht: 100%;
  height: 100%;
  text-align: center;
`;

export const CropperButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3.5rem;
`;

export const ImageCropperContainer = styled.div`
  position: relative;
  height: 17rem;
  width: 100%;
`;

export const SliderWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  top: 18rem;
`;
