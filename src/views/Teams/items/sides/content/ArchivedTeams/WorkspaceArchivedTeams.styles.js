import styled from 'styled-components';
import { CV_GRAY_LIGHT } from 'constant/CssVariables';
import { C_RED } from 'constant/Colors';

export const ArchivedTeamsModalContainer = styled.div`
  .archived-teams-title {
    position: fixed;
    width: ${({ modalWidth }) => modalWidth};
    padding: 1rem;
    background-color: ${CV_GRAY_LIGHT};
    z-index: 1000;
  }

  .archived-teams {
    max-height: calc(100vh - 4.5rem);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
`;

export const ModalContentWrapper = styled.div`
  width: calc(100% + 2rem);
  height: calc(100vh - 17rem);
  overflow: scroll;
  margin-top: 2.5rem;
  margin-inline-start: -1rem;
  padding: 0 1rem;
`;

export const ArchivedTeamWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.9rem 0;
`;

export const ArchivedTeamDescription = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  width: calc(100% - 5rem);
`;

export const ArchivedTeamTitle = styled.span`
  margin: 0 1rem;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ArchivedWrapper = styled.div.attrs({
  className: C_RED,
})`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  font-size: 1rem;
`;

export const ArchivedTeamsLabel = styled.div.attrs({
  className: C_RED,
})`
  margin: 1rem 0 0 0;

  &:first-letter {
    text-transform: uppercase;
  }
`;
