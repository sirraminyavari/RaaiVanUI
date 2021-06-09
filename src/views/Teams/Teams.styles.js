import styled, { css } from 'styled-components';
import {
  C_DISTANT,
  TC_DEFAULT,
  BO_DISTANT,
  BO_WHITE,
  C_GRAY,
  C_RED,
  C_GRAY_DARK,
  BG_GRAY_LIGHT,
} from 'constant/Colors';

export const ViewContainer = styled.div.attrs({
  className: BG_GRAY_LIGHT,
})`
  box-shadow: 1px 5px 15px #0000001f;
  border-radius: 0.7rem;
  margin: 1rem;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const HeaderContainer = styled.div`
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalContentWrapper = styled.div`
  width: 100%;
  padding: 0 5%;
`;

export const ModalButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0rem 0 1rem 0;
`;

export const ModalButtonText = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
`;

export const HeaderTitle = styled.span.attrs({
  className: C_GRAY,
})`
  font-size: 1rem;
`;

export const ContentSide = styled.div`
  width: 50%;
  height: 100%;
  margin: 0;
`;

export const SpaceListConatiner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

export const SpaceConatiner = styled.div`
  width: 100%;
  margin: 0.5rem 0 1rem 0;
`;

export const SpaceHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
`;

export const SpaceHeaderTitle = styled.div.attrs({
  className: C_GRAY_DARK,
})`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1rem;
  font-size: 1rem;
  font-weight: bold;
`;

export const ConfirmSpaceTitle = styled.div.attrs({
  className: C_GRAY,
})`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1rem;
`;

export const ConfirmQuestion = styled.div.attrs({
  className: C_GRAY_DARK,
})`
  margin: 3rem 0 1rem 0;
  font-size: 0.9rem;
  font-weight: bold;
`;

export const ConfirmWarning = styled.div.attrs({
  className: C_RED,
})`
  font-size: 0.8rem;
`;

export const SpaceHeaderActions = styled.div`
  width: 3rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const IconWrapperCss = css`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const TrashIconWrapper = styled.div.attrs((props) => ({
  className: props.isHovered ? C_RED : C_DISTANT,
}))`
  ${IconWrapperCss}
`;

export const SettingIconWrapper = styled.div.attrs((props) => ({
  className: props.isHovered ? TC_DEFAULT : C_DISTANT,
}))`
  ${IconWrapperCss}
`;

export const TeamListConatiner = styled.div`
  white-space: wrap;
  &:after {
    content: '';
    clear: both;
    display: table;
  }
`;

export const TeamConatiner = styled.div`
  width: calc(100% / ${({ isMobile }) => (isMobile ? 1 : 2)} - 0.5rem);
  height: 11.5rem;
  border: ${({ isNew }) =>
    !!isNew ? '2px dashed #bac9dc;' : '1px solid #bac9dc;'}
  border-radius: 0.7rem;
  padding: 0.5rem 1rem;
  position: relative;
  float: left;
  background-color: #fff;
  margin-bottom: 1rem;
  :nth-child(2n+1){
    margin-right: 0.5rem;
  }
  :nth-child(2n){
    margin-left: 0.5rem;
  }

  .team-extra-users {
    background-color: #E6F4F1;
    width: 2rem;
    height: 2rem;
    font-size: 0.8rem;
    color: #2B7BE4;
    line-height: 2rem;
    user-select: none;
  }

  .inactive{
    background-color: #F6F6F7;
    color: #B8B8B8;
  }

  .hidden-arrow{
    display: none;
  }

  .extra-users-popup{
    width: 13rem;
    height: 12rem;
    margin: 0;
    padding: 1rem;
    border: 0;
    box-shadow: 1px 3px 20px #2b7be44d;
    position: relative;
    background-color: #fff;
    right: 7.7rem;
    bottom: -2.9rem;
  }

  .non-scroll{
    height: 100%;
    overflow: scroll;

    ::-webkit-scrollbar {
      display: none; /*! Hide scrollbar for Chrome, Safari and Opera */
    }
    * {
      -ms-overflow-style: none; /*! IE and Edge */
      scrollbar-width: none; /*! Firefox */
    }
  }
`;

export const DragIconWrapper = styled.div`
  position: absolute;
  top: 0.6rem;
  left: 0.2rem;
  cursor: move; /* fallback: no url() support or images disabled */
  cursor: url('https://www.google.com/intl/en_ALL/mapfiles/openhand.cur'),
    all-scroll !important;
`;

export const TeamContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const TeamDescription = styled.div`
  flex-grow: 1;
`;

export const TeamTitle = styled.div.attrs({
  classNAme: C_GRAY_DARK,
})`
  font-size: 1rem;
  margin: 0.5rem 0;
`;

export const TeamExcerpt = styled.div.attrs({
  className: C_GRAY,
})`
  font-size: 0.8rem;
  margin: 0.5rem 0;
`;

export const TeamFooterConatiner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TeamAvatarsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ExtraUsersWrapper = styled.div`
  position: relative;
  left: 0;
`;

export const ExtraUserItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0 0 0.5rem 0;
`;

export const ExtraUserTitle = styled.span.attrs({
  className: C_GRAY,
})`
  margin: 0 0.5rem;
`;

export const TeamTrashWrapper = styled.div.attrs((props) => ({
  className: props.isHovered ? C_RED : C_DISTANT,
}))`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NewTeamWrapper = styled.div.attrs({
  className: C_DISTANT,
})`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const NewTeamLabel = styled.div.attrs({
  className: C_DISTANT,
})`
  margin: 1rem 0 0 0;
`;

export const WelcomeSide = styled.div`
  width: 50%;
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const WorkspaceImageWrapper = styled.div`
  width: 16rem;
  margin-top: 3rem;
  aspect-ratio: 1;
`;

export const WelcomeMSGContainer = styled.div`
  margin: 1rem 0 2rem 0;
`;

export const SocialMediaContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem 0 0 0;
`;

export const IconWrapper = styled.div.attrs((props) => ({
  className: `${C_DISTANT} ${props.isHovered ? BO_DISTANT : BO_WHITE}`,
}))`
  margin: 0 0.5rem;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
`;

export const WelcomeMessage = styled.span.attrs({
  className: C_GRAY,
})`
  font-size: 1rem;
`;
