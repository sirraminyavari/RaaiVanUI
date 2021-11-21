import styled from 'styled-components';
import ToggleButton from '../../../../../components/Buttons/Toggle/Toggle';

export const ListContainer = styled.table`
  margin: ${({ top, bottom }) => `${top ?? 0}rem auto ${bottom ?? 0}rem auto`};
  display: block;
  width: 100%;
`;

export const ListHeader = styled.thead`
  display: block;
`;

export const ListHeaderRow = styled.tr`
  display: block;
  height: 2.8rem;
  line-height: 2.8rem;
  border-bottom: 0.08rem solid var(--rv-color-distant);
  color: var(--rv-color-distant);
`;

export const ListHeaderItem = styled.th`
  display: inline-block;
  width: ${({ width }) => width}%;
  text-align: ${({ centralized }) => (centralized ? 'center' : 'auto')};
  font-weight: 400;
`;

export const ListBody = styled.tbody`
  display: block;
  transition: height 0.25s ease-in;
`;

export const ListRow = styled.tr`
  display: block;
  height: 5.125rem;
  line-height: 5.125rem;
  border-bottom: 0.08rem solid var(--rv-color-distant);
`;

export const ListBodyItem = styled.td`
  display: inline-block;
  width: ${({ width }) => width}%;
  overflow: hidden;
`;

export const ShowMoreButton = styled.button`
  background-color: white;
  outline: none;
  border: none;
  width: 9.7rem;
  height: 2rem;
  line-height: 2rem;
  color: var(--rv-color-actionbutton);
  border-radius: 0.45rem;
  margin-top: 0.7rem;

  &:hover {
    border: 1px solid var(--rv-color-actionbutton);
  }
`;
