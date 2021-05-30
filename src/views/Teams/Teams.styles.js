import styled, { css } from 'styled-components';

export const ViewContainer = styled.div`
  background-color: #fcfcfd;
  box-shadow: 1px 5px 15px #0000001f;
  border-radius: 10px;
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
  margin: 2rem 0 1rem 0;
`;

export const ModalButtonText = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
`;

export const HeaderTitle = styled.span`
  color: #707070;
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
  margin: 2rem 0 1rem 0;
`;

export const SpaceHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
`;

export const SpaceHeaderTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1rem;
  color: #2b2727;
  font-size: 1rem;
  font-weight: bold;
`;

export const ConfirmSpaceTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1rem;
  color: #707070;
`;

export const ConfirmQuestion = styled.div`
  margin: 3rem 0 1rem 0;
  font-size: 0.9rem;
  font-weight: bold;
  color: #2b2727;
`;

export const ConfirmWarning = styled.div`
  font-size: 0.8rem;
  color: #e2234f;
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
  color: #bac9dc;
  cursor: pointer;
`;

export const TrashIconWrapper = styled.div`
  ${IconWrapperCss}

  :hover svg {
    color: #e2234f !important;
  }
`;

export const SettingIconWrapper = styled.div`
  ${IconWrapperCss}

  :hover svg {
    color: #2b7be4 !important;
  }
`;

export const TeamListConatiner = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const TeamConatiner = styled.div`
  width: 100%;
  height: 13rem;
  border: ${({ isNew }) =>
    !!isNew ? '2px dashed #BAC9DC;' : '1px solid #bac9dc;'}
  border-radius: 10px;
  padding: 1rem;
  position: relative;
  // cursor: pointer;

  .team-extra-users {
    background-color: #E6F4F1;
    width: 2rem;
    height: 2rem;
    font-size: 0.8rem;
    color: #2B7BE4;
    line-height: 2rem;
    user-select: none;
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
    box-shadow: 1px 1px 5px #333;
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

export const TeamTitle = styled.div`
  font-size: 1rem;
  margin: 0.5rem 0;
  color: #2b2727;
`;

export const TeamExcerpt = styled.div`
  font-size: 0.8rem;
  margin: 0.5rem 0;
  color: #707070;
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
  //TODO: fix it
  left: 0;
`;

export const ExtraUserItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0 0 0.5rem 0;
`;

export const ExtraUserTitle = styled.span`
  margin: 0 0.5rem;
  color: #707070;
`;

export const TeamTrashWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #bac9dc;

  :hover svg {
    color: #e2234f !important;
  }
`;

export const NewTeamWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const NewTeamLabel = styled.div`
  margin: 1rem 0;
  color: #bac9dc;
`;
