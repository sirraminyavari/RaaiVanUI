import styled from 'styled-components';
import ToggleButton from '../../../../../components/Buttons/Toggle/Toggle';

export const ListContainer = styled.table`
  margin: ${({ top, bottom }) => `${top ?? 0}rem auto ${bottom ?? 0}rem auto`};
  display: block;
  width: 100%;
`;

export const ListHeader = styled.tr`
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
`;

export const ListBody = styled.div`
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
