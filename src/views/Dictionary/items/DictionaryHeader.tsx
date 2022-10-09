import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import { FLEX_RCB, FLEX_RCS } from 'constant/StyledCommonCss';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AvatarWrapper from './AvatarWrapper';

export interface IHeaderProps {
  onCategorySelect?: (props: IHeaderState) => void;
}

export interface IHeaderState {
  category?: string;
  section?: string;
}

const Header: React.FC<IHeaderProps> = ({ onCategorySelect }) => {
  const [state, setState] = useState<IHeaderState>({} as IHeaderState);
  const { RVDic } = window;

  useEffect(() => {
    onCategorySelect && onCategorySelect(state);
  }, [state]);

  const handleCategorySelect = ({ value }: any) => {};

  return (
    <Container>
      <Title>Cliqmind Dictionary</Title>
      <FilterBlock>
        <div style={{ flex: 1 }}>
          <CategorySelect />
        </div>
        <div style={{ flex: 1 }}>
          <SectionSelect />
        </div>
      </FilterBlock>

      <AvatarWrapper />
    </Container>
  );
};

const Container = styled.div`
  ${FLEX_RCB};
  height: 4rem;
  padding: 0 1.5rem;
  background-color: var(--rv-color-warm);
  color: var(--rv-white-color);
  gap: 1rem;
`;

const Title = styled.h1``;

const FilterBlock = styled.div`
  ${FLEX_RCS};
  gap: 1rem;
  max-width: 40rem;
  width: 100%;
`;

const CategorySelect = styled(CustomSelect).attrs({
  placeholder: 'Select Section',
})`
  width: 100%;
`;

const SectionSelect = styled(CustomSelect).attrs({
  placeholder: 'Select Category',
})`
  width: 100%;
`;

export default Header;
function useWindow(): { RVDic: any; RV_RevFloat: any; GlobalUtilities: any } {
  throw new Error('Function not implemented.');
}
