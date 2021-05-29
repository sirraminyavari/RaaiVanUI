import styled from 'styled-components';

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

export const SpaceHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
`;

export const TeamListConatiner = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const TeamConatiner = styled.div`
  width: 100%;
  height: 12rem;
  border: ${({ isNew }) =>
    !!isNew ? '2px dashed #BAC9DC;' : '1px solid #bac9dc;'}
  border-radius: 10px;
  padding: 1rem;
  position: relative;
  cursor: pointer;
`;

export const DragIconWrapper = styled.div`
  position: absolute;
  top: 0.6rem;
  left: 0.2rem;
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

export const TeamTrashWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
