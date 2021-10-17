import styled from 'styled-components';

export const SearchViewContainer = styled.div`
  width: 100%;
`;
export const Container = styled.div`
  display: flex;
  flex-direction: ${({ rtl }) => (rtl ? 'row' : 'row-reverse')};
  width: 100%;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 2rem 2rem 2rem;
`;

export const SearchDesktopMain = styled.div`
  box-shadow: 1px 3px 20px #0000001f;
  border-radius: 1rem;
  padding: 1rem;
  width: ${({ advancedFilterOpen }) =>
    advancedFilterOpen ? '100%' : 'calc(100% - 25rem )'};
`;

export const AdvancedFilterContainer = styled.div`
  box-shadow: 1px 3px 20px #0000001f;
  border-radius: 1rem;
  padding: 1rem;
  width: 25rem;
`;

export const FilterBarWrapper = styled.div`
  display: flex;
  flex-direction: ${({ rtl }) => (rtl ? 'row' : 'row-reverse')};
`;
